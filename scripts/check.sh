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
source=$doc/source.html
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

if [ ! -f "$source" ]; then
  fail source "$source não existe"
else
  lines=$(grep -n 'class="sample"' "$source" | cut -d: -f1 | sample)
  [ -z "$lines" ] || fail example "selo de exemplo do modelo na linha $lines"

  grep -qiE '<html[^>]* lang="[^"]+"' "$source" || fail lang "<html> sem lang"

  title=$(sed -n 's:.*<title>\(.*\)</title>.*:\1:p' "$source" | head -n 1)
  [ -n "$title" ] || fail title "<title> vazio"
  for template in templates/*.html; do
    [ "$title" != "$(sed -n 's:.*<title>\(.*\)</title>.*:\1:p' "$template" | head -n 1)" ] || fail title "<title> ainda é o do modelo"
  done

  ids=$(grep -oE ' id="[^"]+"' "$source" | sed 's/ id="\(.*\)"/\1/' | sort | uniq -d | sample)
  [ -z "$ids" ] || fail id "repetidos: $ids"

  missing=""
  for target in $(grep -oE 'href="#[^"]+"' "$source" | sed 's/href="#\(.*\)"/\1/' | sort -u); do
    grep -q " id=\"$target\"" "$source" || missing="$missing $target"
  done
  [ -z "$missing" ] || fail anchor "sem destino:$missing"

  broken=""
  for image in $(grep -oE '<img[^>]* src="[^"]+"' "$source" | sed 's/.* src="\([^"]*\)"/\1/' | grep -v '^data:' | sort -u); do
    case $image in
    http://* | https://* | //*) broken="$broken $image" ;;
    *) [ -f "$doc/$image" ] || broken="$broken $image" ;;
    esac
  done
  [ -z "$broken" ] || fail image "não embutidas ou inexistentes:$broken"

  remote=$(grep -niE '<script|<link[^>]+href="(https?:)?//|@import|url\(["'\'']?(https?:)?//' "$source" | cut -d: -f1 | sample)
  [ -z "$remote" ] || fail remote "script ou recurso externo nas linhas $remote"

  noalt=$(grep -oE '<img[^>]*>' "$source" | grep -vc ' alt=')
  [ "$noalt" -eq 0 ] || fail alt "$noalt imagens sem alt"
fi

if [ ! -f "$html" ]; then
  fail build "$html não existe; rode sh scripts/build.sh $number"
elif [ -f "$source" ] && [ "$html" -ot "$source" ]; then
  fail build "$html mais antigo que o source.html; rode sh scripts/build.sh $number"
else
  grep -q '<script' "$html" && fail build "$html tem script; gere de novo com o build"
  grep -q 'class="pagedjs_page' "$html" || fail build "$html não está paginado"
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
    fail pdf "$pdf mais antigo que o index.html; rode sh scripts/pdf.sh $number"
  fi
fi

[ "$fails" -eq 0 ] || exit 1
echo "ok $number"
