---
name: agents
purpose: Instruções de cada papel. Um arquivo por agente, neutro de harness.
read: o agente lê só o próprio arquivo; o orchestrator lê o seu
---

# Agentes

| Arquivo | Papel |
| --- | --- |
| [orchestrator.md](orchestrator.md) | Sessão principal: grilling, despacho, reflexão e decisão |
| [writer.md](writer.md) | Refinador e idealizador: conteúdo em Markdown |
| [builder.md](builder.md) | Implementador: HTML a partir do modelo, e o PDF |
| [reviewer.md](reviewer.md) | Revisor de design bruto, em contexto separado |
| [researcher.md](researcher.md) | Opcional: fontes com origem, data e limitações |

Entradas, saídas, scripts e requisitos de cada um estão em [functions.yaml](../functions.yaml) e [requirements.md](../requirements.md); os arquivos daqui só têm o que precisa de explicação.

No Claude Code, `.claude/agents/<nome>.md` registra cada papel como subagente nativo e aponta para cá. Em outro harness, o agente assume o papel lendo o arquivo daqui. Ao mudar um papel, edite só este diretório e o `functions.yaml`.
