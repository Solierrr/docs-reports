# review 002

## Ciclo 1

Revisão independente de `documents/002/index.html` (17 páginas A4, 794 x 1123 px na tela). `sh scripts/check.sh 002` devolveu `ok 002`. Percorri as 17 páginas no navegador do harness (viewport 900 x 1180) e recalculei os números com pandas direto de `admins.xlsx` e `fornecedores.xlsx`, sem usar `kpis.json` nem `build_doc.py`.

### Checklist do reviewer

| Item | Resultado | Como conferi |
| --- | --- | --- |
| T1 | falha (menor) | "Decidir até próxima reunião da Diretoria" (p. 4) pede "até a próxima". Resto sem erro de ortografia ou acentuação. |
| T2 | falha | Lista de quatro passos da p. 6 quebrada (pendência 2); rótulos do dumbbell colidem (pendência 3); rótulo "Aguarda fornecedor" do heatmap cortado na borda esquerda (p. 11). |
| T3 | ok | Nenhum marcador, texto de exemplo ou instrução à vista. |
| T4 | falha (menor) | "1,0%" aparece como "só 1,0% do valor aceito aparece em pedidos pagos" e, ao mesmo tempo, "0 de 4 pedidos em proposta aceita" (pendência 1). Medianas por marca na Fig. 3 divergem de 2,74 e 2,98 (pendência 9). |
| L1 | ok | Corpo legível em A4. Selo "Dados fictícios" da capa e rodapé da contracapa são pequenos, mas são elementos do modelo. |
| L2 | falha (menor) | Numeração laranja pequena no sumário e links "[1] [2]" em laranja pequeno; "8" na célula escura do heatmap (SP, Aceita) quase não lê (pendência 8). |
| L3 | falha | Eixo do histograma (Fig. 4) com faixas coladas, ilegíveis sem zoom; rótulos de mediana do boxplot (Fig. 3) muito pequenos; dumbbell (Fig. 5) com rótulos sobrepostos. |
| L4 | ok | Sem overflow horizontal (scrollWidth = clientWidth). |
| O1 | falha | Sumário estoura para uma terceira página (pendência 2). Números do sumário (4 a 16) batem com as páginas impressas. |
| O2 | ok | Resposta e decisão pedida na p. 4, antes do detalhe; cada página abre com o achado. |
| O3 | falha | p. 3 quase vazia com dois itens soltos; p. 10, 14 e 16 com mais de metade em branco (pendência 4). |
| O4 | ok | Figuras 1 a 8 e tabelas 1 a 4 numeradas em sequência, com título e fonte junto ao elemento. |
| O5 | ok | Capa, faixa laranja, logo e rodapé iguais ao modelo; sem estilo local aparente. |
| O6 | ok | Respiro entre avisos, tabelas e figuras adequado nas páginas vistas. |
| O7 | não se aplica | Documento sem FAQ. |
| P1, P2 | não verificado | `documents/002/002.pdf` ainda não existe; seção de PDF fica para depois do `pdf.sh`. |

### Itens deste documento (`checklist.md`)

| Item | Resultado |
| --- | --- |
| Capa com pergunta-guia e selo de dados fictícios | ok |
| KPIs com nome, fórmula, resultado, interpretação e importância (Tabela 2) | ok; os 8 resultados batem com os dados |
| Cada constatação com pergunta e gráfico analítico | ok quanto à forma (funil, boxplot, histograma, dumbbell, heatmap, linha); a Constatação 5 não traz a figura das avaliações por tipo de vínculo prevista na spec |
| Tabela de decisão com evidência, constatação, decisão, recomendação, retorno, risco, oportunidade | ok |
| Resposta em duas frases com o pedido à Diretoria | ok (p. 14) |
| Proveniência de cada número com fórmula, aba e coluna | falha (pendência 5) |
| Nenhum número diverge das planilhas | falha parcial: números calculados batem; há afirmações não sustentadas (pendências 1 e 6) |

