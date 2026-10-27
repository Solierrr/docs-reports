---
name: templates
purpose: Modelos HTML com a identidade aplicada, o contrato de preenchimento e o esqueleto da spec.
read: o builder antes de montar; o writer só para listar os data-slot
---

# Modelos

| Modelo | Uso | Páginas de exemplo |
| --- | --- | --- |
| [report.html](report.html) | Relatório: capa, sumário, síntese, análise, conclusões, anexo | 6 |
| [manual.html](manual.html) | Manual: capa, sumário, preparação, procedimentos, problemas, referências | 6 |
| [document.html](document.html) | Documento curto sem capa nem sumário: proposta, ata, comunicado, one-pager | 2 |
| [spec.md](spec.md) | Esqueleto da spec, copiado pelo `new.sh` para `.work/NNN/spec.md` | — |

Os modelos não têm scripts nem recursos remotos; o logo está embutido.

## Contrato de preenchimento

- O `new.sh` copia o modelo para `documents/NNN/index.html`.
- Cada espaço é `<span data-slot="campo">{{campo}}</span>`. Substitua o elemento inteiro pelo conteúdo, escapado para HTML. Campos repetidos recebem o mesmo valor. A exceção é o `<title>`, com o marcador puro `{{titulo_curto}}`.
- No final não pode restar `{{`, `}}` nem `data-slot`. Tabelas e figuras de exemplo são estruturais, nunca dado real: substitua ou remova.
- Repita, adapte ou remova páginas de miolo conforme a spec, com IDs únicos, sumário e numeração física sincronizados. A capa é a página 1 e não mostra número; o sumário mostra 2.
- Figuras reais levam texto alternativo, legenda e fonte. O estilo não muda: se faltar um componente, pare e pergunte.

## Paginação e impressão

A4 retrato, margens internas de 22 mm, rodapé e quebras explícitas. Não reduza texto para caber: divida em páginas, repita cabeçalhos de tabela e atualize sumário e rodapés. O PDF sai do `pdf.sh` com as mesmas regras.

A identidade vive em [design/](../design/AGENTS.md). Ao mudá-la, atualize as variáveis `--brand-*` e o logo embutido nos três modelos.
