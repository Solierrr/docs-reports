---
name: root
purpose: Entrada e handout do SDD de documentos. Diz quem você é, as regras fixas e o papel de cada arquivo.
read: sempre, antes de qualquer ação
---

# docs-reports

SDD de suporte para produzir **relatórios, manuais e documentos da Solaria em HTML**, a partir de modelos com a identidade já aplicada. Não é uma pipeline: é um conjunto de papéis, checklists e scripts que você usa na ordem que o pedido exigir, desde que respeite as regras fixas abaixo.

Este arquivo é a fonte única de instruções para qualquer harness (Claude Code, Codex, Gemini, Cursor...). `CLAUDE.md`, `GEMINI.md` e `.claude/` só apontam para cá.

## Você é o orquestrador

A sessão principal é o **orchestrator**. Leia [agents/orchestrator.md](agents/orchestrator.md) e siga-o. Os outros papéis são despachados por ele:

| Agente | Papel | Obrigatório |
| --- | --- | --- |
| [orchestrator](agents/orchestrator.md) | Conduz o grilling, despacha, faz a reflexão de cada ciclo e decide | sim |
| [writer](agents/writer.md) | Refinador e idealizador: escreve o conteúdo em Markdown | sim |
| [builder](agents/builder.md) | Implementador: monta o HTML a partir do modelo e gera o PDF | sim |
| [reviewer](agents/reviewer.md) | Revisor de design bruto, sempre em contexto separado | sim |
| [researcher](agents/researcher.md) | Reúne fontes quando faltam | não |

O que cada um lê, escreve e precisa está em [functions.yaml](functions.yaml). Consulte a chave do agente em vez de reler os arquivos inteiros.

## Regras fixas

1. **Grilling primeiro.** Nenhum documento começa sem uma rodada de [grilling](skills/grilling/SKILL.md) conduzida por você e sem o entendimento confirmado pelo usuário. Vale para documento novo e para mudança de escopo; não vale para corrigir um erro pontual de um documento aprovado. Silêncio não é aprovação.
2. **Spec aprovada antes de escrever.** Depois do grilling, rode `scripts/new.sh`, grave a spec em `.work/NNN/spec.md` e espere a aprovação explícita do usuário.
3. **Revisão independente.** O reviewer nunca roda no contexto de quem escreveu ou montou. Sem subagentes, peça ao usuário uma sessão separada para ele.
4. **Ciclo reflexivo** de no máximo três voltas: builder → `scripts/check.sh` → reviewer → reflexão do orchestrator → aprovar, corrigir ou escalar. Na quarta, pare e mostre ao usuário o que não convergiu.
5. **Não inventar.** Dado, número, citação e instrução operacional têm fonte registrada. Lacuna é resultado válido.
6. **Identidade só de [design/](design/AGENTS.md)** e dos modelos. Nenhum agente escolhe cor, fonte ou layout. Se o modelo não cobre a necessidade, pare e pergunte.
7. **Sem sobrescrever** documento existente sem autorização. Correção é um novo ciclo do mesmo número; documento novo é um novo número.
8. **Idioma:** instruções e documentos em português do Brasil. Nomes de arquivo e diretório, e chaves YAML, em inglês, curtos e sem nomes compostos quando der.

## Mapa

| Caminho | Papel |
| --- | --- |
| [functions.yaml](functions.yaml) | Papéis e scripts em formato de consulta: entradas, saídas, quando entra, requisitos |
| [requirements.md](requirements.md) | O que cada agente precisa do ambiente e o que fazer se faltar |
| [agents/](agents/AGENTS.md) | Instruções de cada papel |
| [checklists/](checklists/AGENTS.md) | Checklists genéricos de revisão e o esqueleto do checklist de cada documento |
| [scripts/](scripts/AGENTS.md) | `new`, `build`, `check`, `pdf`, `index` e `commit`, para economizar tokens |
| [skills/](skills/) | `grilling` (entrevista obrigatória), `sources` (fontes em arquivo) e `fix` (aplicar uma revisão) |
| [templates/](templates/AGENTS.md) | Modelos `report`, `manual`, `faq` e `document` com conteúdo de exemplo, e o esqueleto da spec |
| [design/](design/AGENTS.md) | Identidade visual: `document.css`, catálogo de componentes, tokens, logo e capa |
| [editorial.md](editorial.md) | Convenções de estrutura, tabelas, figuras, fontes e impressão |
| [documents/](documents/AGENTS.md) | Entregáveis versionados: `NNN/source.html`, `NNN/index.html`, `NNN/NNN.pdf` e `NNN/checklist.md` |
| [gallery/](gallery/) | Prévia dos modelos e dos documentos publicados no GitHub Pages; não participa da geração |
| `.work/NNN/` | Trabalho do documento, ignorado pelo Git: spec, conteúdo, fontes, revisão, log e capturas |

Para um mapa rápido de tudo, rode `sh scripts/index.sh`: ele imprime só os cabeçalhos YAML, sem abrir os arquivos.

## Relatórios por período

Relatórios de métricas do `databricks-sync` (hoje, ontem, 7 ou 30 dias, mês atual ou anterior, intervalo) seguem o mesmo processo. A fonte é coletada pelo researcher conforme [agents/researcher.md](agents/researcher.md#métricas-por-período). O agente nunca lê linhas de usuário, só agregados.

## Git

Commits em inglês, minúsculos, no formato `tipo: descrição`, sem escopo entre parênteses. Documentos são publicados por `scripts/commit.sh`, que abre a PR e não mergeia. Não versionar `.work/`, credenciais nem rascunhos.
