# Documentos

Cada documento concluído ocupa uma pasta em kebab-case:

```text
documents/
  <nome>/
    <nome>.html
    <nome>.pdf
```

O HTML contém CSS e assets de renderização internos. O PDF é A4 retrato em todas as páginas e corresponde ao HTML aprovado.

Contratos, fontes de trabalho, imagens de QA e logs ficam em `.runs/<nome>/`, ignorado pelo Git. Não incluir arquivos CSS, documentos de especificação ou PDFs provisórios nesta pasta. Não sobrescrever outra edição sem autorização.
