---
name: structure
purpose: O que o check.sh verifica sozinho. Referência, não precisa ser percorrido à mão.
read: quando o check.sh apontar uma falha e o motivo não for óbvio
---

# Verificações estruturais (`check.sh`)

| Código | Falha quando |
| --- | --- |
| `source` | `documents/NNN/source.html` não existe. |
| `example` | Sobrou o selo `<span class="sample">` do modelo. Não vale quando o `checklist.md` declara `sample: true` (documento fictício por decisão do dono). |
| `lang` | O `<html>` não declara `lang`. |
| `title` | O `<title>` está vazio ou ainda é o de um modelo. |
| `id` | Algum `id` aparece mais de uma vez. |
| `anchor` | Um link `href="#x"` não tem `id="x"` correspondente. |
| `image` | Uma imagem aponta para a rede ou para um arquivo que não existe; imagens devem estar embutidas. |
| `remote` | Há `<script>`, folha de estilo ou fonte carregada da rede no `source.html`. |
| `alt` | Uma `<img>` não tem `alt`. |
| `build` | O `index.html` não existe, é mais antigo que o `source.html`, tem script ou não está paginado. |
| `meta` | O `checklist.md` não tem o cabeçalho YAML com `title`, `type` e `slug`. |
| `item` | O `checklist.md` não tem nenhum item deste documento. |
| `pdf` | O `NNN.pdf` existe, mas está vazio ou é mais antigo que o `index.html`. |

O que exige olhos (texto cortado, contraste, organização) fica com o [reviewer](reviewer.md).
