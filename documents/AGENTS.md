---
name: documents
purpose: Entregáveis versionados, um número por documento.
read: o orchestrator para achar documentos anteriores (prefira sh scripts/index.sh docs)
---

# Documentos

Cada documento ocupa uma pasta numerada, criada pelo `new.sh`:

```text
documents/
  004/
    index.html     HTML autocontido: CSS, logo e imagens embutidos
    004.pdf        gerado pelo pdf.sh depois da aprovação do HTML
    checklist.md   itens deste documento e histórico dos ciclos
```

Título, tipo e slug ficam no cabeçalho YAML do `checklist.md`. Nada além desses três arquivos entra aqui: spec, conteúdo, fontes, revisão, log e capturas ficam em `.work/NNN/`, ignorado pelo Git.

Não sobrescreva outro documento. Uma correção de um documento aprovado é um novo ciclo no mesmo número; um documento novo, ainda que derivado, é um novo número.
