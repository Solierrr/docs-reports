#!/bin/sh
# Cria o próximo documento numerado: documents/NNN/ com o modelo e o checklist, e .work/NNN/ com o trabalho.
set -eu
cd "$(dirname "$0")/.."

usage() {
  echo 'uso: sh scripts/new.sh <report|manual|document> <slug> "<título>"' >&2
  exit 1
}
[ $# -eq 3 ] || usage
type=$1
slug=$2
title=$3
case $type in report | manual | document) ;; *) usage ;; esac
case $slug in '' | *[!a-z0-9]*)
  echo "slug: uma palavra em inglês, minúsculas e sem hífen" >&2
  exit 1
  ;;
esac
[ -n "$title" ] || usage

last=$(ls -1 documents 2>/dev/null | grep -E '^[0-9]{3}$' | sort | tail -n 1 || true)
count=$(echo "${last:-0}" | sed 's/^0*//')
number=$(printf '%03d' $((${count:-0} + 1)))
doc=documents/$number
work=.work/$number
[ ! -e "$doc" ] || {
  echo "$doc já existe" >&2
  exit 1
}

# Preenche {{number}}, {{title}}, {{type}}, {{slug}} e {{date}} sem interpretar caracteres do título.
fill() {
  NUMBER=$number TITLE=$(printf '%s' "$title" | sed 's/"/\\"/g') TYPE=$type SLUG=$slug DATE=$(date +%F) awk '
    function put(text, key, value,   at) {
      while ((at = index(text, "{{" key "}}")) > 0)
        text = substr(text, 1, at - 1) value substr(text, at + length(key) + 4)
      return text
    }
    {
      line = put($0, "number", ENVIRON["NUMBER"]); line = put(line, "title", ENVIRON["TITLE"])
      line = put(line, "type", ENVIRON["TYPE"]); line = put(line, "slug", ENVIRON["SLUG"])
      print put(line, "date", ENVIRON["DATE"])
    }' "$1" >"$2"
}

mkdir -p "$doc" "$work/captures"
cp "templates/$type.html" "$doc/index.html"
fill checklists/document.md "$doc/checklist.md"
fill templates/spec.md "$work/spec.md"
for file in content review log; do
  printf '# %s %s\n\n' "$file" "$number" >"$work/$file.md"
done

echo "$number criado ($type: $slug)"
echo "  $doc/index.html"
echo "  $doc/checklist.md"
echo "  $work/spec.md content.md review.md log.md captures/"
if [ -n "${last:-}" ]; then
  previous=$(sed -n 's/^title: *"\(.*\)"$/\1/p' "documents/$last/checklist.md" 2>/dev/null | head -n 1 | sed 's/\\"/"/g')
  echo "anterior: $last ${previous:-(sem título)}"
fi
