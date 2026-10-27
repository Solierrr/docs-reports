#!/bin/sh
# Verificações estruturais de checklists/structure.md. Imprime só as falhas; "ok NNN" quando não há nenhuma.
set -u
cd "$(dirname "$0")/.."

[ $# -eq 1 ] || {
  echo "uso: sh scripts/check.sh <NNN>" >&2
  exit 1
}
number=$1
doc=documents/$number
html=$doc/index.html
checklist=$doc/checklist.md
pdf=$doc/$number.pdf
fails=0

fail() {
  echo "$1: $2"
  fails=$((fails + 1))
}

# Junta até três exemplos numa linha.
sample() { head -n 3 | tr '\n' ' ' | sed 's/ $//'; }

if [ ! -f "$html" ]; then
  fail html "$html não existe"
else
  count=$(grep -c -e '{{' -e '}}' -e 'data-slot' "$html")
  [ "$count" -eq 0 ] || fail slot "$count linhas com marcador, primeiras: $(grep -n -e '{{' -e '}}' -e 'data-slot' "$html" | cut -d: -f1 | sample)"

  grep -qiE '<html[^>]* lang="[^"]+"' "$html" || fail lang "<html> sem lang"

  grep -qiE '<title>[^<]*[^<[:space:]][^<]*</title>' "$html" || fail title "<title> vazio"

  ids=$(grep -oE ' id="[^"]+"' "$html" | sed 's/ id="\(.*\)"/\1/' | sort | uniq -d | sample)
  [ -z "$ids" ] || fail id "repetidos: $ids"

  missing=""
  for target in $(grep -oE 'href="#[^"]+"' "$html" | sed 's/href="#\(.*\)"/\1/' | sort -u); do
    grep -q " id=\"$target\"" "$html" || missing="$missing $target"
  done
  [ -z "$missing" ] || fail anchor "sem destino:$(echo "$missing" | tr ' ' '\n' | sed '/^$/d' | sample | sed 's/^/ /')"

  broken=""
  for source in $(grep -oE '<img[^>]* src="[^"]+"' "$html" | sed 's/.* src="\([^"]*\)"/\1/' | grep -v '^data:' | sort -u); do
    case $source in
    http://* | https://* | //*) broken="$broken $source" ;;
    *) [ -f "$doc/$source" ] || broken="$broken $source" ;;
    esac
  done
  [ -z "$broken" ] || fail image "não embutidas:$(echo "$broken" | tr ' ' '\n' | sed '/^$/d' | sample | sed 's/^/ /')"

  remote=$(grep -niE '<script|<link[^>]+href="(https?:)?//|@import|url\(["'\'']?(https?:)?//' "$html" | cut -d: -f1 | sample)
  [ -z "$remote" ] || fail remote "recurso externo ou script nas linhas $remote"

  noalt=$(grep -oE '<img[^>]*>' "$html" | grep -vc ' alt=')
  [ "$noalt" -eq 0 ] || fail alt "$noalt imagens sem alt"
fi

if [ ! -f "$checklist" ]; then
  fail meta "$checklist não existe"
else
  for key in title type slug; do
    head -n 8 "$checklist" | grep -qE "^$key: *[^[:space:]{]" || fail meta "checklist.md sem $key"
  done
  grep -qE '^- \[[ xX]\] +[^[:space:]]' "$checklist" || fail item "checklist.md sem itens deste documento"
fi

if [ -e "$pdf" ]; then
  if [ ! -s "$pdf" ]; then
    fail pdf "$pdf vazio"
  elif [ -f "$html" ] && [ "$pdf" -ot "$html" ]; then
    fail pdf "$pdf mais antigo que o HTML; rode sh scripts/pdf.sh $number"
  fi
fi

[ "$fails" -eq 0 ] || exit 1
echo "ok $number"