### Conferência dos números (pandas, direto das planilhas)

Bateram: 30 propostas, 18 aceitas (60,0%), 21 decididas (85,7%); R$ 1.370.560,27 aceitos; R$ 14.367,35 em 3 pedidos PAID (4 pedidos, 1 cancelado); cobertura 1,05% (exibida "1,0%"); 0 de 4 pedidos com oferta em proposta aceita (os 8 itens vendidos usam 4 ofertas; 2 delas aparecem em propostas não aceitas); 6 AWAITING_SUPPLIER = R$ 496.440,96; 9 em aberto = R$ 630.878,85 (78,7%); R$ 2.145.289,82 em propostas; 110 painéis, mediana R$/Wp 2,958 (2,96), média 2,987 (2,99), mínimo 1,98, máximo 4,24; SunForge de 1,98 a 4,10; mediana mais alta Terrasol 3,41; 24 itens com os dois descontos, média negociada 2,458% e anunciada 8,625%; faixas 5/15/4 itens (negociado 4,0 / 2,27 / 1,25; anunciado 3,0 / 8,8 / 15); 11 de 24 itens sem desconto (45,8%); três maiores fornecedores R$ 1.596.651,76 = 74,4% (A 636 mil, B 582 mil, C 379 mil, D 301 mil); SP 16 de 30 propostas (53%) e 54,6% do valor; 5 estados com proposta; 4 dos 6 fornecedores com proposta têm alguma AWAITING_SUPPLIER; propostas por mês (1, 5, 7, 8, 7, 2) e aceitas (1, 2, 7, 5, 2, 1); 15 varejistas, 14 com proposta, 11 fornecedores, 6 com proposta, 116 de 122 ofertas ativas; 55 projetos, 150 serviços, 62% concluídos, 14% cancelados; nota média 4,14 (afiliados 4,18, parceiros 4,15, independentes 4,00); taxa 0,5%; 10% do aceito = R$ 137.056 e taxa R$ 685. Heatmap da Fig. 6 confere célula a célula.

### Pendências

1. **Bloqueante. Mensagem central se contradiz (capa, p. 4, p. 8, p. 14).** O texto diz "só 1,0% do valor aceito aparece em pedidos pagos" e, no mesmo corpo, que nenhum dos 4 pedidos usa oferta de proposta aceita. Os R$ 14.367 pagos não vêm do valor aceito; a razão 1,0% compara dois grupos sem ligação. Um leitor da Diretoria entende ou "1% do aceito foi pago" ou "nada do aceito foi pago", e o documento afirma os dois. Também o rótulo "cobertura do aceite" sugere um vínculo que as planilhas não têm. A frase da capa ("nenhuma delas aparece nos pedidos pagos") está correta; o título da seção 05, o destaque "1,0%" da p. 4 e a decisão "fazer esse número crescer" precisam de leitura coerente com ela.
2. **Bloqueante. Sumário e lista quebrados (p. 2, 3, 6).** O sumário ocupa duas páginas: a p. 3 traz só os itens 12 e 13, em coluna estreita, no meio de uma folha em branco. Na p. 6, a lista de quatro passos "Dado bruto: abas proposal offer purchase_order" quebra em linhas soltas de código no meio do item 1, e os números dos itens do sumário seguem em laranja pequeno.
3. **Bloqueante. Rótulos sobrepostos na Fig. 5 (p. 10).** Os valores negociados ("2,3%", "1,3%", "4%") colidem com os nomes das faixas ("6 a 10% (15 itens)", "Acima de 10% (4 itens)", "Até 5% (5 itens)") e os pontos de "Até 5%" quase se tocam. Só é legível com zoom.
4. **Menor. Páginas com muito espaço vazio (O3).** p. 3 (quase vazia), p. 10 (cerca de 40% em branco), p. 14 (resposta, dois terços em branco) e p. 16 (referências, metade em branco). A p. 14 é intencional, mas as demais parecem sobras de paginação.
5. **Bloqueante (item do checklist do documento). Proveniência incompleta (p. 15).** O item pede "para cada número". A Tabela 4 cobre 8 números; faltam: 6 AWAITING_SUPPLIER e R$ 496.441/78,7% do valor em aberto, 85,7%, R$ 2,15 mi/2.145.289, 116 ofertas ativas, 14 varejistas com proposta, 24 → 80%/75% do funil, 46% sem desconto e 1,25% da faixa acima de 10%, 53%/55% de SP, 5 estados e "nove", taxa de 0,5% e R$ 137.056/R$ 685, 55 projetos/150 serviços/62%/14%, notas 4,14/4,18/4,15/4,00, mínimo e máximo do R$/Wp, média 2,99.
6. **Bloqueante. Afirmações não sustentadas pelos dados (p. 11, p. 7 e p. 8).**
   a. p. 11: "Se um deles sair, o marketplace perde quase três quartos do volume." Falso: o maior fornecedor (A) tem 29,7% do valor; 74,4% é a soma dos três juntos.
   b. p. 7: "a qualidade da rede não explica a perda na negociação." As avaliações são de técnicos em serviços e não se ligam a propostas, fornecedores ou pedidos; a nota média não permite essa conclusão.
   c. p. 8 (destaque "0 de 4") e p. 8: "vêm de compras diretas na vitrine". Não há chave entre pedido e proposta, e a própria "Leitura prudente" admite que pode ser negócio fechado fora. A frase da "Leitura prudente" ainda diz que nos dois casos a Solaria perde a receita, o que só vale para um deles.
