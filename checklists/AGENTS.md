---
name: checklists
purpose: Checklists genéricos de revisão e o esqueleto do checklist de cada documento.
read: cada agente só o seu checklist, quando entra no ciclo
---

# Checklists

| Arquivo | Quem usa | Como |
| --- | --- | --- |
| [reviewer.md](reviewer.md) | reviewer | Percorrido no navegador a cada ciclo; resultado em `.work/NNN/review.md` |
| [orchestrator.md](orchestrator.md) | orchestrator | Reflexão ao fim de cada ciclo; resultado em `.work/NNN/log.md` |
| [structure.md](structure.md) | `check.sh` | Lista do que o script verifica sozinho |
| [document.md](document.md) | `new.sh` | Esqueleto copiado para `documents/NNN/checklist.md` |

Os checklists genéricos são lidos daqui e nunca copiados para o documento; o resultado deles fica em `.work/`, que não é versionado. Só o `checklist.md` de cada documento sobe para o Git, porque traz os itens criados para aquele contexto e o histórico dos ciclos.
