<p align="center">
  <img src="../assets/readme/banners/html.png" alt="HTML" width="100%">
</p>

# Publicação de documento

O processo começa com escopo e especificação aprovados e termina com arquivos revisados numa PR.

```mermaid
flowchart TD
 A[Entendimento confirmado] --> B[Especificação aprovada]
 B --> C[Conteúdo e HTML fonte]
 C --> D[Build e verificação estrutural]
 D --> E[Revisão visual independente]
 E --> F{Aprovado?}
 F -->|não| C
 F -->|sim| G[PDF e conferência final]
 G --> H[PR do documento]
 H --> I[Main e galeria]
```

A autoria só começa depois da aprovação do escopo, e uma falha estrutural, uma paginação incompleta ou uma revisão visual pendente impedem que o documento seja declarado pronto. Depois de três ciclos sem convergência o processo volta ao responsável, e o PDF exige um navegador disponível.