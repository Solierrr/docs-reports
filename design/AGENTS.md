---
name: design
purpose: Identidade visual única dos documentos. Fonte de verdade de cor, tipografia, logo e capa.
read: o builder quando o modelo não deixar claro; quem for mudar a identidade
---

# Identidade visual

Identidade única da Solaria para todos os modelos, derivada do design system do VersioSpec e dos SVGs da marca do `web-app`. O agente não escolhe cor, fonte, espaçamento ou layout fora daqui.

| Caminho | Conteúdo |
| --- | --- |
| [tokens/solaria.md](tokens/solaria.md) | Cores, tipografia, forma, espaço e regras do logo |
| [logos/](logos/) | `elos.svg` (marca completa), `hexagon.svg` e `hands.svg` (partes) |
| [guides/cover.md](guides/cover.md) | Capa, uso da marca e restrições |

## Como a identidade chega aos documentos

Os modelos em [templates/](../templates/AGENTS.md) já aplicam os tokens e trazem o logo embutido. Ao gerar um documento, a identidade não é reaplicada: vem do modelo. Para mudá-la, edite esta pasta e depois as variáveis CSS e o logo nos três modelos.

## Fonte

**Plus Jakarta Sans** (SIL Open Font License 1.1), pesos 500, 600, 700 e 800. Não é incorporada nem versionada: os modelos declaram `"Plus Jakarta Sans", "Segoe UI", system-ui, Arial, sans-serif`, e quem abre ou imprime precisa tê-la instalada. Sem ela, o navegador usa a fonte seguinte e o documento continua legível, com pequenas diferenças de largura.

- Não adicione `@font-face`, `<link>` de fontes externas nem arquivos de fonte aos documentos.
- Não troque a pilha por outra família.
- Ao revisar ou gerar o PDF, registre se a fonte estava instalada.

## Fora desta identidade

Tema escuro, ilustrações e ícones. Se um documento precisar deles, pare e pergunte.
