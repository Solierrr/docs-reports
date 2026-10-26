import { mkdir, readFile, writeFile } from "node:fs/promises";

const templates = ["report", "manual", "document"];
const output = new URL("../dist/templates/", import.meta.url);
const scrollbarCss = await readFile(
  new URL(import.meta.resolve("@solaria.network/web-lib/scrollbar.css")),
  "utf8",
);

await mkdir(output, { recursive: true });
await writeFile(new URL("../dist/.nojekyll", import.meta.url), "");

for (const name of templates) {
  const source = await readFile(
    new URL(`../../templates/${name}.html`, import.meta.url),
    "utf8",
  );
  if (/<script\b/i.test(source)) throw new Error(`${name}: scripts are not allowed`);
  if (/\s(?:src|href)="https?:\/\/[^"]*\.(?:css|js)"/i.test(source)) {
    throw new Error(`${name}: remote resources are not allowed`);
  }
  const html = source.replace(
    "</head>",
    `<style data-preview-scrollbar>${scrollbarCss}</style></head>`,
  );
  if (!html.includes("data-preview-scrollbar")) {
    throw new Error(`${name}: missing </head> to inject the preview scrollbar`);
  }
  await writeFile(new URL(`${name}.html`, output), html);
}

console.log(`Gallery: ${templates.length} templates → ${output.pathname}`);
