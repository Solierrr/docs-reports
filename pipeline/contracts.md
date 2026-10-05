# Contratos entre estágios

Todos os contratos ficam em `.runs/<nome>/`, ignorado pelo Git. Não são conteúdo do relatório e não devem aparecer em HTML/PDF.

## specification.md

- Nome, tipo, objetivo, público, idioma, data/período, versão e responsável.
- Fontes disponíveis, escopo incluído/excluído e questões que o documento responde.
- Template escolhido e seções obrigatórias/opcionais, hierarquia e tamanho esperado.
- Para relatório: síntese, evidências, análise, conclusões e recomendações quando solicitadas.
- Para manual: contexto, público, pré-requisitos, procedimentos, resultado esperado e solução de problemas quando aplicável.
- Identidade verificada, parâmetros editoriais e tratamento aprovado de lacunas.
- Critérios de aceite, respostas da entrevista, aprovação explícita do usuário, estado e próxima ação.

## sources.md

Identificador estável por fonte, título, autor/organização quando disponível, arquivo ou URL, data de publicação/versão, data de consulta e localização (página, seção, intervalo). Para cada afirmação quantitativa, registrar valor, unidade, período, fórmula se derivada e fonte. Distinguir fatos, interpretações e recomendações. Para manuais, documentar versão do sistema e evidência de cada procedimento; não alegar execução que não aconteceu.

## design.md

Template e arquivos de identidade utilizados, tokens efetivos, assets/fontes incorporados, composição da capa, hierarquia, mapa das páginas e distribuição do conteúdo. Registrar adaptações necessárias sem mudar os fundamentos do template ou a identidade. A4 retrato em todas as páginas e CSS interno são invariantes.

## review.md

Versão/hash do HTML revisado, data, checklist item a item, resultado `approved` ou `changes-required`. Cada falha traz gravidade, página/seção, evidência, correção proposta e estágio responsável. Pendências materiais impedem aprovação. Não usar aprovação genérica sem inspeção.

## verification.md

Hash do HTML aprovado e PDF correspondente, ferramenta/comando/configuração de conversão, número e dimensões das páginas, fontes/imagens carregadas, conferência do texto selecionável, links/sumário, imagens de páginas inspecionadas e resultado visual. Indicar o que foi realmente verificado; não declarar sucesso com base apenas na existência do PDF.
