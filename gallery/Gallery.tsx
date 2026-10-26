import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
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
  IconFileAnalytics,
  IconFileText,
  type TablerIcon,
} from "@tabler/icons-react";

const languages = [
  { code: "pt-BR", label: "Português" },
  { code: "en-US", label: "English" },
  { code: "es-ES", label: "Español" },
] as const;
type Locale = (typeof languages)[number]["code"];

interface Template {
  id: string;
  icon: TablerIcon;
  names: Record<Locale, string>;
}

const templates: Template[] = [
  {
    id: "report",
    icon: IconFileAnalytics,
    names: { "pt-BR": "Relatório", "en-US": "Report", "es-ES": "Informe" },
  },
  {
    id: "manual",
    icon: IconBook,
    names: {
      "pt-BR": "Manual de instrução",
      "en-US": "Instruction manual",
      "es-ES": "Manual de instrucciones",
    },
  },
  {
    id: "document",
    icon: IconFileText,
    names: { "pt-BR": "Documento", "en-US": "Document", "es-ES": "Documento" },
  },
];

const labels: Record<
  Locale,
  { language: string; github: string; templates: string; preview: string; open: string; note: string }
> = {
  "pt-BR": {
    language: "Idioma",
    github: "Repositório no GitHub",
    templates: "Modelos de documentos",
    preview: "Prévia do modelo",
    open: "Abrir o modelo em uma nova aba",
    note: "Os modelos são escritos em português.",
  },
  "en-US": {
    language: "Language",
    github: "GitHub repository",
    templates: "Document templates",
    preview: "Template preview",
    open: "Open the template in a new tab",
    note: "The templates are written in Portuguese.",
  },
  "es-ES": {
    language: "Idioma",
    github: "Repositorio en GitHub",
    templates: "Modelos de documentos",
    preview: "Vista previa del modelo",
    open: "Abrir el modelo en una pestaña nueva",
    note: "Los modelos están escritos en portugués.",
  },
};

const actionClass =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-small text-operational-ink transition-colors hover:bg-operational-hover focus-visible:outline-2 focus-visible:outline-operational-ink motion-reduce:transition-none";
const repository = "https://github.com/Solierrr/docs-reports";
const pageWidth = 794;

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

function DocumentPreview({
  selected,
  locale,
}: {
  selected: Template;
  locale: Locale;
}) {
  const container = useRef<HTMLElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const element = container.current;
    if (!element) return;
    const measure = () =>
      setSize({ width: element.clientWidth, height: element.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const scale = Math.min(1, size.width / pageWidth) || 1;
  const url = `./templates/${encodeURIComponent(selected.id)}.html`;
  return (
    <div className="gallery-preview-layout" style={{ maxWidth: pageWidth + 18 }}>
      <Surface
        className="gallery-preview min-h-0"
        contentClassName="gallery-preview-content"
      >
        <div className="preview-toolbar">
          <ToolbarAction
            icon="externalLink"
            label={labels[locale].open}
            onClick={() => window.open(url, "_blank", "noopener")}
          />
        </div>
        <section
          ref={container}
          aria-label={labels[locale].preview}
          className="frame-area"
        >
          <div
            className="preview-device"
            style={{ width: pageWidth * scale, height: size.height }}
          >
            <iframe
              src={url}
              title={`${selected.names[locale]}`}
              sandbox="allow-same-origin"
              referrerPolicy="no-referrer"
              style={{
                width: pageWidth,
                height: Math.ceil(size.height / scale),
                transform: `scale(${scale})`,
              }}
            />
          </div>
        </section>
      </Surface>
    </div>
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
    templates.find((template) => template.id === params.get("template")) ??
    templates[0];

  useEffect(() => {
    const changed = () => setHash(location.hash);
    window.addEventListener("hashchange", changed);
    return () => window.removeEventListener("hashchange", changed);
  }, []);

  useEffect(() => {
    void i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
  }, [i18n, locale]);

  function navigate(template: string, language: Locale) {
    location.hash = new URLSearchParams({
      template,
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
      <main
        className="gallery-workspace"
        style={
          {
            "--gallery-preview-width": `${pageWidth + 18}px`,
          } as CSSProperties
        }
      >
        <nav
          aria-label={labels[locale].templates}
          className="flex min-h-0 min-w-0 items-start"
        >
          <SurfaceGroup
            className="gallery-templates"
            contentClassName="gallery-template-list scrollbar-none"
          >
            {templates.map((template) => {
              const Glyph = template.icon;
              return (
                <GroupAction
                  key={template.id}
                  label={template.names[locale]}
                  content={template.names[locale]}
                  glyph={
                    <Glyph size={20} className="shrink-0" aria-hidden="true" />
                  }
                  active={selected.id === template.id}
                  onClick={() => navigate(template.id, locale)}
                />
              );
            })}
            <p className="p-4 text-sm text-operational-muted">
              {labels[locale].note}
            </p>
          </SurfaceGroup>
        </nav>
        <DocumentPreview selected={selected} locale={locale} />
      </main>
    </div>
  );
}
