# Convenções editoriais

## Formato

Todas as páginas são A4 retrato: 210 × 297 mm. Nunca paisagem, inclusive anexos/tabelas. O HTML usa `@page { size: A4 portrait; margin: 0; }`, com área interna de leitura definida no template, CSS de impressão interno e ajuste exato de cores. Preview pode mostrar as folhas em sequência, mas não altera proporção nem conteúdo.

Não esconder overflow para disfarçar conteúdo que não cabe. Adicione páginas ou reorganize blocos; mantenha corpo legível, notas diferenciadas e espaço para cabeçalhos/rodapés. Não exigir que parágrafos/tabelas extensos permaneçam inteiros se isso os torna maiores que uma folha.

## Estrutura comum

Capa com organização, tipo, título, subtítulo quando necessário, data/período, versão e responsável conforme contrato. Sumário navegável coerente com títulos e páginas. Seções numeradas em hierarquia consistente, miolo claro, cabeçalhos/rodapés discretos e paginação. Divisórias são opcionais conforme extensão; não gerar páginas decorativas sem função.

Relatório: apresentação/síntese → contexto e método/fontes → evidências e análise → conclusões e recomendações solicitadas → referências/anexos.

Manual: apresentação e aplicação → pré-requisitos → procedimentos ordenados → resultado esperado/verificação → solução de problemas → referências/anexos.

Seções podem variar segundo especificação aprovada. Não adicionar KPIs, recomendações ou troubleshooting apenas para preencher template.

## Figuras, tabelas e fontes

Numere figuras/tabelas consistentemente, dê título/legenda e fonte próximos ao elemento. Repita cabeçalhos e identifique continuações em tabelas repartidas. Preserve unidades, períodos, notas e contexto. Distingua cálculo próprio e dado de terceiros; explicite fórmulas necessárias para reproduzir resultados.

Referências devem permitir localizar a origem: autor/organização, título, ano/data/versão quando disponíveis, URL ou identificação do arquivo e data de consulta para material online. Não inventar metadados bibliográficos nem prometer conformidade ABNT integral. Estes são padrões corporativos com convenções selecionadas.

## Identidade e referências

Use somente os tokens/assets de `design-system/`. A composição editorial de capa, sumário e divisórias pode se inspirar no Itaú; Firecrawl e Cloudflare orientam clareza e hierarquia quando necessário. Não copiar marcas, textos ou identidade dessas referências nem substituir a identidade fornecida.

## HTML e PDF

CSS dentro de `<style>`, assets de renderização incorporados e sem dependências externas. Links de referência externos são permitidos, mas não condicionam a renderização. Texto em elementos HTML reais, idioma declarado, títulos semânticos, tabelas com cabeçalhos e imagens com descrição. Não exigir interatividade para revelar informação. HTML e PDF devem conter o mesmo texto e dados.
