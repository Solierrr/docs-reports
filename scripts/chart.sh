#!/bin/sh
# Desenha os gráficos de documents/NNN/index.html: cada bloco data-chart vira um SVG estático com a paleta Solaria.
set -eu
cd "$(dirname "$0")/.."

[ $# -eq 1 ] || {
  echo "uso: sh scripts/chart.sh <NNN>" >&2
  exit 1
}
[ -d gallery/node_modules/echarts ] || npm --prefix gallery ci --ignore-scripts --silent
node gallery/charts/render.mjs "documents/$1/index.html"
