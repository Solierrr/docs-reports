---
name: tokens
purpose: Cores, tipografia, forma, espaço e regras do logo.
read: quem for mudar a identidade ou os modelos
---

# Tokens Solaria para documentos

Fonte: design system do VersioSpec (`projects/solaria/design-system/foundations.md`) e `web-app/src/index.css`. Documentos impressos adaptam os tokens da interface; não os substituem. Os modelos em `templates/` já aplicam estes valores. Mudou a identidade: atualize este arquivo e depois os modelos.

## Cores

| Variável nos modelos | Valor | Papel |
| --- | --- | --- |
| `--brand-ink` | `#242628` | Texto principal (`operational-ink`) |
| `--brand-muted` | `#62676f` | Texto secundário, rodapés e fontes (`operational-muted`) |
| `--brand-paper` | `#ffffff` | Papel da página |
| `--brand-surface` | `#fafafa` | Blocos de apoio (`operational-surface`) |
| `--brand-line` | `#e5e7eb` | Linhas e divisórias (`border`) |
| `--brand-accent` | `#ff6500` | Barra da capa, filetes e marcas gráficas (`orange`). Não usar em texto pequeno por contraste |
| `--brand-accent-text` | `#c84b18` | Laranja para texto sobre fundo claro (`orange-copper`, contraste 4,9:1 sobre branco) |
| `--brand-cover` | `#ffffff` | Fundo da capa |
| `--brand-cover-ink` | `#242628` | Texto da capa |

Laranja é destaque funcional, não decoração. Não criar cores novas por documento.

## Tipografia

Plus Jakarta Sans (`font-ui` da interface). Pesos aprovados: medium 500, semi-bold 600, bold 700 e extra-bold 800; regular, light e thin não fazem parte do sistema. Corpo 11 pt a 500; títulos em 800; legendas e rodapés 9 a 10 pt. A pilha nos modelos é `"Plus Jakarta Sans", "Segoe UI", system-ui, Arial, sans-serif`. A fonte não é incorporada: deve estar instalada na máquina (ver [design/AGENTS.md](../AGENTS.md#fonte)).

## Forma e espaço

Raios `small 0.25rem`, `soft 0.35rem`, `medium 0.5rem`, `hard 0.8rem`. Bordas finas neutras e sombras discretas só em superfícies; em papel, preferir filete a sombra. Margens internas de 22 mm, rodapé a 13 mm, A4 retrato.

## Logo

`logos/elos.svg` é a marca completa (hexágono com as mãos); `hexagon.svg` e `hands.svg` são partes dela. Use a marca completa na capa e no cabeçalho do documento, sem recolorir, distorcer ou girar. Nos modelos o logo está embutido como imagem, com texto alternativo. Respeitar área livre mínima de 1/4 da largura do logo.
