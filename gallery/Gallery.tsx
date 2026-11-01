import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Surface, ToolbarAction } from "@solaria.network/web-lib";
import {
  GalleryShell,
  useGallery,
  type GalleryLocale,
  type GallerySection,
} from "@solaria.network/web-lib/gallery";
import {
  IconBook,
  IconComponents,
  IconFileAnalytics,
  IconFileText,
  IconHelpCircle,
  type TablerIcon,
} from "@tabler/icons-react";

type Locale = GalleryLocale;

interface Sample {
  id: string;
  icon: TablerIcon;
  names: Record<Locale, string>;
}

// Item do menu e do leitor: um modelo ou um documento versionado.
interface Entry {
  id: string;
  icon: TablerIcon;
  name: string;
  detail?: string;
  url: string;
  pdf?: string;
}

// Documentos de documents/NNN/, listados por scripts/build-samples.mjs em public/documents.json.
interface Published {
  number: string;
  title: string;
  type: string;
  pdf: boolean;
}

// Ícone e nome de cada tipo de documento, e os textos do menu e do leitor que só valem para eles.
const types: Record<string, { icon: TablerIcon; names: Record<Locale, string> }> = {
  report: { icon: IconFileAnalytics, names: { "pt-BR": "Relatório", "en-US": "Report", "es-ES": "Informe" } },
  manual: { icon: IconBook, names: { "pt-BR": "Manual", "en-US": "Manual", "es-ES": "Manual" } },
  faq: { icon: IconHelpCircle, names: { "pt-BR": "Perguntas frequentes", "en-US": "FAQ", "es-ES": "Preguntas frecuentes" } },
  document: { icon: IconFileText, names: { "pt-BR": "Documento", "en-US": "Document", "es-ES": "Documento" } },
};
const locales: Locale[] = ["pt-BR", "en-US", "es-ES"];
const sections: Record<"templates" | "documents" | "download", Record<Locale, string>> = {
  templates: { "pt-BR": "Modelos", "en-US": "Templates", "es-ES": "Plantillas" },
  documents: { "pt-BR": "Documentos", "en-US": "Documents", "es-ES": "Documentos" },
  download: { "pt-BR": "Baixar o PDF", "en-US": "Download the PDF", "es-ES": "Descargar el PDF" },
};

// Modelos de templates/ e o catálogo de componentes, paginados por scripts/build-samples.mjs.
const samples: Sample[] = [
  {
    id: "report",
    icon: IconFileAnalytics,
    names: { "pt-BR": "Relatório gerencial", "en-US": "Management report", "es-ES": "Informe de gestión" },
  },
  {
    id: "manual",
    icon: IconBook,
    names: { "pt-BR": "Manual de uso", "en-US": "User manual", "es-ES": "Manual de uso" },
  },
  {
    id: "faq",
    icon: IconHelpCircle,
    names: { "pt-BR": "Perguntas frequentes", "en-US": "FAQ", "es-ES": "Preguntas frecuentes" },
  },
  {
    id: "document",
    icon: IconFileText,
    names: { "pt-BR": "Documento curto", "en-US": "Short document", "es-ES": "Documento breve" },
  },
  {
    id: "components",
    icon: IconComponents,
    names: { "pt-BR": "Componentes", "en-US": "Components", "es-ES": "Componentes" },
  },
];

interface Labels {
  samples: string;
  preview: string;
  open: string;
  previous: string;
  next: string;
  zoomIn: string;
  zoomOut: string;
  fit: string;
  page: string;
  note: string;
}

const labels: Record<Locale, Labels> = {
  "pt-BR": {
    samples: "Documentos de exemplo",
    preview: "Visualizador do documento",
    open: "Abrir em uma nova aba",
    previous: "Página anterior",
    next: "Próxima página",
    zoomIn: "Aproximar",
    zoomOut: "Afastar",
    fit: "Ajustar à largura",
    page: "Página",
    note: "Os documentos são escritos em português.",
  },
  "en-US": {
    samples: "Sample documents",
    preview: "Document viewer",
    open: "Open in a new tab",
    previous: "Previous page",
    next: "Next page",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    fit: "Fit to width",
    page: "Page",
    note: "The documents are written in Portuguese.",
  },
  "es-ES": {
    samples: "Documentos de ejemplo",
    preview: "Visor del documento",
    open: "Abrir en una pestaña nueva",
    previous: "Página anterior",
    next: "Página siguiente",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    fit: "Ajustar al ancho",
    page: "Página",
    note: "Los documentos están escritos en portugués.",
  },
};

