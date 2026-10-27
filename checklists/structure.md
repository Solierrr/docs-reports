---
name: structure
purpose: O que o check.sh verifica sozinho. Referência, não precisa ser percorrido à mão.
read: quando o check.sh apontar uma falha e o motivo não for óbvio
---

# Verificações estruturais (`check.sh`)

| Código | Falha quando |
| --- | --- |
| `html` | `documents/NNN/index.html` não existe. |
| `slot` | Sobra `{{`, `}}` ou `data-slot` no HTML. |
| `lang` | O `<html>` não declara `lang`. |
| `title` | O `<title>` está vazio. |
| `id` | Algum `id` aparece mais de uma vez. |
| `anchor` | Um link `href="#x"` não tem `id="x"` correspondente. |
| `image` | Uma imagem aponta para a rede ou para um arquivo local que não existe; imagens devem estar embutidas. |
| `remote` | Há `<script>`, folha de estilo ou fonte carregada da rede. |
| `alt` | Uma `<img>` não tem `alt`. |
| `meta` | O `checklist.md` não tem o cabeçalho YAML com `title`, `type` e `slug`. |
| `item` | O `checklist.md` não tem nenhum item deste documento. |
| `pdf` | O `NNN.pdf` existe, mas está vazio ou é mais antigo que o HTML. |

O que exige olhos (texto cortado, contraste, organização) fica com o [reviewer](reviewer.md).
