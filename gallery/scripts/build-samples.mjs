// Monta as amostras de samples/ como HTML autocontido em public/samples/: CSS e logo embutidos, gráficos em SVG.
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { renderCharts } from "../charts/render.mjs";

const root = new URL("../../", import.meta.url);
const output = new URL("../public/samples/", import.meta.url);
const css = await readFile(new URL("design/document.css", root), "utf8");
const logo = await readFile(new URL("design/logos/elos.svg", root), "utf8");
// Só na prévia: a galeria carrega a Plus Jakarta Sans. Os documentos entregues não dependem de rede.
const font =
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap">';
const logoUri = `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;

await mkdir(output, { recursive: true });
for (const file of (await readdir(new URL("samples/", root))).filter((name) => name.endsWith(".html"))) {
  const source = await readFile(new URL(`samples/${file}`, root), "utf8");
  const inlined = source
    .replace('<link rel="stylesheet" href="../design/document.css">', `<style>\n${css}</style>`)
    .replaceAll('src="../design/logos/elos.svg"', `src="${logoUri}"`)
    .replace("</head>", `${font}
</head>`);
  if (/href="\.\.\/|src="\.\.\//.test(inlined)) throw new Error(`${file}: caminho relativo não embutido`);
  const { html, count } = renderCharts(inlined);
  await writeFile(new URL(file, output), html);
  console.log(`samples/${file} (${count} gráficos)`);
}
