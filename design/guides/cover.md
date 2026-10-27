---
name: cover
purpose: Capa, uso da marca e restrições.
read: o builder quando mexer na capa; quem for mudar a identidade
---

# Capa, marca e uso

- **Capa:** papel branco, faixa laranja no topo (4 mm, largura total), logo no alto e centralizado, título em extra-bold sem rótulo de tipo acima, subtítulo em medium, metadados (responsável, local, data, classificação, versão) ao pé, separados por um filete. Sem imagem de fundo.
- **Logo:** `../logos/elos.svg`, sem recolorir, distorcer ou girar, com área livre de 1/4 da largura. Largura de 32 mm na capa, 22 mm na contracapa e 16 mm no cabeçalho do documento curto. A marca é uma imagem com texto alternativo "Elos".
- **Miolo:** papel branco, títulos numerados em extra-bold, filetes cinza, rodapé com título curto e número da página. Rótulos pequenos em caixa normal; caixa alta só no SCQA.
- **Destaques:** o bloco `.note` usa filete laranja à esquerda e fundo `--brand-surface`. Não usar laranja em texto pequeno; use `--brand-accent-text`.
- **Fora do escopo desta identidade:** tema escuro, ilustrações e ícones. Se um documento precisar deles, parar e consultar o responsável.
- **Grade da marca:** todo laranja chapado leva a grade de quadrados do canvas do login da web-lib. São linhas e pontos a cada 12 mm, com uma onda de células acesas, sempre a partir de `.brand` em `document.css`. Ela aparece no sumário, nas aberturas, nos blocos de destaque e na contracapa. Não desenhe outro padrão.
- **Contracapa:** laranja com a grade (`.back.brand.page`) e o logo num quadro branco no meio da onda.
- **Gráficos:** paleta de séries laranja, azul, verde-água e violeta, validada para daltonismo nos pares vizinhos, com padrões de preenchimento como segunda codificação. Destaque em laranja, comparação em cinza.
