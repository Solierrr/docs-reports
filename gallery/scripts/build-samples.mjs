// Gera o conteúdo da galeria em public/:
// - samples/: cada modelo de templates/ e o catálogo de componentes, pelo mesmo build dos documentos;
// - documents/: os documentos versionados em documents/NNN/, copiados como foram aprovados (index.html e PDF),
//   com um documents.json que a galeria lê para montar o menu.
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { paginate } from "../tools/paginate.mjs";

const root = new URL("../../", import.meta.url);
const output = new URL("../public/samples/", import.meta.url);
const published = new URL("../public/documents/", import.meta.url);
const sources = {
  report: "templates/report.html",
  manual: "templates/manual.html",
  faq: "templates/faq.html",
  document: "templates/document.html",
  components: "design/components.html",
};

await mkdir(output, { recursive: true });
for (const [id, path] of Object.entries(sources)) {
  const { html, pages } = await paginate(await readFile(new URL(path, root), "utf8"));
  await writeFile(new URL(`${id}.html`, output), html);
  console.log(`samples/${id}.html (${pages} páginas)`);
}

// O cabeçalho YAML do checklist.md tem uma chave por linha, sem aninhamento.
function header(text) {
  const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
  return Object.fromEntries(
    block.split(/\r?\n/).map((line) => {
      const [key, ...rest] = line.split(":");
      return [key.trim(), rest.join(":").trim().replace(/^"(.*)"$/, "$1").replace(/\\"/g, '"')];
    }),
  );
}

await rm(published, { recursive: true, force: true });
await mkdir(published, { recursive: true });
const folder = new URL("documents/", root);
const documents = [];
for (const number of (await readdir(folder)).filter((name) => /^\d{3}$/.test(name)).sort()) {
  const doc = new URL(`${number}/`, folder);
  const files = await readdir(doc);
  if (!files.includes("index.html")) continue;
  const meta = header(await readFile(new URL("checklist.md", doc), "utf8"));
  await copyFile(new URL("index.html", doc), new URL(`${number}.html`, published));
  const pdf = files.includes(`${number}.pdf`);
  if (pdf) await copyFile(new URL(`${number}.pdf`, doc), new URL(`${number}.pdf`, published));
  documents.push({ number, title: meta.title, type: meta.type, created: meta.created, pdf });
  console.log(`documents/${number}.html (${meta.title})`);
}
await writeFile(new URL("../public/documents.json", import.meta.url), `${JSON.stringify(documents, null, 2)}\n`);
