# Pipeline de geração

Leia integralmente este roteiro antes de iniciar. Ele organiza a execução; os arquivos dos estágios contêm as instruções operacionais.

## Fluxo

1. [Entrevista e especificação](01-specification.md): consultar identidade e template, executar grill-me, reunir fontes e salvar contrato. Aguardar aprovação explícita.
2. [Implementação](02-implementation.md): copiar o template escolhido, aplicar identidade e conteúdo aprovado, salvar HTML e conferir a renderização.
3. [Revisão](03-review.md): revisão independente de conteúdo, apresentação e impressão. Devolver falhas ao estágio responsável até aprovação.
4. [Conversão e entrega](04-pdf.md): converter HTML aprovado, conferir PDF visualmente e tecnicamente e entregar HTML e PDF.

As etapas são sequenciais. Não converter antes da aprovação da revisão. Leia também [orchestration.md](orchestration.md), [editorial.md](editorial.md) e [contracts.md](contracts.md).

## Entradas

Objetivo, relatório ou manual, público, escopo, nome em kebab-case, fontes/caminhos disponíveis, data/período e informações fornecidas na entrevista. Não pergunte novamente por respostas já fornecidas. Pesquisa na internet e consulta às fontes acessíveis são permitidas; registre origem, data e limitações. Não invente dados nem instruções operacionais.

`design-system/` é a única identidade. `templates/report.html` e `templates/manual.html` são a base obrigatória. Não criar um layout novo por execução, trocar a paleta por inspiração externa ou perguntar sobre paisagem: todas as páginas são retrato.

## Saídas e estado

Contratos locais: `.runs/<nome>/{specification,sources,design,review,verification}.md`. Entregáveis: `documents/<nome>/<nome>.html` e `documents/<nome>/<nome>.pdf`.

Estados: `briefing`, `awaiting-approval`, `implementing`, `reviewing`, `converting`, `delivered`, `blocked`. Registre estado e próxima ação em `specification.md`. Aprovação só existe se o usuário a conceder; silêncio não equivale a aprovação.

Se a identidade estiver incompleta, liste exatamente os arquivos/campos ausentes e interrompa a geração antes de implementar. Se faltarem ferramentas de subagentes, renderização ou conversão, reporte a necessidade e preserve os arquivos já produzidos; não declare entrega concluída.
