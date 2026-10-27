---
name: scripts
purpose: Scripts sh que poupam tokens. Uso, argumentos e saída estão em functions.yaml.
read: só functions.yaml (chave scripts); abra um script apenas se ele falhar sem explicação
---

# Scripts

| Script | Uso | Quem chama |
| --- | --- | --- |
| [new.sh](new.sh) | `sh scripts/new.sh <type> <slug> "<título>"` | orchestrator, depois do grilling |
| [check.sh](check.sh) | `sh scripts/check.sh <NNN>` | builder, reviewer e orchestrator |
| [build.sh](build.sh) | `sh scripts/build.sh <NNN>` | builder, depois de cada mudança no `source.html` |
| [pdf.sh](pdf.sh) | `sh scripts/pdf.sh <NNN>` | builder, depois da aprovação do HTML |
| [index.sh](index.sh) | `sh scripts/index.sh [docs]` | qualquer agente que precise de um mapa |
| [commit.sh](commit.sh) | `sh scripts/commit.sh <NNN>` | orchestrator, com o aval do usuário |

Rodam em `sh` com ferramentas padrão (Git Bash no Windows), da raiz ou de qualquer pasta. Saída curta de propósito: só o necessário para a próxima decisão. Requisitos de cada um em [requirements.md](../requirements.md).