7. **Menor. Escopo da spec não coberto (p. 7 e 12).** A spec prevê, na Constatação 5, barras de avaliação por tipo de vínculo; o dado entra só como texto na p. 7, que fala da rede de profissionais numa seção sobre escala. O funil da Constatação 1 (spec: proposta, aceite, pedido, pagamento) termina no aceite.
8. **Menor. Contraste e escala em gráficos.** Heatmap da Fig. 6: o "8" na célula marrom escura de SP/Aceita mal se distingue; rótulo "Aguarda fornecedor" cortado à esquerda. Boxplot da Fig. 3: rótulos "mediana R$ x,xx" em corpo bem pequeno. Histograma da Fig. 4: faixas do eixo x coladas e o "22" cortado pela linha pontilhada da mediana.
9. **Menor. Medianas da Fig. 3 com arredondamento diferente.** SunForge aparece como R$ 2,75 (mediana calculada 2,742) e Solarix como R$ 2,99 (2,982). O resto confere.
10. **Menor. Quebras de número em colunas estreitas.** Tabela 1: "122 · 51 · 12" quebra em três linhas; Tabela 2: "R$ / 1.370.560" e "6 · R$ / 496.441" quebram no meio; p. 4: "R$ / 1.370.560". Também "período curto (cinco meses)": de 27/05 a 06/10 são cerca de quatro meses e meio.
11. **Menor. Texto.** "Decidir até próxima reunião" (falta "a"); "os varejistas estejam em nove" (p. 11) mistura base de unidades (9 estados) com o estado predominante por varejista (6); "46% dos itens negociados terminam sem nenhum desconto" é 11 de 24, não do total de itens negociados (35).

### Limitações

- Revisão feita no navegador embutido do harness (Chromium) com a fonte da identidade; não verifiquei com outra fonte de reserva.
- Não salvei capturas em `.work/002/captures/`; as capturas de tela ficaram só na sessão.
- PDF não existe ainda; itens P1 e P2 não foram conferidos.
- Cálculos recalculados por mim com pandas a partir de `inputs/`; não consultei o Databricks. O estado por varejista foi reproduzido como "mais frequente entre as unidades", como descrito na Tabela 4.

## Ciclo 2

