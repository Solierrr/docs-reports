import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  GitHubIcon,
  GroupAction,
  Icon,
  MenuItem,
  MenuList,
  Surface,
  SurfaceGroup,
  ToolbarAction,
} from "@solaria.network/web-lib";
import {
  IconBook,
  IconComponents,
  IconFileAnalytics,
  IconFileText,
  IconHelpCircle,
  type TablerIcon,
} from "@tabler/icons-react";

const languages = [
  { code: "pt-BR", label: "Português" },
  { code: "en-US", label: "English" },
  { code: "es-ES", label: "Español" },
] as const;
type Locale = (typeof languages)[number]["code"];

interface Sample {
  id: string;
  icon: TablerIcon;
  names: Record<Locale, string>;
}

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
  language: string;
  github: string;
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
    language: "Idioma",
    github: "Repositório no GitHub",
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
    language: "Language",
    github: "GitHub repository",
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
    language: "Idioma",
    github: "Repositorio en GitHub",
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

const actionClass =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-small text-operational-ink transition-colors hover:bg-operational-hover focus-visible:outline-2 focus-visible:outline-operational-ink motion-reduce:transition-none";
const repository = "https://github.com/Solierrr/docs-reports";
// Largura de uma folha A4 a 96 dpi e o respiro lateral do leitor.
const pageWidth = 794;
const gutter = 64;
const zoomSteps = [0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2];

function LanguageSwitcher({
  value,
  onChange,
}: {
  value: Locale;
  onChange: (locale: Locale) => void;
}) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const label = labels[value].language;

  useEffect(() => {
    if (!open) return;
    const root = container.current;
    root?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
    function outside(event: PointerEvent) {
      if (!root?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div ref={container} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-label={label}
        title={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="gallery-languages"
        className="flex h-9 cursor-pointer items-center-safe gap-1 rounded-small px-2 transition-colors hover:bg-operational-hover focus-visible:outline-2 focus-visible:outline-operational-ink disabled:opacity-40"
        onClick={() => setOpen((current) => !current)}
      >
        <Icon name="globe" size={20} />
        <Icon
          name="chevronDown"
          size={20}
          className={`transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <MenuList
          id="gallery-languages"
          role="listbox"
          aria-label={label}
          className="absolute right-0 z-50 mt-1 min-w-40"
          onKeyDown={(event) => {
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
            event.preventDefault();
            const options = Array.from(
              event.currentTarget.querySelectorAll<HTMLElement>(
                '[role="option"]',
              ),
            );
            const current = options.indexOf(
              document.activeElement as HTMLElement,
            );
            options[
              (current + (event.key === "ArrowDown" ? 1 : options.length - 1)) %
                options.length
            ]?.focus();
          }}
        >
          {languages.map((language) => (
            <MenuItem
              key={language.code}
              role="option"
              selected={value === language.code}
              onSelect={() => {
                onChange(language.code);
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              {language.label}
            </MenuItem>
          ))}
        </MenuList>
      )}
    </div>
  );
}

// Leitor no estilo de um visualizador de PDF: o próprio documento desenha as folhas sobre fundo cinza;
// a galeria só controla zoom e página pelo DOM do iframe, que é da mesma origem.
function DocumentViewer({ sample, locale }: { sample: Sample; locale: Locale }) {
  const text = labels[locale];
  const frame = useRef<HTMLIFrameElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number | null>(null);
  const [fitZoom, setFitZoom] = useState(1);
  const [pages, setPages] = useState(0);
  const [current, setCurrent] = useState(1);
  const url = `./samples/${encodeURIComponent(sample.id)}.html`;
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
        <span className="viewer-title">{sample.names[locale]}</span>
        <div className="viewer-group" aria-label={text.page}>
          <ToolbarAction icon="chevronLeft" label={text.previous} disabled={current <= 1} onClick={() => go(current - 1)} />
          <span className="viewer-count" aria-live="polite">
            {pages ? `${current} / ${pages}` : "–"}
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
          <ToolbarAction icon="externalLink" label={text.open} onClick={() => window.open(url, "_blank", "noopener")} />
        </div>
      </div>
      <div ref={area} className="viewer-area" aria-label={text.preview}>
        <iframe
          key={sample.id}
          ref={frame}
          src={url}
          title={sample.names[locale]}
          sandbox="allow-same-origin"
          referrerPolicy="no-referrer"
          onLoad={() => setPages(sheets().length)}
        />
      </div>
    </Surface>
  );
}

export default function Gallery() {
  const { i18n } = useTranslation();
  const [hash, setHash] = useState(location.hash);
  const params = new URLSearchParams(hash.slice(1));
  const locale =
    languages.find((language) => language.code === params.get("locale"))
      ?.code ?? "pt-BR";
  const selected =
    samples.find((sample) => sample.id === params.get("sample")) ?? samples[0];

  useEffect(() => {
    const changed = () => setHash(location.hash);
    window.addEventListener("hashchange", changed);
    return () => window.removeEventListener("hashchange", changed);
  }, []);

  useEffect(() => {
    void i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
  }, [i18n, locale]);

  function navigate(sample: string, language: Locale) {
    location.hash = new URLSearchParams({
      sample,
      locale: language,
    }).toString();
  }

  return (
    <div className="gallery-shell flex h-dvh min-h-0 flex-col bg-operational-shell">
      <header className="navbar-frame z-30 w-full justify-between gap-2 bg-operational-shell!">
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <a
            href={repository}
            aria-label={labels[locale].github}
            title="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            className={actionClass}
          >
            <GitHubIcon size={20} />
          </a>
          <LanguageSwitcher
            value={locale}
            onChange={(language) => navigate(selected.id, language)}
          />
        </div>
      </header>
      <main className="gallery-workspace">
        <nav aria-label={labels[locale].samples} className="flex min-h-0 min-w-0 items-start">
          <SurfaceGroup className="gallery-templates" contentClassName="gallery-template-list scrollbar-none">
            {samples.map((sample) => {
              const Glyph = sample.icon;
              return (
                <GroupAction
                  key={sample.id}
                  label={sample.names[locale]}
                  content={sample.names[locale]}
                  glyph={<Glyph size={20} className="shrink-0" aria-hidden="true" />}
                  active={selected.id === sample.id}
                  onClick={() => navigate(sample.id, locale)}
                />
              );
            })}
            {locale === "pt-BR" ? null : <p className="p-4 text-operational-muted">{labels[locale].note}</p>}
          </SurfaceGroup>
        </nav>
        <DocumentViewer sample={selected} locale={locale} />
      </main>
    </div>
  );
}
