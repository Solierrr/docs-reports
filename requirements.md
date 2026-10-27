---
name: requirements
purpose: O que cada agente precisa do ambiente e o que fazer quando falta.
read: o orchestrator antes de despachar; cada agente só a sua seção
---

# Requisitos

Todos os scripts rodam em `sh` (Git Bash no Windows) com `grep`, `sed`, `awk` e `find`. Nenhum script instala dependência.

## orchestrator

- **Subagentes** para despachar writer, builder, reviewer e researcher. Sem eles, writer e builder podem rodar na própria sessão, em sequência. O reviewer não: peça ao usuário uma sessão separada e entregue só o número do documento.
- **`gh` autenticado** para o `commit.sh` abrir a PR. Sem ele, o script para depois do push e imprime o link para abrir a PR à mão.

## writer

- Nenhum requisito de ambiente. Só lê arquivos do repositório e de `.work/`.

## builder

- **Node 24** com `npm --prefix gallery ci`, para o `build.sh` (o script instala se faltar).
- **Chrome ou Edge** instalado, para o `build.sh` paginar e para o `pdf.sh`. O script procura nos caminhos padrão e aceita `BROWSER=/caminho/do/navegador`. Sem nenhum dos dois, entregue só o HTML e registre a falta no `log.md`; o documento não está concluído.
- **Plus Jakarta Sans** instalada, para o PDF sair com a fonte da identidade. Sem ela, o PDF usa a fonte de reserva: registre no `log.md`.

## reviewer

- **Contexto separado** de quem escreveu ou montou.
- **Navegador** que o harness consiga abrir e capturar (navegador embutido, extensão ou headless). Sem navegador, a revisão visual não acontece: registre a limitação e não declare o documento verificado.

## researcher

- **Acesso à internet** quando a spec permitir pesquisa externa.
- **Relatórios por período:** `make vault` com o Infisical CLI e sessão ativa (`infisical login`, feito pelo usuário), para ler `DATABRICKS_SYNC_URL` e `DATABRICKS_SYNC_API_TOKEN` do `.env`.
- **graphify** (opcional): só para fontes grandes de um documento (vários PDFs, planilhas, um repositório inteiro). O grafo fica em `.work/NNN/sources/graph/`, ignorado. Não use para ler as instruções do repositório: o `index.sh` faz isso sem custo.