Revisão de `documents/002/index.html?v=5` (16 páginas, recarregada sem cache). `sh scripts/check.sh 002` devolveu `ok 002`. Percorri as 16 páginas no navegador e recalculei de novo com pandas, sem usar `kpis.json` nem `build_doc.py`.

### Números que mudaram (recalculados)

Bateram: 0 de 18 propostas aceitas com oferta em `order_item` (e 0 de 4 pedidos em proposta aceita); 16 de 35 itens com desconto registrado em 0% (57 itens, 22 sem desconto preenchido, 35 com valor, 16 zeros); maior fornecedor 29,7% (R$ 636.452 de R$ 2.145.290); 85,7% (18 de 21 decididas); R$ 630.878,85 em aberto e 78,7% no fornecedor; 4 meses e meio. Os demais números do ciclo 1 seguem corretos.

### Reavaliação das pendências do ciclo 1

| # | Situação | Observação |
| --- | --- | --- |
| 1 | resolvida | O texto não usa mais a razão 1,0%; o indicador principal é "0 de 18 aceites com pedido vinculado", coerente com "0 de 4 pedidos". Fechamento da p. 12 repete o 0 de 18. |
| 2 | resolvida | Sumário em uma página (11 itens; números 3 a 14 batem com as páginas). Lista de passos da p. 5 virou parágrafo. |
| 3 | resolvida em parte | Rótulos do dumbbell (p. 9) não colidem mais com os nomes das faixas. Restam "4%" e "3%" quase sobrepostos em "Até 5%" e eixo com "-3%" e "18%" sem sentido para descontos. Ver pendência 6. |
| 4 | em parte | p. 3 deixou de existir. Continuam com mais de 40% em branco: p. 6, p. 9 e p. 4; piorou na p. 13 (ver pendência 3). |
| 5 | resolvida | A Tabela 4 passou a cobrir todos os números do texto, com aba, colunas e cálculo. Faltam só linhas para 14 varejistas com proposta, 80% e 75% do funil e R$ 2.145.289; menor (pendência 7). |
| 6 | resolvida | Saíram "se um deles sair", "qualidade da rede não explica", "compras diretas na vitrine" e "perde a receita". O texto agora diz que o maior sozinho tem 29,7% e que a Solaria "não enxerga o resultado do aceite". |
| 7 | aceita | Gráfico de avaliações por vínculo e funil até o pagamento ficam de fora, como registrado no log. Sem pendência. |
| 8 | em parte | Rótulo do heatmap encurtado ("Ag. fornecedor"), ainda encostado na borda; o "8" na célula escura de SP/Aceita continua quase ilegível; rótulos de mediana do boxplot e eixo do histograma continuam pequenos e apertados. |
| 9 | aceita | Divergência de 0,01 (SunForge 2,75 contra 2,74; Solarix 2,99 contra 2,98) registrada no log como arredondamento do gráfico. |
| 10 | piorou | Ver pendência 2. "R$ 1.370.560" agora quebra no meio do número na Tabela 2 ("R$ 1.370.5 / 60"); "122 · 51 · 12" ainda quebra na Tabela 1. |
| 11 | resolvida | "Decidir na próxima reunião", "unidades dos varejistas estejam em nove" e "16 dos 35 itens" corrigidos. |

### Checklist do reviewer (ciclo 2)

| Item | Resultado |
| --- | --- |
| T1 | ok |
| T2 | falha: `&nbsp;` literal nos gráficos (pendência 1); quebras no meio de número (pendência 2) |
| T3 | falha: o mesmo `&nbsp;` à vista nos gráficos |
| T4 | ok |
| L1 | ok |
| L2 | falha (menor): "8" na célula escura do heatmap; numeração laranja pequena no sumário |
| L3 | falha: rótulos de eixo ilegíveis por causa do `&nbsp;`; sobreposições nas Figs. 3 e 5 (pendências 1 e 6) |
| L4 | ok (scrollWidth 885, menor que a viewport de 900) |
| O1 | ok: sumário e numeração batem |
| O2 | ok |
| O3 | falha (pendência 3) |
| O4 | ok: Figuras 1 a 8 e Tabelas 1 a 4 em sequência |
| O5 | ok |
| O6 | ok |
| O7 | não se aplica |
| P1, P2 | não verificados (sem PDF) |

