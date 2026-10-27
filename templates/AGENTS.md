---
name: templates
purpose: Modelos por tipo, já com conteúdo de exemplo, e o esqueleto da spec. O agente reescreve o exemplo; a estrutura fica.
read: o builder antes de montar; o writer para ver as seções e os componentes do tipo
---

# Modelos

Cada modelo é um documento completo com conteúdo de exemplo realista: mostra a ordem das informações, os componentes de [design/document.css](../design/document.css) e o tom de cada tipo. É também o que a galeria mostra.

| Modelo | Tipo | Estrutura |
| --- | --- | --- |
| [report.html](report.html) | Relatório gerencial | Capa → sumário → sumário executivo (KPIs, SCQA, decisão pedida) → capítulos com título-ação e pergunta da página → recomendação e proveniência → contracapa |
| [manual.html](manual.html) | Manual de uso | Capa → sumário → antes de começar (fatos, pré-requisitos) → procedimento em passos com resultado esperado → problemas e soluções → contracapa |
| [faq.html](faq.html) | Perguntas frequentes | Capa → perguntas reais agrupadas por tema, resposta na primeira frase → contracapa |
| [document.html](document.html) | Documento curto | Cabeçalho de identificação, decisão pedida e seções curtas, em uma ou duas folhas, sem capa |
| [spec.md](spec.md) | — | Esqueleto da spec, copiado pelo `new.sh` para `.work/NNN/spec.md` |

## Contrato

- O `new.sh` copia o modelo para `documents/NNN/source.html`. **O agente só edita o `source.html`**; o `index.html` é gerado pelo `build.sh` e nunca é editado à mão.
- O `source.html` é corrido: não tem páginas, rodapé, numeração nem sumário escritos. O build pagina em A4, preenche o sumário com as páginas reais, numera capítulos, aberturas e passos e escreve cabeçalho e rodapé.
- **Capa e contracapa:** `<section class="cover">` e `<section class="back">`. Troque os textos e os metadados; não mude a estrutura.
- **Sumário:** página dividida de folha inteira, `<section class="contents">` com `.side` (título e linha de apoio, sem eyebrow) e `.main` com `<nav class="toc"></nav>` vazio. O painel laranja com a grade de quadrados vem do CSS; troque só a linha de apoio. Nada além da lista no `.main`.
- **Capítulos:** `<section class="chapter" id="slug" data-title="Título no sumário" data-summary="Uma linha">`. Cada um começa numa folha nova. No relatório, abra com `.runhead` (título-ação e pergunta da página); no manual, com `.opener` deixando `<span class="num"></span>` vazio.
- **Gráficos:** `<div data-chart='{"type": ...}'></div>` dentro de uma `figure.fig`; o build desenha o SVG. Tipos e campos no [catálogo](../design/components.html).
- **Exemplo:** remova o selo `<span class="sample">` e troque todo o conteúdo de exemplo, inclusive o `<title>`. O `check.sh` acusa selo e título que sobrarem.
- Não acrescente CSS nem estilo inline além de `--count` dos KPIs e da largura de capturas. Se faltar um componente, pare e pergunte.

## Impressão

A4 retrato. O que não cabe passa para a folha seguinte sozinho; não reduza fonte nem esconda conteúdo. Tabelas, figuras, avisos e passos não quebram no meio.
