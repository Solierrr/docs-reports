#!/bin/sh
# Mapa barato do repositório: imprime só os cabeçalhos YAML. Com "docs", lista os documentos.
set -eu
cd "$(dirname "$0")/.."

if [ "${1:-}" = docs ]; then
  found=0
  for dir in documents/[0-9][0-9][0-9]; do
    [ -d "$dir" ] || continue
    found=1
    number=${dir#documents/}
    checklist=$dir/checklist.md
    title=$(sed -n 's/^title: *"\(.*\)"$/\1/p' "$checklist" 2>/dev/null | head -n 1 | sed 's/\\"/"/g')
    type=$(sed -n 's/^type: *//p' "$checklist" 2>/dev/null | head -n 1 | sed 's/\\"/"/g')
    done=$(grep -cE '^- \[[xX]\] +[^[:space:]]' "$checklist" 2>/dev/null || true)
    total=$(grep -cE '^- \[[ xX]\] +[^[:space:]]' "$checklist" 2>/dev/null || true)
    [ -f "$dir/$number.pdf" ] && output="html+pdf" || output="html"
    echo "$number ${type:-?} \"${title:-sem título}\" itens ${done:-0}/${total:-0} $output"
  done
  [ "$found" -eq 1 ] || echo "nenhum documento"
  exit 0
fi

find . -name '*.md' -not -path './gallery/*' -not -path './.work/*' -not -path './.git/*' \
  -not -path './.github/*' -not -path './documents/*' -not -path './.claude/*' -not -name CHANGELOG.md |
  sort | while IFS= read -r file; do
  awk -v file="${file#./}" '
    NR == 1 && $0 != "---" { exit }
    NR > 1 && $0 == "---" { exit }
    /^(purpose|role|description): / { sub(/^[a-z]+: /, ""); text = $0 }
    /^read: / { sub(/^read: /, ""); read = $0 }
    END { if (text != "") printf "%s: %s%s\n", file, text, (read != "" ? " [" read "]" : "") }
  ' "$file"
done
