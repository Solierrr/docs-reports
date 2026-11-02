<p align="center">
  <img src="../assets/readme/banners/html.png" alt="HTML" width="100%">
</p>

# Execução local

Use Node.js 24 ou superior, npm, shell `sh` com utilitários Unix e Chrome ou Edge. O guia comum está em [TYPESCRIPT.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/TYPESCRIPT.md).

Execute `make install` e `make dev` para abrir a galeria, e use o `make vault` para exportar a pasta `/reports` quando uma atividade precisar de configuração externa, já que a galeria em si é construída a partir dos arquivos locais.

| Comando | Efeito |
|---|---|
| `make build` | Gera amostras e constrói a galeria |
| `make test` | Typecheck da galeria |
| `make lint` | Não tem comando configurado |
| `sh scripts/build.sh NNN` | Pagina um documento existente |
| `sh scripts/check.sh NNN` | Confere estrutura e arquivos |
| `sh scripts/pdf.sh NNN` | Imprime o HTML final em PDF |

Os scripts de documento exigem a estrutura criada pelo processo de autoria, e o build instala as dependências da galeria quando o `pagedjs` está ausente. Sem um navegador configurado o PDF não é produzido, e a variável `BROWSER` permite escolher o executável.