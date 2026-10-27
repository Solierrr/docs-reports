#!/bin/sh
# Gera documents/NNN/index.html a partir do source.html: gráficos, sumário, paginação, CSS e logo embutidos.
set -eu
cd "$(dirname "$0")/.."

[ $# -eq 1 ] || {
  echo "uso: sh scripts/build.sh <NNN>" >&2
  exit 1
}
doc=documents/$1
[ -f "$doc/source.html" ] || {
  echo "$doc/source.html não existe" >&2
  exit 1
}
[ -d gallery/node_modules/pagedjs ] || npm --prefix gallery ci --ignore-scripts --silent
node gallery/tools/paginate.mjs "$doc/source.html" "$doc/index.html"
