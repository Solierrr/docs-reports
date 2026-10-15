# docs-reports

Repositório para produzir **relatórios, documentos e manuais de instrução da Solaria em HTML**. Os modelos já trazem a identidade visual; o agente só escreve o conteúdo nos espaços marcados.

Este arquivo é a fonte única de instruções para qualquer assistente de IA (Claude, Gemini, Codex, Cursor...). `CLAUDE.md` e `GEMINI.md` só apontam para ele.

## Você é o orquestrador

A sessão principal assume o papel de **orquestrador**. Leia integralmente [orquestrador.md](.claude/agents/orquestrador.md) antes de qualquer ação e siga-o. Os demais agentes são especialistas que o orquestrador despacha.

| Agente | Papel | Arquivo |
| --- | --- | --- |
| orquestrador | Fala com o usuário, conduz o grilling, despacha e decide quando encerrar | [orquestrador.md](.claude/agents/orquestrador.md) |
| pesquisador | Reúne fontes e registra origem, data e limitações | [pesquisador.md](.claude/agents/pesquisador.md) |
| redator | Escreve o conteúdo nos espaços do modelo | [redator.md](.claude/agents/redator.md) |
| diagramador | Copia o modelo e aplica o conteúdo mantendo a identidade | [diagramador.md](.claude/agents/diagramador.md) |
| revisor | Revisa de forma independente e só aponta falhas | [revisor.md](.claude/agents/revisor.md) |

No Claude Code, os arquivos de `.claude/agents/` funcionam como subagentes nativos. Em outras ferramentas, o agente é assumido lendo o arquivo indicado, mas o **revisor nunca pode ser o mesmo contexto que redigiu ou diagramou**: use uma sessão separada e entregue só o HTML e a especificação. Sem subagentes nem sessão separada, interrompa e peça ao usuário para abrir outra sessão para a revisão.

## Regra obrigatória: grilling antes de gerar

Nenhum documento começa sem uma rodada de **grilling** (skill em [.claude/skills/grilling/SKILL.md](.claude/skills/grilling/SKILL.md); leia o arquivo se a ferramenta não carregar skills) e sem uma **especificação aprovada pelo usuário**. O grilling vale para documento novo e para mudança de escopo. Não vale para corrigir erro de digitação em documento já aprovado. Silêncio não é aprovação.

## Mapa do repositório

| Caminho | Conteúdo |
| --- | --- |
| [templates/](templates/README.md) | `report.html`, `manual.html` e `document.html`, com a identidade aplicada e espaços marcados `data-slot` |
| [design-system/](design-system/README.md) | Identidade única: tokens, logos, fontes e diretrizes. É a fonte de verdade visual |
| [documents/](documents/README.md) | Entregáveis: `documents/<nome>/<nome>.html` |
| [editorial.md](editorial.md) | Convenções de estrutura, tabelas, figuras, fontes e impressão |
| `.runs/<nome>/` | Trabalho local ignorado pelo Git: `especificacao.md`, `fontes.md`, `conteudo.md`, `log.md`, `revisao.md`, `fontes/` e `capturas/` |

## Regras gerais

- **Entregável:** HTML autocontido (CSS interno, imagens embutidas, sem dependência de rede para renderizar). A fonte Plus Jakarta Sans não é incorporada: deve estar instalada na máquina. PDF só sob pedido, pela impressão do navegador, com A4 retrato, margem zero e fundos ativados. Não existe agente nem etapa de PDF.
- **Identidade:** use somente `design-system/`. O agente nunca escolhe cor, fonte, espaçamento ou layout, não troca a paleta por inspiração externa e não cria modelo novo por documento. Se a identidade não cobrir uma necessidade, pare e pergunte.
- **Modelos:** copie o modelo adequado para `documents/<nome>/<nome>.html` e preencha os `data-slot`. Substitua cada `<span data-slot="x">{{x}}</span>` pelo seu conteúdo, sem deixar marcador, atributo `data-slot` ou instrução para trás. Páginas de miolo podem ser repetidas, adaptadas ou removidas conforme a especificação, mantendo sumário, IDs e numeração sincronizados.
- **Fatos:** não invente dados, números, citações, metadados bibliográficos nem instruções operacionais. Toda afirmação factual tem fonte registrada. Pesquisa na internet é permitida, com origem, data e limitações.
- **Sobrescrita:** não sobrescreva um documento existente sem autorização do usuário; o histórico fica no Git. Se o nome já existir, pergunte se é revisão ou documento novo.
- **Idioma:** instruções e documentos em português do Brasil, salvo pedido diferente na especificação.

## Verificação

Sem scripts nem dependências no repositório. O revisor abre o HTML no navegador disponível no ambiente e confere overflow horizontal, imagens quebradas, links internos, marcadores esquecidos e a visualização de impressão A4. As capturas ficam em `.runs/<nome>/capturas/`. Sem navegador disponível, relate a limitação: não declare o documento verificado.

## Git

Commits em inglês, minúsculos, no formato `tipo: descrição`, sem escopo entre parênteses e sem atribuição de assistente. Publicar apenas a branch; abrir PR ou mergear somente quando solicitado. Não versionar `.runs/`, credenciais ou registros intermediários.
