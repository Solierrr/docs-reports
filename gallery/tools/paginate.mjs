// Transforma o HTML corrido que o agente escreve num documento paginado, autocontido e sem script:
// embute o CSS e o logo, desenha os gráficos, monta o sumário, pagina com o Paged.js num Chrome ou Edge headless
// e salva as folhas já prontas. O PDF sai desse arquivo.
// Uso: node gallery/tools/paginate.mjs <source.html> <index.html>
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { evaluate, waitFor, withPage } from "./browser.mjs";
import { renderCharts } from "../charts/render.mjs";

const root = new URL("../../", import.meta.url);
const modules = new URL("../node_modules/", import.meta.url);

// Numera os capítulos, preenche o <nav class="toc"></nav> e o número das aberturas (.opener e .band),
// e cria a folha divisória dos capítulos marcados com data-opener="divider".
function contents(html) {
  const entries = [];
  const numbered = html.replace(/<section class="chapter((?: [\w-]+)*)"([^>]*)>/g, (tag, variant, attributes) => {
    const id = attributes.match(/\bid="([^"]+)"/)?.[1];
    const title = attributes.match(/\bdata-title="([^"]+)"/)?.[1];
    if (!id || !title) return tag;
    const summary = attributes.match(/\bdata-summary="([^"]+)"/)?.[1] ?? "";
    const number = String(entries.length + 1).padStart(2, "0");
    entries.push({ id, title, summary, number });
    const divider = /\bdata-opener="divider"/.test(attributes)
      ? `<section class="divider brand page"><span class="num">${number}</span><h2 class="title">${title}</h2>${summary ? `<p class="lead">${summary}</p>` : ""}</section>\n`
      : "";
    return `${divider}<section class="chapter${variant}"${attributes} data-label="${number} · ${title}">`;
  });
  const items = entries
    .map(
      ({ id, title, summary, number }) =>
        `<a href="#${id}"><span class="n">${number}</span><span class="t">${title}${summary ? `<small>${summary}</small>` : ""}</span></a>`,
    )
    .join("\n      ");
  const withNumbers = numbered
    .split(/(?=<section class="chapter[ "])/)
    .map((part) => {
      const label = part.match(/^<section class="chapter[^>]*data-label="(\d+) · /)?.[1];
      return label ? part.replace('<span class="num"></span>', `<span class="num">${label}</span>`) : part;
    })
    .join("");
  // Passos, pontos-chave e referências numerados aqui: contadores de CSS não sobrevivem à fragmentação do Paged.js.
  const withSteps = withNumbers.replace(/<ol class="(?:steps|keys|refs)\b[^"]*">[\s\S]*?<\/ol>/g, (list) => {
    let step = 0;
    return list.replace(/<li\b(?![^>]*data-step)/g, () => `<li data-step="${++step}"`);
  });
  // Cada etapa da barra de progresso ganha o padrão da sua posição (liso, listras, pontos, listras cruzadas).
  const order = ["solid", "stripes", "dots", "cross"];
  const withProgress = withSteps.replace(/<div class="progress"[^>]*>[\s\S]*?<\/div>/g, (bar) => {
    let index = 0;
    return bar.replace(/<span\b(?![^>]*data-pattern)/g, () => `<span data-pattern="${order[index++ % order.length]}"`);
  });
  // A trilha numera os seus passos do mesmo jeito.
  const withTrail = withProgress.replace(/<div class="trail\b[^"]*">[\s\S]*?<\/ol>/g, (trail) => {
    let step = 0;
    return trail.replace(/<li\b(?![^>]*data-step)/g, () => `<li data-step="${++step}"`);
  });
  // O título do tema entra na primeira pergunta, que não quebra: assim ele nunca fica sozinho no pé da folha.
  // O Paged.js parte um título com float mesmo com break-inside: avoid e deixa o filete do tema para trás.
  const withFaq = withTrail.replace(
    /(<section class="faq"[^>]*>\s*)(<h2>[\s\S]*?<\/h2>)(\s*<dl>\s*)<div>/g,
    (_, open, title, list) => `${open}${list}<div class="first">${title}`,
  );
  return withFaq.replace(/<nav class="toc">\s*<\/nav>/, () => `<nav class="toc">\n      ${items}\n    </nav>`);
}

// Só na prévia da galeria: a Plus Jakarta Sans embutida, para paginar e mostrar com a fonte da marca.
async function embeddedFont() {
  const faces = await Promise.all(
    [500, 600, 700, 800].map(async (weight) => {
      const file = await readFile(
        new URL(`@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-${weight}-normal.woff2`, modules),
      );
      return `@font-face{font-family:"Plus Jakarta Sans";font-weight:${weight};font-style:normal;src:url(data:font/woff2;base64,${file.toString("base64")}) format("woff2")}`;
    }),
  );
  return `<style>${faces.join("")}</style>`;
}

