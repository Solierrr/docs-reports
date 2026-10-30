#!/bin/sh
# Publica um documento: verifica, cria a branch docs/NNN a partir da main, commita só documents/NNN e abre a PR.
set -eu
cd "$(dirname "$0")/.."

[ $# -eq 1 ] || {
  echo "uso: sh scripts/commit.sh <NNN>" >&2
  exit 1
}
number=$1
doc=documents/$number
sh scripts/check.sh "$number" || exit 1
[ -f "$doc/$number.pdf" ] || {
  echo "falta $doc/$number.pdf; rode sh scripts/pdf.sh $number" >&2
  exit 1
}

slug=$(sed -n 's/^slug: *//p' "$doc/checklist.md" | head -n 1)
title=$(sed -n 's/^title: *"\(.*\)"$/\1/p' "$doc/checklist.md" | head -n 1 | sed 's/\\"/"/g')
branch=docs/$number
start=$(git rev-parse --abbrev-ref HEAD)

git fetch -q origin main
if git cat-file -e "origin/main:$doc/index.html" 2>/dev/null; then
  message="docs: update $number $slug"
else
  message="docs: add $number $slug"
fi

if git show-ref -q --verify "refs/heads/$branch"; then
  git switch -q "$branch"
elif [ "$start" != "$branch" ]; then
  git switch -q -c "$branch" origin/main
fi

git add -- "$doc"
if [ -n "${AI_TRAILER:-}" ]; then
  git commit -q -m "$message" -m "$AI_TRAILER" -- "$doc"
else
  git commit -q -m "$message" -- "$doc"
fi
git push -q -u origin "$branch"

body="## Objetivo

Publicar o documento $number: $title.

## Alterações

- \`$doc/source.html\` e \`$doc/index.html\`
- \`$doc/$number.pdf\`
- \`$doc/checklist.md\`, com os itens deste documento e os ciclos de revisão

## Como validar

Abrir o HTML e o PDF e conferir o \`checklist.md\`."

if command -v gh >/dev/null 2>&1; then
  # Só reaproveita uma PR aberta: a de um ciclo anterior, já mergeada, não recebe a atualização.
  url=$(gh pr list --head "$branch" --state open --json url -q '.[0].url' 2>/dev/null)
  [ -n "$url" ] || url=$(gh pr create --base main --head "$branch" --title "$message" --body "$body")
  echo "$url"
else
  echo "gh não encontrado; abra a PR da branch $branch à mão"
fi

[ "$start" = "$branch" ] || [ "$start" = HEAD ] || git switch -q "$start"
