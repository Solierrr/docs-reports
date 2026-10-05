# Identidade visual

Preencha esta pasta antes de gerar documentos. Há uma única identidade para todos os templates; não é preciso criar subdiretório por marca.

| Diretório | O que fornecer |
| --- | --- |
| `tokens/` | Arquivo Markdown com cores e papéis, tipografia, escala, espaçamento, linhas e regras de uso |
| `logos/` | Logo aprovado e variantes necessárias para capa/miolo |
| `fonts/` | Fontes locais autorizadas para incorporação, ou indicação explícita das fontes disponíveis |
| `assets/` | Elementos gráficos/assinatura, se adotados |
| `guidelines/` | Regras de capa, uso da marca e restrições; declarar ausência de assets opcionais |

Os diretórios estão preparados com `.gitkeep`; não há identidade presumida.

## Checklist obrigatório

- [ ] Nome de exibição da organização e logo aprovado, ou decisão explícita de usar somente assinatura textual.
- [ ] Cores com valores exatos e função: fundo da capa, texto da capa, papel, texto, texto secundário, acento e linhas.
- [ ] Fontes para título, corpo e dados, pesos e tamanhos, com disponibilidade local e permissão de incorporação verificadas.
- [ ] Espaçamento e área de leitura compatíveis com A4 retrato; se aceitar a base estrutural do template, declarar isso explicitamente.
- [ ] Regras de composição da capa/assinatura e uso de variantes de logo.
- [ ] Assets opcionais listados ou ausência explicitamente indicada.

As fontes podem ser locais autorizadas ou uma pilha explicitamente aprovada. Quando dependerem de instalação local, o agente verifica a fonte disponível e o PDF; não permite substituição silenciosa. Para portabilidade, prefira incorporar arquivos autorizados ao HTML.

Os templates apresentam valores neutros exclusivamente para visualizar sua estrutura. Eles não definem a identidade Solaria. A pipeline deve parar e listar ausências antes de produzir qualquer documento final.
