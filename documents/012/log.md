# log 012

## Ciclo 1

- **Entrada:** Documento das APIs REST com Spring, com os requisitos de CRUD, validação, exceções, Swagger e segurança.
- **O que mudou:** montagem do source.html a partir do modelo, com as evidências e os links conferidos na branch main.
- **check.sh:** ok.
- **Pendente:** revisão independente.

## Ciclo 2

- **Reviewer (ciclo 1):** pendências a resolver. O conjunto era descrito como Java, mas o api-auth é Kotlin; uma afirmação sobre o tratamento de erro 401 não estava nos arquivos linkados.
- **O que mudou:** Texto ajustado para Java e Kotlin e a afirmação do M6 reduzida ao que o GlobalExceptionHandler comprova.
- **check.sh:** ok.

## PDF

- Gerado em A4 retrato pelo pdf.sh depois da aprovação do ciclo 2.

## Ciclo 3

- **Pedido do dono:** mostrar o que o projeto reúne em cada disciplina e apontar os repositórios que fazem parte dela.
- **O que mudou:** acrescentado o capítulo Entregas adicionais, com um parágrafo e os repositórios citados pelo nome.
- **Reviewer (ciclo 3):** pendências a resolver, todas aplicadas neste ciclo.
- **check.sh:** ok.
- **PDF:** regerado.

## Ciclo 4

- **Pedido do dono:** ajustes de capa e de escopo.
- **O que mudou:** capa sem versão e classificação.
- **check.sh:** ok.
- **PDF:** regerado.

## Revisão de prontidão

- **Entrada:** revisão final de HTML e PDF antes da entrega.
- **O que mudou:** Tabela de repositórios alinhada ao índice, com os oito repositórios e o papel de cada um confirmado nos READMEs.
- **Reviewer:** as pendências apontadas foram aplicadas e o texto do PDF confere com o do HTML.
- **check.sh:** ok.
- **PDF:** regerado.

## Revisão para reenvio em 12 de novembro de 2026

O relatório mantém os seis mínimos e os quatro extras na ordem do enunciado. O extra de rotinas SQL descreve a chamada de cobrança e as funções de integridade acionadas por escritas, com referência separada às rotinas do schema regras. O capítulo de integração liga os fluxos aos repositórios que os implementam e aos serviços complementares.
Os dois cenários de SubscriptionChargePostgresIntegrationTest passaram no PostgreSQL 18 local, com as sete migrations aplicadas pelo Flyway.
