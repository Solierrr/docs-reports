# Templates de documentos

`report.html` e `manual.html` são bases estruturais reutilizáveis, com CSS interno, sem scripts ou recursos remotos. A aparência neutra permite inspecionar a estrutura antes de preencher o design system; não define a identidade Solaria e não autoriza gerar um documento final sem ela.

## Contrato de preenchimento

- Copiar o template adequado para `documents/<nome>/<nome>.html`.
- Substituir todos os marcadores `{{campo}}` por conteúdo aprovado, escapando texto para HTML. Os nomes descrevem o conteúdo esperado; campos repetidos devem receber o mesmo valor.
- Remover o selo TEMPLATE e os textos instrucionais apenas após preencher e revisar o documento.
- Resolver cores, fontes, escala tipográfica e elementos de marca a partir de `design-system/`. Substituir os valores CSS neutros de `--brand-ink`, `--brand-paper`, `--brand-accent`, `--brand-muted`, `--brand-line`, `--brand-cover` e `--brand-cover-ink`, além de `--font-body` e `--font-heading`. Esses valores válidos são somente defaults de prévia, nunca identidade aprovada.
- Incorporar logos, imagens e fontes como dados embutidos quando necessários. O HTML final deve abrir offline sem arquivo CSS separado ou dependência de arquivos externos. Preservar texto real, headings, listas, tabelas e legendas sem converter páginas em imagens.
- Repetir, adaptar ou remover as páginas de miolo conforme a especificação aprovada. Manter os IDs únicos, os links do sumário e a numeração física de todas as páginas sincronizados. A capa conta como página 1, mas não mostra número; o sumário mostra 2. Os números são explícitos para conversão consistente, não calculados pelo navegador.

## Paginação e estrutura

As seis páginas de cada modelo demonstram capa, sumário e miolo. São A4 retrato, com margens internas de 22 mm, rodapé e quebras explícitas. A capa tem composição corporativa com título, período ou versão e identificação editorial. Relatório e manual compartilham a linguagem visual; suas estruturas de conteúdo diferem.

Os templates adotam convenções editoriais de títulos numerados, sumário navegável, legendas, fontes e referências. Não representam certificação de conformidade integral à ABNT. Identificar referências com dados bibliográficos disponíveis e não inventar autores, datas ou fontes.

Renderizar com tamanho A4, escala 100%, margens de impressão zero, fundos habilitados e cabeçalhos/rodapés automáticos do navegador desabilitados. O template fornece suas próprias margens e rodapés. Conferir cada página no PDF após alterações. Não reduzir o texto para acomodar conteúdo longo: dividir parágrafos, tabelas e procedimentos em páginas adicionais, repetir cabeçalhos de tabelas e atualizar sumário e rodapés. Nunca usar paisagem, altura com clipping ou conteúdo escondido para corrigir overflow.

Os blocos de evidências e tabelas são placeholders estruturais, não dados de exemplo ou resultados factuais. Uma figura real deve incluir texto alternativo, legenda e fonte; o espaço reservado deve ser substituído ou removido. Validar que o PDF tenha texto selecionável e não contenha marcadores, instruções ou o selo TEMPLATE antes da entrega.