// Largura de uma folha A4 a 96 dpi e o respiro lateral do leitor.
const pageWidth = 794;
const gutter = 64;
const zoomSteps = [0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2];

// Leitor no estilo de um visualizador de PDF: o próprio documento desenha as folhas sobre fundo cinza;
// a galeria só controla zoom e página pelo DOM do iframe, que é da mesma origem.
function DocumentViewer({ sample, locale }: Readonly<{ sample: Pick<Entry, "id" | "name" | "url" | "pdf">; locale: Locale }>) {
  const text = labels[locale];
  const frame = useRef<HTMLIFrameElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number | null>(null);
  const [fitZoom, setFitZoom] = useState(1);
  const [pages, setPages] = useState(0);
  const [current, setCurrent] = useState(1);
  const url = sample.url;
  const scale = zoom ?? fitZoom;

  useLayoutEffect(() => {
    const element = area.current;
    if (!element) return;
    const measure = () =>
      setFitZoom(Math.min(1, Math.max(0.3, (element.clientWidth - gutter) / pageWidth)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const sheets = useCallback(
    () => Array.from(frame.current?.contentDocument?.querySelectorAll<HTMLElement>(".pagedjs_page") ?? []),
    [],
  );

  // As medidas de getBoundingClientRect já vêm com o zoom aplicado, na mesma escala da rolagem.
  const track = useCallback(() => {
    const view = frame.current?.contentWindow;
    if (!view) return;
    const index = sheets().findLastIndex((sheet) => sheet.getBoundingClientRect().top <= view.innerHeight / 3);
    setCurrent(Math.max(1, index + 1));
  }, [sheets]);

  useEffect(() => {
    const root = frame.current?.contentDocument?.documentElement;
    if (root) root.style.zoom = String(scale);
    track();
  }, [scale, track, pages]);

  useEffect(() => {
    const view = frame.current?.contentWindow;
    view?.addEventListener("scroll", track, { passive: true });
    return () => view?.removeEventListener("scroll", track);
  }, [track, pages]);

  useEffect(() => {
    setZoom(null);
    setPages(0);
    setCurrent(1);
  }, [sample.id]);

  function go(page: number) {
    const target = sheets()[page - 1];
    const view = frame.current?.contentWindow;
    if (!target || !view) return;
    view.scrollTo({ top: view.scrollY + target.getBoundingClientRect().top - 24 * scale });
    setCurrent(page);
  }

  function step(direction: 1 | -1) {
    const next =
      direction > 0
        ? zoomSteps.find((value) => value > scale + 0.001)
        : zoomSteps.findLast((value) => value < scale - 0.001);
    if (next) setZoom(next);
  }

  return (
    <Surface className="viewer min-h-0" contentClassName="viewer-content">
      <div className="viewer-toolbar">
        <span className="viewer-title">{sample.name}</span>
        <div className="viewer-group" aria-label={text.page}>
          <ToolbarAction icon="chevronLeft" label={text.previous} disabled={current <= 1} onClick={() => go(current - 1)} />
          <span className="viewer-count" aria-live="polite">
            {pages ? `${current} / ${pages}` : "-"}
          </span>
          <ToolbarAction icon="chevronRight" label={text.next} disabled={current >= pages} onClick={() => go(current + 1)} />
        </div>
        <div className="viewer-group">
          <ToolbarAction icon="zoomOut" label={text.zoomOut} disabled={scale <= zoomSteps[0]} onClick={() => step(-1)} />
          <button type="button" className="viewer-zoom" title={text.fit} aria-label={text.fit} onClick={() => setZoom(null)}>
            {Math.round(scale * 100)}%
          </button>
          <ToolbarAction
            icon="zoomIn"
            label={text.zoomIn}
            disabled={scale >= zoomSteps[zoomSteps.length - 1]}
            onClick={() => step(1)}
          />
          {sample.pdf ? (
            <ToolbarAction
              icon="download"
              label={sections.download[locale]}
              onClick={() => {
                const link = document.createElement("a");
                link.href = sample.pdf!;
                link.download = sample.pdf!.split("/").pop()!;
                link.click();
              }}
            />
          ) : null}
          <ToolbarAction icon="externalLink" label={text.open} onClick={() => window.open(url, "_blank", "noopener")} />
        </div>
      </div>
      <div ref={area} className="viewer-area" aria-label={text.preview}>
        <iframe
          key={sample.id}
          ref={frame}
          src={url}
          title={sample.name}
          sandbox="allow-same-origin"
          referrerPolicy="no-referrer"
          onLoad={() => setPages(sheets().length)}
        />
      </div>
    </Surface>
  );
}

export default function Gallery() {
  const [hash, setHash] = useState(location.hash);
  const [published, setPublished] = useState<Published[]>([]);

  useEffect(() => {
    fetch("./documents.json")
      .then((response) => (response.ok ? response.json() : []))
      .then((list: Published[]) => setPublished(list))
      .catch(() => setPublished([]));
  }, []);

  useEffect(() => {
    const changed = () => setHash(location.hash);
    window.addEventListener("hashchange", changed);
    return () => window.removeEventListener("hashchange", changed);
  }, []);

  const templates = samples.map((sample) => ({
    id: sample.id,
    icon: sample.icon,
    names: sample.names,
    url: `./samples/${encodeURIComponent(sample.id)}.html`,
  }));
  const documents = published.map((doc) => ({
    id: doc.number,
    icon: types[doc.type]?.icon ?? IconFileText,
    names: Object.fromEntries(
      locales.map((code) => [code, doc.title]),
    ) as Record<Locale, string>,
    detail: Object.fromEntries(
      locales.map((code) => [code, `${doc.number}, ${types[doc.type]?.names[code] ?? doc.type}`]),
    ) as Record<Locale, string>,
    url: `./documents/${doc.number}.html`,
    pdf: doc.pdf ? `./documents/${doc.number}.pdf` : undefined,
  }));
  const wanted = new URLSearchParams(hash.slice(1)).get("sample");
  const selected = [...templates, ...documents].find((entry) => entry.id === wanted) ?? templates[0];

  const sectionsList: GallerySection[] = [
    { id: "templates", title: sections.templates, items: templates.map((entry) => ({ id: entry.id, label: entry.names, icon: <entry.icon size={20} className="shrink-0" aria-hidden="true" /> })) },
    ...(documents.length
      ? [
          {
            id: "documents",
            title: sections.documents,
            items: documents.map((entry) => ({
              id: entry.id,
              label: entry.names,
              description: entry.detail,
              icon: <entry.icon size={20} className="shrink-0" aria-hidden="true" />,
            })),
          },
        ]
      : []),
  ];

  return (
    <GalleryShell
      title={{
        "pt-BR": "Previews de documentos",
        "en-US": "Document previews",
        "es-ES": "Vistas previas de documentos",
      }}
      repository="docs-reports"
      version={import.meta.env.VITE_VERSION}
      commit={import.meta.env.VITE_COMMIT}
      sections={sectionsList}
      selectedId={selected.id}
      onSelect={(id) => {
        location.hash = new URLSearchParams({ sample: id }).toString();
      }}
    >
      <Viewer entry={selected} />
    </GalleryShell>
  );
}

function Viewer({ entry }: Readonly<{ entry: { id: string; names: Record<Locale, string>; url: string; pdf?: string } }>) {
  const { locale } = useGallery();
  const { i18n } = useTranslation();
  const text = labels[locale];
  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [i18n, locale]);
  return (
    <div className="gallery-workspace">
      {locale === "pt-BR" ? null : <p className="gallery-note">{text.note}</p>}
      <DocumentViewer sample={{ id: entry.id, name: entry.names[locale], url: entry.url, pdf: entry.pdf }} locale={locale} />
    </div>
  );
}
