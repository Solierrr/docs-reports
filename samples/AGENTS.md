---
name: samples
purpose: Documentos de exemplo com conteúdo realista; é o que a galeria mostra e a referência visual de cada tipo.
read: o builder quando quiser ver um componente aplicado num documento inteiro
---

# Amostras

| Arquivo | Tipo | Direção |
| --- | --- | --- |
| [report.html](report.html) | Relatório gerencial | Capa, sumário e contracapa na base editorial; miolo gerencial com cabeçalho corrido, KPIs, SCQA e gráficos IBCS |
| [manual.html](manual.html) | Manual de uso | Base editorial; miolo de produto com aberturas, passos, capturas desenhadas e avisos |
| [faq.html](faq.html) | Perguntas frequentes | Base editorial; perguntas agrupadas por tema, resposta na primeira frase |
| [components.html](components.html) | Catálogo | Cada componente de `design/document.css` isolado, com o nome da classe |

As amostras referenciam `../design/document.css` e `../design/logos/elos.svg`. O `gallery/scripts/build-samples.mjs` embute os dois e desenha os gráficos. Os dados são fictícios e estão marcados assim na capa.