### Itens deste documento (`checklist.md`)

Capa com pergunta e selo: ok. KPIs com fórmula, leitura e importância: ok. Gráfico analítico por constatação: ok, mas os rótulos de eixo estão quebrados (pendência 1). Tabela de decisão com retorno, risco e oportunidade: ok. Resposta em duas frases com pedido: ok (p. 12). Proveniência de cada número: ok com o menor da pendência 7. Nenhum número diverge das planilhas: ok.

### Pendências

1. **Bloqueante. `&nbsp;` aparece como texto em 27 rótulos de gráficos (Figs. 2, 3, 4 e, no que pude ver, o resto dos eixos com "R$").** Exemplos: eixo "R$&nbsp;1.500.000" e valor "R$&nbsp;14.367" na Fig. 2 (p. 7); "R$&nbsp;4,5", "mediana R$&nbsp;2,5" e demais rótulos do boxplot (p. 8); "mediana R$&nbsp;2,96" no histograma. O leitor vê a sequência de caracteres no gráfico. Regressão do ciclo 2 (não existia no ciclo 1).
2. **Bloqueante. Valores em R$ quebrando no meio.** Tabela 2 (p. 5): "R$ 1.370.5 / 60" na coluna Resultado e "6 · / R$ 496.441"; Tabela 1 (p. 4): "122 · 51 · 12" em três linhas. Pior que no ciclo 1.
3. **Menor. Página com quase nada (p. 13).** A continuação da seção 10 traz só os três cartões Retorno, Risco e Oportunidade no alto e cerca de 75% de página em branco, com o cabeçalho "10 · Decisão e recomendação 13 de 16". Também p. 6, p. 9 e p. 4 têm grande vazio inferior.
4. **Menor. Tabela 4 grudada no rodapé da p. 14 e quebrada para a p. 15** com apenas duas linhas e sem repetir o cabeçalho (Número, Aba, Cálculo).
5. **Menor. Heatmap (p. 10).** O "8" em SP/Aceita mal se distingue do fundo marrom; o rótulo "Ag. fornecedor" ainda encosta na borda esquerda.
6. **Menor. Gráficos pequenos demais ou apertados.** Fig. 3: rótulos "mediana" em corpo muito pequeno e sobrepostos entre marcas vizinhas; Fig. 4: faixas do eixo x coladas e "22" cortado pela linha da mediana; Fig. 5: "4%" e "3%" quase se tocam e o eixo vai de "-3%" a "18%".
7. **Menor. Proveniência sem linha** para 14 varejistas com proposta, 80% e 75% do funil (24 e 18 de 30) e R$ 2.145.289 em propostas.

### Limitações

- Navegador embutido do harness (Chromium) com a fonte da identidade; sem fonte de reserva testada. Capturas só na sessão, não em `.work/002/captures/`.
- Sem `002.pdf`: P1 e P2 não conferidos. Se o `&nbsp;` vier de uma biblioteca de gráficos, confirmar no PDF também.
- Números recalculados por mim a partir de `inputs/`; sem Databricks.

## Ciclo 3

Revisão de `documents/002/index.html?v=7` (16 páginas, recarregada sem cache). `sh scripts/check.sh 002` devolveu `ok 002`. Percorri as 16 páginas no navegador (viewport 900 x 1180) e conferi o DOM: nenhum `&nbsp;` em texto nem nos 100% dos rótulos SVG; sem overflow horizontal (885 contra 900).

### Pendências bloqueantes do ciclo 2

