#!/bin/sh
# Converte documents/NNN/index.html em documents/NNN/NNN.pdf com Chrome ou Edge headless.
set -eu
cd "$(dirname "$0")/.."

[ $# -eq 1 ] || {
  echo "uso: sh scripts/pdf.sh <NNN>" >&2
  exit 1
}
number=$1
html=documents/$number/index.html
pdf=documents/$number/$number.pdf
[ -f "$html" ] || {
  echo "$html não existe" >&2
  exit 1
}

find_browser() {
  if [ -n "${BROWSER:-}" ]; then
    echo "$BROWSER"
    return
  fi
  while IFS= read -r candidate; do
    [ -x "$candidate" ] && {
      echo "$candidate"
      return
    }
  done <<EOF
/c/Program Files/Google/Chrome/Application/chrome.exe
/c/Program Files (x86)/Google/Chrome/Application/chrome.exe
/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe
/c/Program Files/Microsoft/Edge/Application/msedge.exe
/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge
EOF
  for name in google-chrome google-chrome-stable chromium chromium-browser microsoft-edge; do
    command -v "$name" && return
  done
  return 0
}

browser=$(find_browser)
[ -n "$browser" ] || {
  echo "nenhum Chrome ou Edge encontrado; defina BROWSER=/caminho/do/navegador" >&2
  exit 1
}

# Perfil temporário: impede que um navegador já aberto receba a chamada e saia sem gerar o arquivo.
profile=$(mktemp -d)
trap 'rm -rf "$profile"' EXIT
source=$(pwd)/$html
target=$(pwd)/$pdf
if command -v cygpath >/dev/null 2>&1; then
  url="file:///$(cygpath -m "$source")"
  target=$(cygpath -w "$target")
  profile_arg=$(cygpath -w "$profile")
else
  url="file://$source"
  profile_arg=$profile
fi

rm -f "$pdf"
"$browser" --headless=new --disable-gpu --no-first-run --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw --user-data-dir="$profile_arg" \
  --print-to-pdf="$target" "$url" >/dev/null 2>&1 || true

tries=0
while [ ! -s "$pdf" ] && [ "$tries" -lt 30 ]; do
  sleep 1
  tries=$((tries + 1))
done
[ -s "$pdf" ] || {
  echo "o navegador não gerou $pdf" >&2
  exit 1
}

pages=$(grep -aoE '/Type */Page([^s]|$)' "$pdf" | wc -l | tr -d ' ')
echo "$pdf ($pages páginas)"
