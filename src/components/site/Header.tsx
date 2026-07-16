import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo-vm.png";
import { useLang, useSetLang, useLangLocked, useT, type Lang } from "@/i18n/lang";

const NAV_LABELS: Record<string, { ru: string; en: string }> = {
  "/": { ru: "Главная", en: "Home" },
  "/mission": { ru: "Миссия", en: "Mission" },
  "/azbuka": { ru: "Азбука", en: "ABC" },
  "/letopis": { ru: "Летопись", en: "Chronicle" },
  "/litsa": { ru: "Лица", en: "Faces" },
  "/nasledie": { ru: "Наследие", en: "Legacy" },
  "/puti": { ru: "Пути участия", en: "Paths" },
  "/geografiya": { ru: "География добра", en: "Geography" },
  "/puls": { ru: "Пульс времени", en: "Pulse" },
  "/test": { ru: "Найдите свой путь", en: "Find your path" },
  "/prichastnost": { ru: "Стать причастным", en: "Get involved" },
  "/kod": { ru: "Код мецената", en: "Patron's code" },
};

const NAV = [
  { to: "/" },
  { to: "/mission" },
  { to: "/azbuka" },
  { to: "/letopis" },
  { to: "/litsa" },
  { to: "/nasledie" },
  { to: "/puti" },
  { to: "/geografiya" },
  { to: "/puls" },
  { to: "/test" },
  { to: "/prichastnost" },
  { to: "/kod" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const lang = useLang();
  const setLang = useSetLang();
  const langLocked = useLangLocked();
  const t = useT();
  const label = (to: string) => t(NAV_LABELS[to].ru, NAV_LABELS[to].en);
  const subtitle = t("Летопись благородных дел", "Chronicle of noble deeds");
  const brand = t("Вестник мецената и филантропа", "Patron & Philanthropist Herald");
  const menuLabel = t("Меню", "Menu");
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[oklch(0.985_0.008_90/0.78)] border-b border-gold/30 shadow-[0_2px_24px_-12px_oklch(0.36_0.12_25/0.25)]">
      {/* тонкая золотая линия сверху */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-70" />
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between gap-6 lg:gap-12 h-20 lg:h-24">
        {/* Логотип: в LTR слева, в RTL (ar) справа */}
        <Link to="/" className="flex items-center gap-4 group shrink-0 min-w-0" onClick={() => setOpen(false)}>
          <img src={logo} alt={brand} className="h-12 lg:h-14 w-auto shrink-0" />
          <div className="hidden sm:block leading-tight min-w-0">
            <div className="font-display text-xl lg:text-2xl text-bordo tracking-tight">{brand}</div>
            <div className="flex items-center gap-2 text-[10px] lg:text-[11px] tracking-[0.28em] uppercase text-gold/90">
              <span className="h-px w-4 bg-gold/60 shrink-0" />
              {subtitle}
            </div>
          </div>
        </Link>

        {/* Меню и язык: в LTR справа, в RTL (ar) у левого края — без ml-auto (ломает RTL) */}
        <div className="flex items-center gap-2 shrink-0">
          {!langLocked && <LanguageSwitcher lang={lang} setLang={setLang} compact />}
          <button
            aria-label={menuLabel}
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-2 font-display text-sm tracking-wide text-bordo rounded-md border border-gold/40 bg-cream/60 shadow-[inset_0_1px_0_oklch(1_0_0/0.7),0_2px_6px_-2px_oklch(0.36_0.12_25/0.25)]"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="hidden sm:inline">{menuLabel}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gold/30 bg-gradient-to-b from-ivory to-cream animate-fade-in">
          <nav className="container mx-auto px-4 py-4 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 px-4 font-display text-base text-foreground/80 hover:text-bordo rounded-md border border-gold/30 bg-gradient-to-b from-ivory to-cream shadow-[inset_0_1px_0_oklch(1_0_0/0.7)]"
                activeProps={{ className: "text-bordo font-semibold border-gold/70" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {label(n.to)}
              </Link>
            ))}
          </nav>
        </div>
      )}
      <style>{`
        .nav-active { color: var(--color-bordo); font-weight: 600; }
        .nav-active::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 4px;
          transform: translateX(-50%);
          width: 18px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
        }
      `}</style>
    </header>
  );
}

function LanguageSwitcher({
  lang,
  setLang,
  compact = false,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  compact?: boolean;
}) {
  const OPTIONS: { code: Lang; label: string }[] = [
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
    { code: "zh", label: "中文" },
    { code: "ar", label: "ع" },
  ];
  return (
    <div
      className={`inline-flex items-center rounded-md border border-gold/40 bg-cream/60 shadow-[inset_0_1px_0_oklch(1_0_0/0.7)] overflow-hidden ${compact ? "" : "ms-2"}`}
      role="group"
      aria-label="Language"
    >
      {OPTIONS.map(({ code: l, label }) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-2.5 py-1.5 text-[11px] font-display tracking-[0.18em] uppercase transition-colors ${
            lang === l
              ? "bg-bordo text-cream"
              : "text-bordo hover:bg-gold/15"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
