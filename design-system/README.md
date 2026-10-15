# Identidade visual

Identidade única da Solaria para todos os modelos. Derivada do design system do VersioSpec (`projects/solaria/design-system/`) e dos SVGs da marca do `web-app`. É a única fonte visual: o agente não escolhe cor, fonte, espaçamento ou layout fora daqui.

| Caminho | Conteúdo |
| --- | --- |
| [tokens/solaria.md](tokens/solaria.md) | Cores, tipografia, forma, espaço e regras do logo |
| [logos/](logos/) | `elos-logo.svg` (marca completa), `hexagon.svg` e `hands.svg` (partes) |
| [fonts/README.md](fonts/README.md) | Plus Jakarta Sans: não incorporada, instalada na máquina |
| [guidelines/capa-e-marca.md](guidelines/capa-e-marca.md) | Capa, uso da marca e restrições |

## Como a identidade chega aos documentos

Os modelos em [`templates/`](../templates/README.md) já aplicam estes tokens e trazem o logo embutido. Ao gerar um documento, a identidade não é reaplicada: ela vem do modelo. Para mudar a identidade, edite os arquivos desta pasta e depois atualize as variáveis CSS e o logo nos três modelos.

## Pendências conhecidas

- Fonte: Plus Jakarta Sans não é incorporada; depende de estar instalada na máquina (ver `fonts/README.md`).
- Tema escuro e ilustrações não fazem parte desta identidade.
