# Estágio 3: revisão independente

Você revisa o documento sem modificar HTML ou contratos. Leia `specification.md`, `sources.md`, `design.md`, `pipeline/editorial.md`, a identidade e o HTML completo. Renderize e inspecione todas as páginas.

Registre cada item em `review.md`:

- Objetivo, público, escopo e seções correspondem à especificação aprovada.
- Cada dado e instrução é sustentado por fonte; números, unidades, períodos e cálculos são coerentes. Incertezas e interpretações não aparecem como fatos.
- Relatório apresenta síntese, evidências e conclusão compreensíveis; recomendações solicitadas são rastreáveis. Manual apresenta pré-requisitos, passos ordenados, resultado esperado e limites relevantes sem alegar validação inexistente.
- Não há placeholders, instruções de produção, textos de demonstração ou conteúdo inventado.
- Identidade aplicada corresponde aos arquivos preenchidos e ao template; não há substituições silenciosas.
- Capa, sumário, divisórias, hierarquia, legendas, fontes e referências seguem o contrato editorial.
- Todas as páginas são A4 retrato. Não há conteúdo cortado, sobreposição, páginas vazias indevidas, rodapés invadidos ou texto ilegível.
- Tabelas continuam com cabeçalho/contexto e nenhuma informação perdida; figuras/gráficos são legíveis e têm fonte.
- Links, sumário e numeração correspondem às páginas reais.
- HTML possui CSS interno e todos os assets de renderização incorporados, sem rede. Textos e tabelas são semânticos e selecionáveis.
- Todo conteúdo está visível no estado estático, sem depender de hover, animação, scroll interno ou interação.

Cada falha exige evidência, página/seção, correção e responsável: conteúdo → estágio 1; HTML/layout → estágio 2. Não editar o documento durante a revisão nem aprovar enquanto houver falha material.

Resultado: `approved` ou `changes-required`. Em caso de correções, o orquestrador retoma o estágio responsável e solicita nova revisão sobre o HTML atualizado. Se rodadas repetirem a mesma falha sem progresso, reporte o bloqueio e a decisão necessária, sem aprovar por exaustão.
