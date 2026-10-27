---
name: editorial
purpose: Convenções de estrutura, tabelas, figuras, fontes, HTML e impressão.
read: o writer e o builder antes do primeiro ciclo
---

# Convenções editoriais

## Formato

Todas as páginas são A4 retrato: 210 × 297 mm. Nunca paisagem, inclusive anexos e tabelas. Os modelos usam `@page { size: A4 portrait; margin: 0; }`, área interna de leitura, CSS de impressão e ajuste exato de cores. Na tela, as folhas aparecem em sequência; isso não altera proporção nem conteúdo.

Não esconda overflow para disfarçar conteúdo que não cabe. Adicione páginas ou reorganize blocos, mantenha o corpo legível e as notas diferenciadas. Parágrafos e tabelas extensos podem quebrar entre páginas quando não cabem numa folha.

## Estrutura por tipo

Capa com título, linha de apoio, período, responsável, versão e classificação; contracapa com a marca. Sumário, numeração, cabeçalho (capítulo e progresso) e rodapé (título e página) são gerados pelo build. A conclusão vem antes do detalhe, no documento e em cada seção. Centralizado só em capa, contracapa e destaque de número; o corpo é alinhado à esquerda, sem moldura, separado por espaço e filetes.

- **Relatório gerencial** (`report.html`): sumário executivo (KPIs com fórmula, SCQA, decisão pedida) → um capítulo por achado, com título-ação e a pergunta da página → recomendação com responsáveis e prazos → proveniência dos dados. Gráficos no padrão IBCS: real cheio, plano em contorno, variação em verde e vermelho.
- **Manual de uso** (`manual.html`), no formato how-to: antes de começar (o que é preciso, tempo, resultado) → procedimento em passos no imperativo, cada um com o resultado esperado → problemas comuns com causa e solução. Explicação longa vai para outra seção, não para dentro dos passos.
- **Perguntas frequentes** (`faq.html`): só perguntas reais, agrupadas por tema; a primeira frase da resposta já responde e o resto aponta onde saber mais.
- **Documento curto** (`document.html`): proposta, ata, comunicado ou one-pager, sem capa nem sumário. Cabeçalho com tipo, título e metadados, decisão pedida quando houver e seções curtas.

As seções variam conforme a especificação aprovada. Não adicione KPIs, recomendações ou solução de problemas só para preencher o modelo.

## Figuras, tabelas e fontes

Numere figuras e tabelas, com título e fonte próximos ao elemento. Repita cabeçalhos e identifique continuações em tabelas quebradas. Preserve unidades, períodos, notas e contexto. Distinga cálculo próprio de dado de terceiros e explicite as fórmulas necessárias para reproduzir resultados.

Referências devem permitir localizar a origem: autor ou organização, título, ano, data ou versão quando disponíveis, URL ou identificação do arquivo e data de consulta para material online. Não invente metadados nem declare conformidade integral com a ABNT: são convenções corporativas selecionadas.

## HTML

CSS dentro de `<style>`, logo embutido, sem dependências externas para renderizar. A fonte da identidade não é embutida: precisa estar instalada na máquina de quem abre ou imprime. Links externos de referência são permitidos, mas não condicionam a renderização. Texto em elementos HTML reais, idioma declarado, títulos semânticos, tabelas com cabeçalhos e imagens com texto alternativo. Nada exige interação ou animação para revelar informação.

## Impressão e PDF

Todo documento entregue tem HTML e PDF. O PDF é gerado pelo `scripts/pdf.sh` depois que o HTML é aprovado: A4, escala 100%, margens zero, fundos ativados, sem cabeçalho e rodapé do navegador. HTML e PDF contêm o mesmo texto.
