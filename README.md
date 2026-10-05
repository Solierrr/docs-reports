# docs-reports

Templates e pipeline local para produzir relatórios e manuais da Solaria em HTML autocontido e PDF A4 retrato.

## Estrutura

| Diretório | Conteúdo |
| --- | --- |
| [pipeline/](pipeline/README.md) | Instruções operacionais, entrevista, contratos e critérios de revisão |
| [templates/](templates/README.md) | Modelos HTML de relatório e manual com CSS interno |
| [design-system/](design-system/README.md) | Identidade visual única, preenchida pelo responsável |
| [documents/](documents/README.md) | Entregáveis HTML e PDF, organizados por documento |
| `.runs/<nome>/` | Especificação, fontes, decisões e revisões locais; ignorado pelo Git |

## Começar

1. Preencha a identidade conforme [design-system/README.md](design-system/README.md).
2. Instrua o agente a ler [pipeline/README.md](pipeline/README.md) integralmente e iniciar uma geração, informando objetivo, tipo de documento e fontes disponíveis.
3. Responda à entrevista e aprove a especificação antes da implementação.
4. O orquestrador executa cada estágio com um subagente novo sem histórico herdado, confere as saídas e entrega os dois arquivos em `documents/<nome>/`.

Não há aplicação, executor, comando de build, workflow ou agendamento neste repositório. Os arquivos Markdown são instruções para o agente local, que utiliza as ferramentas disponíveis no ambiente. Se não houver subagentes, cada estágio exige uma sessão nova e transferência explícita dos arquivos de contrato.

## Padrão editorial

A4 exclusivamente retrato, capa corporativa, sumário, hierarquia numerada, legendas e fontes de tabelas/figuras, referências e anexos quando aplicáveis. A organização editorial do relatório gerencial do Itaú inspira capa, divisórias e miolo; Firecrawl e Cloudflare são referências complementares de clareza e hierarquia. A identidade final vem somente de `design-system/`.

São convenções selecionadas para documentos corporativos. Não se declara conformidade integral com normas ABNT. HTML e PDF devem apresentar o mesmo conteúdo, com texto selecionável, sem depender de animação, interação ou acesso à rede.

## Contribuição e licença

Commits em inglês, minúsculos, no formato `tipo: descrição`, sem escopo entre parênteses. Publicar a branch; abrir PR e mergear somente quando solicitado. Não versionar registros intermediários, credenciais ou atribuições de assistentes.

A pipeline e os templates são o produto deste repositório e são versionados. O planejamento da implementação e os registros de execução permanecem fora dos entregáveis.

Licença: [CC0 1.0 Universal](LICENSE).
