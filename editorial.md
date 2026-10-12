# Convenções editoriais

## Formato

Todas as páginas são A4 retrato: 210 × 297 mm. Nunca paisagem, inclusive anexos e tabelas. Os modelos usam `@page { size: A4 portrait; margin: 0; }`, área interna de leitura, CSS de impressão e ajuste exato de cores. Na tela, as folhas aparecem em sequência; isso não altera proporção nem conteúdo.

Não esconda overflow para disfarçar conteúdo que não cabe. Adicione páginas ou reorganize blocos, mantenha o corpo legível e as notas diferenciadas. Parágrafos e tabelas extensos podem quebrar entre páginas quando não cabem numa folha.

## Estrutura por tipo

Capa com organização, tipo, título, subtítulo quando necessário, data ou período, versão e responsável. Sumário navegável coerente com títulos e páginas. Seções numeradas em hierarquia consistente, cabeçalhos e rodapés discretos, paginação. Divisórias só quando a extensão justificar; sem página decorativa sem função.

- **Relatório** (`report.html`): síntese → contexto, método e fontes → evidências e análise → conclusões e recomendações → referências e anexos.
- **Manual** (`manual.html`): objetivo e aplicação → pré-requisitos → procedimentos ordenados com resultado esperado → verificação → solução de problemas → referências e histórico de versões.
- **Documento** (`document.html`): modelo mais enxuto, sem capa nem sumário, para propostas, atas, comunicados e one-pagers. Cabeçalho com identificação, corpo em seções numeradas, referências quando houver.

As seções variam conforme a especificação aprovada. Não adicione KPIs, recomendações ou solução de problemas só para preencher o modelo.

## Figuras, tabelas e fontes

Numere figuras e tabelas, com título e fonte próximos ao elemento. Repita cabeçalhos e identifique continuações em tabelas quebradas. Preserve unidades, períodos, notas e contexto. Distinga cálculo próprio de dado de terceiros e explicite as fórmulas necessárias para reproduzir resultados.

Referências devem permitir localizar a origem: autor ou organização, título, ano, data ou versão quando disponíveis, URL ou identificação do arquivo e data de consulta para material online. Não invente metadados nem declare conformidade integral com a ABNT: são convenções corporativas selecionadas.

## HTML

CSS dentro de `<style>`, logo embutido, sem dependências externas para renderizar. A fonte da identidade não é embutida: precisa estar instalada na máquina de quem abre ou imprime. Links externos de referência são permitidos, mas não condicionam a renderização. Texto em elementos HTML reais, idioma declarado, títulos semânticos, tabelas com cabeçalhos e imagens com texto alternativo. Nada exige interação ou animação para revelar informação.

## Impressão e PDF

O PDF não é entregável padrão. Sob pedido, imprima pelo navegador em A4, escala 100%, margens zero, fundos ativados e cabeçalhos e rodapés do navegador desligados. HTML e PDF devem conter o mesmo texto.
