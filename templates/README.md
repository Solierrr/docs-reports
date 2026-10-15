# Modelos

Três modelos HTML com a identidade Solaria já aplicada (cores, tipografia, capa, logo). Não têm scripts nem recursos remotos; o logo está embutido como imagem. O agente só escreve o conteúdo nos espaços marcados.

| Modelo | Uso | Páginas de exemplo |
| --- | --- | --- |
| [report.html](report.html) | Relatório: capa, sumário, síntese, análise, conclusões, anexo | 6 |
| [manual.html](manual.html) | Manual de instrução: capa, sumário, preparação, procedimentos, problemas, referências | 6 |
| [document.html](document.html) | Documento curto sem capa nem sumário: proposta, ata, comunicado, one-pager | 2 |

## Contrato de preenchimento

- Copie o modelo para `documents/<nome>/<nome>.html`.
- Cada espaço de conteúdo é `<span data-slot="campo">{{campo}}</span>`. Substitua o elemento inteiro pelo conteúdo aprovado, escapando o texto para HTML. Campos repetidos recebem o mesmo valor. A exceção é o `<title>`, que traz o marcador puro `{{titulo_curto}}`.
- No final não pode restar `{{`, `}}` nem `data-slot`. Os textos de exemplo (tabelas e figuras de demonstração) são estruturais, nunca dado real: substitua ou remova.
- Repita, adapte ou remova as páginas de miolo conforme a especificação. Mantenha IDs únicos, links do sumário e a numeração física das páginas sincronizados. A capa é a página 1 e não mostra número; o sumário mostra 2. Os números são explícitos para que a impressão seja consistente.
- Figuras reais levam texto alternativo, legenda e fonte. O logo e o estilo não mudam: se faltar um componente, pare e consulte o responsável.
- A identidade vive em [design-system/](../design-system/README.md). Ao mudá-la, atualize as variáveis `--brand-*`, as fontes e o logo embutido nos três modelos.

## Paginação e impressão

Páginas A4 retrato, margens internas de 22 mm, rodapé e quebras explícitas. Para imprimir: A4, escala 100%, margens zero, fundos ativados, sem cabeçalho e rodapé do navegador. Não reduza o texto para caber: divida em páginas adicionais, repita cabeçalhos de tabela e atualize sumário e rodapés. Nunca use paisagem, altura com corte ou conteúdo escondido.

Convenções de estrutura, tabelas, figuras e fontes em [editorial.md](../editorial.md).
