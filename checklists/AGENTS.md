---
name: checklists
purpose: Checklists genéricos de revisão e o esqueleto do checklist de cada documento.
read: cada agente só o seu checklist, quando entra no ciclo
---

# Checklists

| Arquivo | Quem usa | Como |
| --- | --- | --- |
| [reviewer.md](reviewer.md) | reviewer | Percorrido no navegador a cada ciclo; resultado em `documents/NNN/review.md` |
| [orchestrator.md](orchestrator.md) | orchestrator | Reflexão ao fim de cada ciclo; resultado em `documents/NNN/log.md` |
| [structure.md](structure.md) | `check.sh` | Lista do que o script verifica sozinho |
| [document.md](document.md) | `new.sh` | Esqueleto copiado para `documents/NNN/checklist.md` |

Os checklists genéricos são lidos daqui e nunca copiados para o documento; o resultado deles fica no `log.md` e no `review.md` do documento, que sobem para o Git junto com o `checklist.md`, que traz os itens criados para aquele contexto e o histórico dos ciclos.
