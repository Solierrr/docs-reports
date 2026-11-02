# log 002

## Ciclo 1

- **Entrada:** spec aprovada pelo usuário em 02/11/2026; dados das planilhas `inputs/` calculados com pandas.
- **O que mudou:** montagem do `source.html` com 13 capítulos, gráficos funnel, bar, boxplot, histogram, dumbbell, heatmap, rank e line. Selo de dados fictícios mantido (`sample: true`).
- **Ajustes em relação à spec:** a constatação 1 passou a tratar da ausência de ligação entre proposta aceita e pedido (nenhuma oferta dos 4 pedidos está em proposta aceita), porque as planilhas não ligam os dois. A constatação 5 trata da espera do fornecedor. O heatmap e o ranking de fornecedores ficaram na constatação 4. Não há medição de prazo de resposta: a planilha só tem a última atualização.
- **check.sh:** `ok 002` (17 páginas).
- **Pendente:** revisão independente do ciclo 1.

## Ciclo 2

- **Reviewer (ciclo 1):** Pendências a resolver; 5 bloqueantes e vários menores, em `review.md`.
- **O que mudou:**
  - Mensagem central refeita: sem a razão de 1,0% (comparava grupos sem ligação). O indicador principal virou "aceites com pedido vinculado" (hoje 0 de 18).
  - Texto sem as afirmações não sustentadas (fornecedor que sai, qualidade da rede, compras diretas, perda de receita).
  - Sumário reduzido a 11 capítulos: "Resposta à pergunta-guia" foi para o fim da decisão e as referências foram para a proveniência.
  - Proveniência ampliada com todos os números citados. Dumbbell com rótulos curtos, heatmap com rótulos menores, "R$" sem quebra, "quatro meses e meio", "16 dos 35 itens".
- **Conscientemente não feito:** gráfico de avaliações por vínculo (previsto na spec) e a divergência de 0,01 nas medianas (arredondamento do gráfico).
- **check.sh:** `ok 002` (16 páginas).

## Ciclo 3

- **Reviewer (ciclo 2):** Pendências a resolver; 2 bloqueantes por regressão.
- **O que mudou:** o "R$" sem quebra passou a usar o caractere de espaço sem quebra, e não a entidade, que aparecia literal nos gráficos. A Tabela 1 troca a coluna de linhas por contagens na primeira coluna, e a Tabela 2 mostra valores em "mi" e "mil", sem quebrar números. A proveniência ganhou a linha de varejistas, funil e total de propostas.
- **Não feito:** contraste do "8" no heatmap (componente do design, fora do alcance do builder), cabeçalho repetido na Tabela 4 e espaço em branco da página 13.
- **check.sh:** `ok 002` (16 páginas).
