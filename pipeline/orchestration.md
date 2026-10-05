# Orquestração

## Fronteiras de contexto

O orquestrador acompanha a entrevista, transmite respostas do usuário, verifica arquivos e coordena transições. Cada estágio é um subagente novo, sem histórico herdado e sem fork. Ele lê apenas as instruções e contratos explicitamente fornecidos. Papéis simulados dentro da mesma conversa não substituem revisão independente.

O prompt de disparo deve informar caminho absoluto do repositório, caminho do estágio a ler integralmente, nome do documento, contratos de entrada, saídas esperadas e decisões já aprovadas. Use este formato:

```text
Repositório: <caminho absoluto>
Documento: <nome>
Leia integralmente pipeline/<estágio>.md e suas referências.
Execute as instruções; não apenas as resuma.
Entradas: <caminhos absolutos dos contratos>
Saídas: <caminhos absolutos>
Decisões aprovadas: <decisões>
Não receba histórico de outros estágios. Não altere contratos de outra etapa.
Reporte arquivos produzidos, verificações realizadas e lacunas concretas.
```

## Interação

Perguntas do estágio 1 são repassadas ao usuário. Retome o mesmo subagente com as respostas. O usuário aprova a especificação uma vez antes da implementação; essa aprovação inclui template, conteúdo e parâmetros. Depois, prossiga sem solicitar aprovações redundantes. Mudança de escopo, dados contraditórios ou decisões não cobertas pelo contrato exigem esclarecimento e atualização da aprovação afetada.

Correções visuais voltam ao mesmo implementador. Falhas de conteúdo voltam ao especificador. O revisor não reescreve HTML e o conversor não corrige conteúdo/layout. Após qualquer mudança no HTML, invalide a revisão/PDF anteriores e execute revisão e conversão novamente. O orquestrador não pode aprovar o próprio conteúdo em nome do usuário.

## Verificação e retomada

Após cada estágio, confirme existência e conteúdo dos arquivos; não confie somente no relato do subagente. Registre evidências nos contratos locais. Não publique um PDF incompleto como resultado final.

Se uma etapa falhar, verifique o que existe no disco e retome o agente responsável. Se não puder retomá-lo, crie outro sem histórico e forneça os contratos, decisões e pendências por escrito. Sem suporte a subagentes, interrompa a execução coordenada e instrua a abrir uma sessão independente para o próximo estágio.

Não sobrescreva entregáveis de outro documento nem uma edição anterior sem autorização. Se o nome já existir, confirme se é revisão ou novo documento. Ajustes dentro da mesma geração aprovada podem atualizar os arquivos da execução.

## Git

Somente HTML/PDF concluídos e aprovados pela revisão entram em `documents/`. `.runs/` é local e ignorado. Não realizar push, abrir PR ou merge como efeito colateral da geração: siga o pedido específico e as regras GitHub do projeto.
