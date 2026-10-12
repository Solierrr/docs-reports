# Documentos

Cada documento concluído ocupa uma pasta em kebab-case:

```text
documents/
  <nome>/
    <nome>.html
```

O HTML é autocontido: CSS, logo e imagens embutidos, sem depender de rede. Um PDF só existe se o usuário pedir, gerado pela impressão do navegador (A4 retrato, margens zero, fundos ativados), e corresponde ao HTML aprovado.

Especificação, fontes, conteúdo, log, revisão e capturas ficam em `.runs/<nome>/`, ignorado pelo Git. Não incluir arquivos CSS, especificações ou rascunhos nesta pasta. Não sobrescrever outro documento sem autorização.
