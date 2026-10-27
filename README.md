---
name: readme
purpose: Apresentação do repositório para pessoas. Agentes começam pelo AGENTS.md.
read: humanos; agentes não precisam
---

# docs-reports

SDD de suporte para produzir **relatórios, manuais e documentos da Solaria em HTML e PDF** com agentes de IA. Os modelos já trazem a identidade visual; os agentes escrevem o conteúdo, montam, revisam e publicam, com checklists e scripts prontos.

## Como usar

1. Abra um assistente de IA (Claude Code, Codex, Gemini, Cursor...) na raiz do repositório. Ele lê o [AGENTS.md](AGENTS.md) e assume o papel de orchestrator.
2. Diga o que precisa. O orchestrator conduz uma entrevista (grilling) até vocês fecharem o entendimento.
3. Ele cria o próximo número em `documents/`, escreve a spec e os itens de verificação daquele documento. **Aprove a spec**: nada é escrito antes disso.
4. Writer, builder e reviewer trabalham em ciclos com reflexão do orchestrator, no máximo três antes de voltar para você.
5. Com o HTML aprovado, sai o PDF e o orchestrator abre a PR com `documents/NNN/`.

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Entrada única para qualquer harness. `CLAUDE.md`, `GEMINI.md` e `.claude/` apontam para ele |
| [functions.yaml](functions.yaml) | Papéis e scripts em formato de consulta |
| [requirements.md](requirements.md) | O que cada agente precisa do ambiente |
| [agents/](agents/AGENTS.md) | orchestrator, writer, builder, reviewer e researcher |
| [checklists/](checklists/AGENTS.md) | Revisão de design bruto, reflexão do ciclo e verificações estruturais |
| [scripts/](scripts/AGENTS.md) | `new`, `build`, `check`, `pdf`, `index` e `commit` |
| [skills/](skills/) | Entrevista obrigatória, fontes em arquivo e aplicação de revisões |
| [templates/](templates/AGENTS.md) | Modelos `report`, `manual`, `faq` e `document`, com conteúdo de exemplo |
| [design/](design/AGENTS.md) | Identidade Solaria: tokens, logos e capa |
| [editorial.md](editorial.md) | Convenções editoriais |
| [documents/](documents/AGENTS.md) | Entregáveis: `NNN/source.html`, `NNN/index.html` (paginado), `NNN/NNN.pdf` e `NNN/checklist.md` |
| [gallery/](gallery/) | Prévia dos modelos no GitHub Pages (Vite e React) |

Os scripts rodam em `sh` (Git Bash no Windows) sem instalar nada; o PDF usa o Chrome ou o Edge já instalados. A galeria é um app separado, com CI, release-please e Dependabot.

## Contribuição e licença

Commits em inglês, minúsculos, no formato `tipo: descrição`, sem escopo entre parênteses. Não versionar `.work/`, credenciais nem rascunhos. Os arquivos de configuração de agentes (`AGENTS.md`, `agents/`, `.claude/`, `skills/`) são versionados de propósito.

Licença: [CC0 1.0 Universal](LICENSE).
