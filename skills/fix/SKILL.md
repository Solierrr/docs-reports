---
name: fix
description: Como receber e aplicar os apontamentos do reviewer ou da reflexão do orchestrator num ciclo de correção. Use no writer e no builder sempre que voltarem a um documento com pendências.
---

# Aplicar uma revisão

Um ciclo de correção existe para resolver pendências, não para refazer o documento. O risco é o ciclo que só mexe: muda muita coisa, resolve pouco e cria falha nova.

## Antes de mudar

1. Leia as pendências do ciclo (`.work/NNN/review.md` e a decisão no `log.md`) e liste só as que são suas: conteúdo e fonte para o writer; montagem, texto cortado, contraste e organização para o builder.
2. Para cada uma, confira no documento se ela procede. Pendência que não procede não é ignorada em silêncio: responda no seu relato com o motivo e a evidência (página, trecho).
3. Pendência ambígua: pergunte ao orchestrator antes de adivinhar.

## Ao mudar

- Corrija só o que foi apontado, no menor trecho possível. Não reescreva seção aprovada, não troque estrutura nem melhore o que ninguém pediu.
- Se a correção certa exigir mexer além do apontado (por exemplo, um texto que, corrigido, empurra uma tabela para a página seguinte), faça e diga.
- Builder: rode `sh scripts/check.sh NNN` depois de cada rodada de mudanças.

## Relato

Uma linha por pendência: número, o que mudou e onde, ou por que não mudou. No fim, o que pode ter sido afetado indiretamente, para o reviewer olhar. Nunca declare uma pendência resolvida sem ter conferido o resultado.
