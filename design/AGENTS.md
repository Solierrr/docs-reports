---
name: design
purpose: Identidade visual única dos documentos. Fonte de verdade de cor, tipografia, logo e capa.
read: o builder quando o modelo não deixar claro; quem for mudar a identidade
---

# Identidade visual

Identidade única da Solaria para todos os modelos, derivada do design system do VersioSpec e dos SVGs da marca do `web-app`. O agente não escolhe cor, fonte, espaçamento ou layout fora daqui.

| Caminho | Conteúdo |
| --- | --- |
| [document.css](document.css) | Folha única dos documentos: página A4, tipografia e todos os componentes (capa, sumário, aberturas, KPIs, figuras, passos, avisos, FAQ, contracapa) |
| [components.html](components.html) | Catálogo: cada componente isolado com o nome da classe e todos os tipos de gráfico |
| [screen.css](screen.css) | Tela do documento paginado (folhas sobre fundo cinza); o build acrescenta depois da paginação |
| [tokens/solaria.md](tokens/solaria.md) | Cores, tipografia, forma, espaço e regras do logo |
| [logos/](logos/) | `elos.svg`, o quadro estático do `OrganicLogo` da web-lib (hexágono laranja com as mãos) |
| [guides/cover.md](guides/cover.md) | Capa, uso da marca e restrições |

## Como a identidade chega aos documentos

Os documentos referenciam `document.css` e `logos/elos.svg`; o `build.sh` embute os dois no `index.html`. Para mudar a identidade, edite esta pasta: todos os documentos gerados depois já saem com ela, e a galeria mostra o resultado nos modelos.

## Fonte

**Plus Jakarta Sans** (SIL Open Font License 1.1), pesos 500, 600, 700 e 800. Versionada em [fonts/](fonts/) (subconjunto latino em woff2, com a licença em `fonts/OFL.txt`) e embutida pelo build em todo `index.html`, então o HTML e o PDF saem com ela em qualquer máquina. O `source.html` aberto direto declara `"Plus Jakarta Sans", "Segoe UI", system-ui, Arial, sans-serif` e usa a fonte seguinte se ela não estiver instalada; a paginação vale só para o documento gerado.

- Não adicione `@font-face`, `<link>` de fontes externas nem arquivos de fonte aos documentos.
- Não troque a pilha por outra família.
- Ao revisar ou gerar o PDF, registre se a fonte estava instalada.

## Fora desta identidade

Tema escuro, ilustrações e ícones. Se um documento precisar deles, pare e pergunte.

## Ao editar o CSS

O Paged.js descarta regras com seletor de irmão (`+`, `~`) e `:nth-child`, e contadores de CSS (`counter()`) não sobrevivem à paginação. Use `:first-child` ou classes. Quando algo depende da posição (numeração de passos, pontos-chave, referências e trilha; padrão de cada etapa do progresso), o `paginate.mjs` marca `data-step` ou `data-pattern` antes de paginar.
