# docs-reports

Repositório para produzir **relatórios, documentos e manuais de instrução da Solaria em HTML**, com agentes de IA. Os modelos já trazem a identidade visual; o agente escreve o conteúdo por cima.

## Como usar

1. Abra uma sessão de um assistente de IA (Claude Code, Gemini, Codex...) na raiz do repositório. Ele lê o [AGENTS.md](AGENTS.md) e assume o papel de orquestrador.
2. Diga o que precisa: um relatório, um manual ou um documento. O orquestrador conduz uma entrevista (grilling) e grava uma especificação.
3. **Aprove a especificação.** Nada é gerado antes disso.
4. O orquestrador despacha os agentes (pesquisa, redação, diagramação) e uma revisão independente, e repete até aprovar ou atingir 3 ciclos.
5. O resultado fica em `documents/<nome>/<nome>.html`.

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Fonte única de instruções. `CLAUDE.md` e `GEMINI.md` apontam para ele |
| [.claude/agents/](.claude/agents/) | Agentes: orquestrador, pesquisador, redator, diagramador e revisor, com suas personas (lentes) |
| [.claude/skills/grilling/](.claude/skills/grilling/SKILL.md) | Skill obrigatória de entrevista antes de gerar |
| [templates/](templates/README.md) | `report.html`, `manual.html` e `document.html` com identidade e espaços `data-slot` |
| [design-system/](design-system/README.md) | Identidade Solaria: tokens, logos, fontes, diretrizes |
| [editorial.md](editorial.md) | Convenções editoriais |
| [documents/](documents/README.md) | Entregáveis |
| [gallery/](gallery/) | Prévia dos modelos no GitHub Pages (app Vite com React) |
| `.runs/<nome>/` | Trabalho local ignorado pelo Git |

A geração de documentos não usa aplicação, build nem dependências. A galeria de prévia dos modelos (`gallery/`, publicada no GitHub Pages) é um app Vite separado, com CI, release-please e Dependabot. HTML e PDF (sob pedido, pela impressão do navegador) em A4 retrato; o PDF não é o entregável padrão.

## Contribuição e licença

Commits em inglês, minúsculos, no formato `tipo: descrição`, sem escopo entre parênteses. Publicar a branch; abrir PR e mergear somente quando solicitado. Não versionar `.runs/`, credenciais ou registros intermediários. Neste repositório os arquivos de configuração de IA (`AGENTS.md`, `.claude/agents/`, skills) são versionados de propósito.

Licença: [CC0 1.0 Universal](LICENSE).
