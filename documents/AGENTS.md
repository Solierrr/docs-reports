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
    source.html    o que o agente edita: HTML corrido, com caminhos para ../../design/
    index.html     gerado pelo build.sh: paginado, autocontido e sem script; é o entregável
    004.pdf        gerado pelo pdf.sh a partir do index.html, depois da aprovação
    checklist.md   itens deste documento e histórico dos ciclos
```

Título, tipo e slug ficam no cabeçalho YAML do `checklist.md`. Nada além desses quatro arquivos entra aqui: spec, conteúdo, fontes, revisão, log e capturas ficam em `.work/NNN/`, ignorado pelo Git.

Não sobrescreva outro documento. Uma correção de um documento aprovado é um novo ciclo no mesmo número; um documento novo, ainda que derivado, é um novo número.

A galeria no GitHub Pages publica, além dos modelos, todo documento que tiver `index.html`: o `index.html` e o PDF são copiados como estão, e o título e o tipo vêm do cabeçalho do `checklist.md`. Publicar aqui (merge na `main`) já atualiza a galeria.
