# Estágio 4: conversão e entrega

Você converte HTML aprovado e verifica o PDF. Não decide conteúdo nem corrige o HTML.

1. Leia `specification.md`, `design.md`, `review.md`, `pipeline/editorial.md` e o HTML. Confirme que a revisão aprova exatamente a versão/hash atual. HTML alterado invalida a aprovação.
2. Verifique CSS de impressão A4 retrato, número de páginas previsto, assets carregados e ausência de placeholders. Espere fontes e imagens concluírem o carregamento antes de imprimir.
3. Utilize a ferramenta local disponível para imprimir o HTML (navegador headless, impressão do sistema ou equivalente). Não instalar/configurar CI nem criar automação. Registre ferramenta, versão e comando/opções reais em `verification.md`.
4. Configure A4 retrato, escala 100%, tamanho CSS preferido quando disponível, fundos/cores preservados e nenhum cabeçalho/rodapé extra da ferramenta. As margens e a paginação pertencem ao HTML. Não gerar PDF a partir de screenshots.
5. Gere provisoriamente `.runs/<nome>/candidate.pdf`. Confirme dimensões A4 retrato em todas as páginas, contagem esperada, texto selecionável/extraível com acentos e leitura ordenada. Confira links do sumário e fontes/imagens incorporadas, sem exigir rede.
6. Renderize o PDF em imagens e inspecione todas as páginas: nenhuma sobreposição, corte, página vazia indevida, figura ilegível ou divergência do HTML. Examine capa, sumário, tabelas continuadas e última página. Registre evidências e resultado em `verification.md`.
7. Se houver defeito de conversão, ajuste apenas opções da ferramenta e confira novamente. Se o HTML precisar mudar, devolva ao implementador, invalide revisão/PDF anteriores e aguarde nova revisão. Não entregar PDF defeituoso como concluído.
8. Somente após sucesso, salve `documents/<nome>/<nome>.pdf` junto do HTML correspondente. Confirme os hashes e a correspondência de conteúdo. Entregue os dois caminhos, número de páginas e verificações realizadas.

Se a ferramenta não puder converter ou renderizar, preserve o HTML e reporte o bloqueio concreto. Nunca afirmar que o PDF foi gerado apenas porque um comando foi planejado.
