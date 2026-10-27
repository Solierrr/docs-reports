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
- **Capítulos:** `<section class="chapter" id="slug" data-title="Título no sumário" data-summary="Uma linha">`. Cada um começa numa folha nova. A abertura muda por tipo, e todas deixam `<span class="num"></span>` vazio para o build:
  - **Relatório:** `header.band.brand` como primeiro filho, com o número, o título-ação e a `.question`. A faixa sangra até as bordas e a folha fica sem cabeçalho.
  - **Manual:** `section.chapter.strip`, com uma coluna laranja em todas as folhas do capítulo, e `.opener` com título e linha de apoio.
  - **Documento longo:** `data-opener="divider"` no capítulo; o build cria uma folha laranja inteira antes dele.
  - **Sem variação:** `.runhead` e `.opener` continuam valendo.
- **Superfície da marca:** todo laranja chapado usa `.brand`, que já tem a grade de quadrados:
  - `.narrow` para cartões e colunas;
  - `.fade` para devolver o laranja liso até o pé;
  - `.quiet` para só a grade, quando o texto ocupa a largura toda;
  - `.page` para folha inteira.

  Componentes que a levam: `.counter`, `.kpi` em `.kpis.cards`, `.score`, `.summary`, `.facts`, `.trail`, `.themes`, `.ask` e `.back`.
- **Gráficos:** `<div data-chart='{"type": ...}'></div>` dentro de uma `figure.fig`; o build desenha o SVG.
  - **Tipos:** `bar`, `rank`, `group`, `stack`, `line`, `area`, `variance`, `waterfall`, `donut`, `boxplot`, `histogram`, `scatter`, `heatmap`, `funnel`, `bullet`, `dumbbell` e `spark`. Campos e exemplos no [catálogo](../design/components.html).
  - **Leitura analítica:** valor escrito nas marcas; `target` para meta, `average` para média e `table` para a tabela com os números.
  - **Cor:** `highlight` põe em laranja o que a página discute; o resto fica cinza.
  - **Séries:** até quatro, cada uma com cor e padrão (liso, listras, pontos, listras cruzadas), como nos comparativos de benchmark. Mais que isso vira "Outros".
  - **Eixo:** um só por gráfico. Duas medidas de escala diferente viram dois gráficos lado a lado em `.cols`.
- **Referências:** fontes externas e dados vão numa página própria, `section.chapter#referencias` com `ol.refs > li#ref-N` (o build numera). A fonte de cada KPI vai em `.source` e a de cada figura no `figcaption`, sempre com o link `<a href="#ref-N">[N]</a>`.
- **Exemplo:** remova o selo `<span class="sample">` e troque todo o conteúdo de exemplo, inclusive o `<title>`. O `check.sh` acusa selo e título que sobrarem. Só um documento fictício por decisão do dono mantém o selo, com `sample: true` no cabeçalho do `checklist.md`.
- Não acrescente CSS nem estilo inline além de `--count` (KPIs, progresso, trilha e temas) e da largura de capturas. Se faltar um componente, pare e pergunte.

## Impressão

A4 retrato. O que não cabe passa para a folha seguinte sozinho; não reduza fonte nem esconda conteúdo. Tabelas, figuras, avisos e passos não quebram no meio.