export async function inline(source, { previewFont = false } = {}) {
  const css = await readFile(new URL("design/document.css", root), "utf8");
  const logo = await readFile(new URL("design/logos/elos.svg", root), "utf8");
  const logoUri = `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;
  let html = source
    .replace(/<link rel="stylesheet" href="(?:(?:\.\.\/)+design\/)?document\.css">/, () => `<style>\n${css}</style>`)
    .replace(/src="(?:(?:\.\.\/)+design\/)?logos\/elos\.svg"/g, `src="${logoUri}"`);
  if (/(?:href|src)="(?:\.\.\/)+design\//.test(html)) throw new Error("caminho para design/ não embutido");
  if (previewFont) {
    const font = await embeddedFont();
    html = html.replace("</head>", () => `${font}\n</head>`);
  }
  return renderCharts(contents(html)).html;
}

// Roda dentro do navegador depois da paginação: páginas reais no sumário e texto das margens.
function finish() {
  const pages = [...document.querySelectorAll(".pagedjs_page")];
  const title = document.querySelector(".cover .title, .dochead .title")?.textContent.trim() || document.title;
  const pageOf = (element) => pages.indexOf(element?.closest(".pagedjs_page")) + 1;
  const write = (page, box, text) => {
    const target = page.querySelector(`.pagedjs_margin-${box} .pagedjs_margin-content`);
    if (target) target.textContent = text;
  };
  let chapter = "";
  pages.forEach((page, index) => {
    const start = page.querySelector(".chapter[data-label]:not([data-split-from])");
    if (start) chapter = start.dataset.label;
    // A faixa de abertura ocupa o alto da folha: ela já diz o capítulo, então o cabeçalho sai.
    const banded = Boolean(page.querySelector(".band"));
    write(page, "top-left", banded ? "" : chapter);
    write(page, "top-right", banded ? "" : `${index + 1} de ${pages.length}`);
    // Coluna lateral dos capítulos .strip, desenhada em cada folha deles.
    if (page.classList.contains("pagedjs_strip_page") && chapter) {
      const [number, name] = chapter.split(" · ");
      const sheet = page.querySelector(".pagedjs_sheet");
      sheet.style.position = "relative";
      sheet.insertAdjacentHTML("beforeend", `<div class="side-strip brand narrow fade"><span class="n">${number}</span><span class="v">${name}</span></div>`);
    }
    write(page, "bottom-left", title);
    write(page, "bottom-right", String(index + 1));
  });
  for (const link of document.querySelectorAll('.toc a[href^="#"]')) {
    const number = pageOf(document.getElementById(link.getAttribute("href").slice(1)));
    if (number > 0) link.insertAdjacentHTML("beforeend", `<span class="p">${number}</span>`);
  }
  document.documentElement.setAttribute("data-paged", "done");
}

const watch = [
  'window.onerror = (message) => document.documentElement.setAttribute("data-error", message);',
  'window.addEventListener("unhandledrejection", (event) => document.documentElement.setAttribute("data-error", String(event.reason)));',
].join("\n");

export async function paginate(source, options = {}) {
  const polyfill = await readFile(new URL("pagedjs/dist/paged.polyfill.min.js", modules), "utf8");
  const config = `window.PagedConfig = { auto: true, after: ${finish.toString()} };`;
  const ready = (await inline(source, options)).replace(
    "</head>",
    () => `<script>\n${watch}\n${config}\n</script>\n<script>${polyfill}</script>\n</head>`,
  );
  const folder = await mkdtemp(join(tmpdir(), "paginate-"));
  try {
    const page = join(folder, "page.html");
    await writeFile(page, ready);
    const [dom, pages] = await withPage(pathToFileURL(page).href, async (send) => {
      const status = await waitFor(
        send,
        'document.documentElement.getAttribute("data-paged") || (document.documentElement.getAttribute("data-error") && "error")',
      );
      if (status !== "done") {
        throw new Error(`o Paged.js falhou: ${await evaluate(send, 'document.documentElement.getAttribute("data-error")')}`);
      }
      return evaluate(send, '[document.documentElement.outerHTML, document.querySelectorAll(".pagedjs_page").length]');
    });
    // Tira os scripts antes de tudo: o texto do polyfill também contém "</head>".
    const frozen = dom.replace(/<script\b[\s\S]*?<\/script>/g, "").replace(' data-paged="done"', "");
    const screen = await readFile(new URL("design/screen.css", root), "utf8");
    const html = `<!doctype html>\n${frozen.replace("</head>", () => `<style>\n${screen}</style>\n</head>`)}`;
    return { html, pages };
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [source, target] = process.argv.slice(2);
  if (!source || !target) {
    console.error("uso: node gallery/tools/paginate.mjs <source.html> <index.html>");
    process.exit(1);
  }
  const { html, pages } = await paginate(await readFile(source, "utf8"));
  await writeFile(target, html);
  console.log(`${target} (${pages} páginas)`);
}