| # | Situação | Como conferi |
| --- | --- | --- |
| 1 | resolvida | Zero ocorrências de `&nbsp;` nos textos SVG e no corpo; eixos e rótulos das Figs. 2, 3 e 4 mostram "R$ 1.500.000", "R$ 4,5", "mediana R$ 2,96" corretamente. |
| 2 | resolvida | Tabela 1 (p. 4) traz as contagens entre parênteses na primeira coluna, sem quebra. Tabela 2 (p. 5) usa "R$ 1,37 mi" e "R$ 14,4 mil", sem número partido ao meio. Os valores batem com as planilhas (R$ 1.370.560 e R$ 14.367). |

### Reavaliação das pendências menores do ciclo 2

| # | Situação |
| --- | --- |
| 3 (p. 13 quase vazia) | persiste, registrada pelo builder como não feita. Menor. |
| 4 (cabeçalho da Tabela 4 na continuação) | persiste: a p. 15 recomeça a tabela sem repetir Número, Aba, Cálculo. Menor, porque a continuação mantém o cabeçalho de página "11 · Proveniência dos dados" e as três colunas são evidentes. |
| 5 (heatmap) | persiste: o "8" de SP/Aceita continua pouco legível sobre o marrom escuro; "Ag. fornecedor" já cabe. O valor também está no texto de apoio. Menor. |
| 6 (Figs. 3 a 5) | persiste em parte: rótulos de mediana pequenos, eixo do histograma apertado, "4%" e "3%" próximos e eixo do dumbbell com "-3%". Menor. |
| 7 (proveniência) | resolvida: a Tabela 4 ganhou a linha de 14 varejistas, 80% e 75% do funil e R$ 2.145.289. |

### Novas regressões

Nenhuma bloqueante. Um menor novo: na Tabela 2, "6 · R$ 496 mil" ainda quebra entre "R$ 496" e "mil" (p. 5).

### Números

Nenhum número mudou neste ciclo. Os valores arredondados da Tabela 2 conferem com os recalculados (R$ 1,37 mi; R$ 14,4 mil; R$ 496 mil = R$ 496.440,96).

### Checklist do reviewer (ciclo 3)

T1 ok; T2 ok; T3 ok; T4 ok; L1 ok; L2 falha menor (o "8" do heatmap); L3 falha menor (cabeçalho da Tabela 4 não se repete; rótulos pequenos nas Figs. 3 a 5); L4 ok; O1 ok; O2 ok; O3 falha menor (p. 13 e vazios nas p. 9 e 11); O4 ok; O5 ok; O6 ok; O7 não se aplica; P1 e P2 não verificados (sem PDF).

### Itens deste documento (`checklist.md`)

Todos comprovados neste ciclo: capa com pergunta-guia e selo; KPIs com nome, fórmula, resultado, interpretação e importância; um gráfico analítico por constatação; tabela de decisão com retorno, risco e oportunidade; resposta em duas frases com o pedido (p. 12); proveniência por número; nenhum número divergente das planilhas.

### Pendências

1. **Menor.** p. 13 com cerca de 70% em branco (cartões de retorno, risco e oportunidade sozinhos).
2. **Menor.** Tabela 4 continua na p. 15 sem repetir o cabeçalho.
3. **Menor.** Heatmap da Fig. 6: o "8" em SP/Aceita pouco legível.
4. **Menor.** Rótulos pequenos e apertados nas Figs. 3, 4 e 5; "R$ 496 mil" quebra na Tabela 2.

### Limitações

- Navegador embutido do harness (Chromium) com a fonte da identidade; sem fonte de reserva testada. Capturas só na sessão, não em `.work/002/captures/`.
- `002.pdf` não existe: P1 e P2 ficam para o `pdf.sh`; o `&nbsp;` e a quebra de números devem ser conferidos de novo no PDF.
- Números recalculados por mim a partir de `inputs/`; sem Databricks.

Aprovado sem pendências relevantes.
