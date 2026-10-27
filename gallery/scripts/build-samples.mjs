// Gera as prévias da galeria em public/samples/: cada modelo de templates/ e o catálogo de componentes passam
// pelo mesmo build dos documentos (gráficos, sumário e paginação), com a fonte da marca embutida só aqui.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { paginate } from "../tools/paginate.mjs";

const root = new URL("../../", import.meta.url);
const output = new URL("../public/samples/", import.meta.url);
const sources = {
  report: "templates/report.html",
  manual: "templates/manual.html",
  faq: "templates/faq.html",
  document: "templates/document.html",
  components: "design/components.html",
};

await mkdir(output, { recursive: true });
for (const [id, path] of Object.entries(sources)) {
  const { html, pages } = await paginate(await readFile(new URL(path, root), "utf8"), { previewFont: true });
  await writeFile(new URL(`${id}.html`, output), html);
  console.log(`samples/${id}.html (${pages} páginas)`);
}
