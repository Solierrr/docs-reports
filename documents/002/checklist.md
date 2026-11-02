---
number: "002"
title: "Relatório gerencial da Solaria"
type: report
slug: management
created: 2026-11-02
sample: true
---

# Checklist do documento 002

## Itens deste documento

Escritos pelo orchestrator junto com a spec e aprovados pelo usuário: o que, só neste contexto, prova que o documento atende ao pedido. Marque cada item quando um ciclo o comprovar.

- [x] A capa traz a pergunta-guia como título e o selo de dados fictícios (ambiente QA).
- [x] Cada KPI tem nome, fórmula, resultado, interpretação e importância (tabela da seção "Do dado bruto aos indicadores").
- [x] Cada constatação responde a uma pergunta escrita na página e usa um gráfico com função analítica (funil, boxplot, histograma, dumbbell, heatmap, linha).
- [x] A tabela de decisão liga evidência, constatação, decisão e recomendação, com retorno, risco e oportunidade nomeados.
- [x] A resposta à pergunta-guia cabe em duas frases e traz o pedido à Diretoria.
- [x] A proveniência lista, para cada número, a fórmula, a aba e a coluna da planilha.
- [x] Nenhum número do texto diverge das planilhas `inputs/` (recalculado pelo reviewer).

## Ciclos

| Ciclo | check.sh | Reviewer | Reflexão | Decisão |
| --- | --- | --- | --- | --- |
| 1 | ok 002 | Pendências a resolver (5 bloqueantes) | Mensagem central contraditória e afirmações sem fonte | Corrigir |
| 2 | ok 002 | Pendências a resolver (2 bloqueantes por regressão) | `&nbsp;` literal e números quebrados nas tabelas | Corrigir |
| 3 | ok 002 | Aprovado sem pendências relevantes | Só pendências menores, registradas no `log.md` | Aprovar e gerar PDF |
