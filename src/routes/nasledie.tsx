import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import heroNasledie from "@/assets/hero-nasledie.jpg";
import { PageHero } from "@/components/site/PageHero";
import { type LegacyItem } from "@/data/content";
import { useLegacyCategories } from "@/data/content.localized";
import { useT } from "@/i18n/lang";
import { useNasledie } from "@/lib/wp/hooks";
import { focusElementById, getFocusTarget } from "@/lib/focus-target";
import { resolveLegacyImage } from "@/lib/media";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Building2, GraduationCap, HeartPulse, Library, Music, Palette, Microscope, School, Landmark } from "lucide-react";

export const Route = createFileRoute("/nasledie")({
  head: () => ({
    meta: [
      { title: "Наследие меценатов и филантропов — Вестник мецената и филантропа" },
      { name: "description", content: "Институции, которые до сих пор живут благодаря частной щедрости: галереи, больницы, школы, театры." },
      { property: "og:title", content: "Наследие меценатов" },
      { property: "og:description", content: "Что построили частные щедрые руки." },
    ],
  }),
  component: Nasledie,
});

const CAT_ICONS: Record<LegacyItem["category"], React.ComponentType<{ className?: string }>> = {
  galleries: Palette,
  theatres: Music,
  schools: School,
  medicine: HeartPulse,
  museums: Building2,
  universities: GraduationCap,
  libraries: Library,
  science: Microscope,
  other: Landmark,
};

type CatKey = LegacyItem["category"] | "all";

/** Roman numerals → integer (I–XX etc.) */
function romanToInt(roman: string): number {
  const val: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  let prev = 0;
  for (const ch of roman.toUpperCase()) {
    const v = val[ch] ?? 0;
    total += v <= prev ? v : v - 2 * prev;
    prev = v;
  }
  return total;
}

/**
 * Sort key for legacy.year strings (RU / EN / AR / ZH).
 * Supports: "1898", "1898 — 1912", "IX век", "9th century", "9世纪", "القرن التاسع",
 * "ок. 800 — 880", BC markers. Prefer 4-digit years over century labels when both present.
 * BC years are negative. Unparsable → large positive (sort last).
 */
function foundedYearSortKey(year: string): number {
  const s = year.trim();
  const isBC =
    /до н\.?\s*э\.|BC|BCE|ق\.?\s*م\.?|قبل الميلاد|公元前/i.test(s);

  const centuryApprox = (century: number) => {
    if (century <= 0) return 100_000;
    const approx = (century - 1) * 100 + 1;
    return isBC ? -approx : approx;
  };

  // Arabic decade + century: "ثمانينيات القرن 19 — 1897" → 1880
  // (must run before bare 4-digit match so the end year 1897 does not win)
  const arDec = s.match(
    /(عشري|عشرين|ثلاثيني|أربعيني|خمسيني|ستيني|سبعيني|ثمانيني|تسعيني)ات[\s\S]*?القرن\s*(\d{1,2}|العشرين|التاسع عشر)/,
  );
  if (arDec) {
    const decadeMap: Record<string, number> = {
      عشري: 0,
      عشرين: 20,
      ثلاثيني: 30,
      أربعيني: 40,
      خمسيني: 50,
      ستيني: 60,
      سبعيني: 70,
      ثمانيني: 80,
      تسعيني: 90,
    };
    const d = decadeMap[arDec[1]] ?? 0;
    let cent = 19;
    if (/العشرين/.test(arDec[2])) cent = 20;
    else if (/التاسع عشر/.test(arDec[2])) cent = 19;
    else cent = parseInt(arDec[2], 10) || 19;
    return (cent - 1) * 100 + d;
  }

  // Prefer first explicit calendar year (3–4 digits)
  // e.g. "1880-е — 1897", "أربعينيات 1540 — 1548", "1540s — 1548" → 1540
  const y4 = s.match(/\d{4}/);
  if (y4) {
    const n = parseInt(y4[0], 10);
    return isBC ? -n : n;
  }

  const y3 = s.match(/\b\d{3}\b/);
  if (y3 && !/قرن|век|century|世纪/i.test(s)) {
    const n = parseInt(y3[0], 10);
    return isBC ? -n : n;
  }

  // Chinese century: "9世纪", "15世纪", "18世纪末"
  const zhCentEnd = s.match(/(\d{1,2})\s*世纪末/);
  if (zhCentEnd) {
    // end of century ≈ C*100 (e.g. 18世纪末 → 1800)
    const c = parseInt(zhCentEnd[1], 10);
    return isBC ? -(c * 100) : c * 100;
  }
  const zhCent = s.match(/(\d{1,2})\s*世纪/);
  if (zhCent) return centuryApprox(parseInt(zhCent[1], 10));

  // Arabic: "القرن التاسع", "القرن الخامس عشر", …
  if (/القرن/.test(s)) {
    const AR_CENT: [string, number][] = [
      ["الحادي والعشرين", 21],
      ["العشرين", 20],
      ["التاسع عشر", 19],
      ["الثامن عشر", 18],
      ["السابع عشر", 17],
      ["السادس عشر", 16],
      ["الخامس عشر", 15],
      ["الرابع عشر", 14],
      ["الثالث عشر", 13],
      ["الثاني عشر", 12],
      ["الحادي عشر", 11],
      ["العاشر", 10],
      ["التاسع", 9],
      ["الثامن", 8],
      ["السابع", 7],
      ["السادس", 6],
      ["الخامس", 5],
      ["الرابع", 4],
      ["الثالث", 3],
      ["الثاني", 2],
      ["الأول", 1],
    ];
    for (const [word, c] of AR_CENT) {
      if (s.includes(word)) return centuryApprox(c);
    }
    // "القرن 19" with digits
    const arNum = s.match(/القرن\s*(\d{1,2})/);
    if (arNum) return centuryApprox(parseInt(arNum[1], 10));
  }

  // Roman century: "IX век", "XVIII в.", "IX century"
  const romCent = s.match(/\b([IVXLCDM]+)\s*(?:век|в\.|century)/i);
  if (romCent) {
    const century = romanToInt(romCent[1]);
    if (century > 0) return centuryApprox(century);
  }

  // Numeric century: "19 век", "9th century"
  const numCent = s.match(
    /\b(\d{1,2})\s*(?:-?(?:й|ый|е|st|nd|rd|th))?\s*(?:век|в\.|century)/i,
  );
  if (numCent) return centuryApprox(parseInt(numCent[1], 10));

  // Fallback: any number
  const m = s.match(/\d{1,4}/);
  if (!m) return 100_000;
  const n = parseInt(m[0], 10);
  return isBC ? -n : n;
}

/**
 * Compact numeric label for cards/modals (as elsewhere on the site).
 * Always a year number; for BC appends «до н. э.» / «BC». Never 9999.
 */
function foundedYearLabel(year: string, t: (ru: string, en: string) => string): string {
  const key = foundedYearSortKey(year);
  // Unparsable — show original text rather than a fake year
  if (key >= 100_000) return year;

  if (key < 0) {
    return `${Math.abs(key)} ${t("до н. э.", "BC")}`;
  }
  return String(key);
}

function Nasledie() {
  const t = useT();
  const LEGACY_CATEGORIES = useLegacyCategories();
  const [cat, setCat] = useState<CatKey>("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const { items: LEGACY } = useNasledie();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (LEGACY.length === 0) return;
    const slug = getFocusTarget("legacy-");
    if (!slug) return;
    return focusElementById(`legacy-${slug}`);
  }, [LEGACY.length]);

  const sorted = useMemo(
    () => [...LEGACY].sort((a, b) => foundedYearSortKey(a.year) - foundedYearSortKey(b.year)),
    [LEGACY],
  );

  const items = useMemo(
    () => (cat === "all" ? sorted : sorted.filter((i) => i.category === cat)),
    [cat, sorted],
  );

  const catKeys = Object.keys(LEGACY_CATEGORIES) as Array<LegacyItem["category"]>;
  const openItem = LEGACY.find((i) => i.slug === openSlug) ?? null;
  const OpenIcon = openItem ? CAT_ICONS[openItem.category] : null;

  return (
    <SiteLayout>
      <PageHero image={heroNasledie}
        eyebrow={t("Наследие", "Legacy")}
        title={t("Дела, живущие в веках", "Deeds that live through the ages")}
        intro={t(
          "Меценатство измеряется не суммами, а долговечностью того, что после него остаётся. Эти институции пережили империи, революции и войны — потому что были задуманы как дар не одному поколению, а многим.",
          "Patronage is measured not in sums but in the durability of what it leaves behind. These institutions outlived empires, revolutions and wars — because they were conceived as a gift not to one generation, but to many."
        )}
      />

      <section className="paper-bg">
        <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
          <div className="flex flex-wrap gap-2 mb-12">
            <button
              onClick={() => setCat("all")}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border transition-colors ${
                cat === "all" ? "bg-bordo text-cream border-bordo" : "border-border/70 text-foreground/70 hover:border-gold hover:text-bordo"
              }`}
            >
              {t("Все рубрики", "All categories")} · {LEGACY.length}
            </button>
            {catKeys.map((k) => {
              const count = LEGACY.filter((i) => i.category === k).length;
              if (count === 0) return null;
              return (
                <button
                  key={k}
                  onClick={() => setCat(k)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border transition-colors ${
                    cat === k ? "bg-bordo text-cream border-bordo" : "border-border/70 text-foreground/70 hover:border-gold hover:text-bordo"
                  }`}
                >
                  {LEGACY_CATEGORIES[k].label} · {count}
                </button>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((it) => {
              const Icon = CAT_ICONS[it.category];
              const catLabel = LEGACY_CATEGORIES[it.category].label;
              return (
                <button
                  type="button"
                  key={it.slug}
                  id={`legacy-${it.slug}`}
                  onClick={() => setOpenSlug(it.slug)}
                  className="group bg-card border border-border/60 rounded-sm overflow-hidden hover:border-gold/60 hover:shadow-[0_20px_60px_-20px_oklch(0.18_0.05_25/0.35)] transition-all flex flex-col text-left h-full"
                >
                  <div className="aspect-[16/9] relative overflow-hidden flex-shrink-0" style={{ background: it.imageHue }}>
                    {it.image ? (
                      <img
                        src={resolveLegacyImage(it.image)}
                        alt={it.title}
                        loading="eager"
                        decoding="async"
                        className={`w-full h-full ${it.imageFit === "contain" ? "object-contain" : "object-cover"}`}
                        style={{ objectPosition: it.imagePosition ?? "center top" }}
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          img.style.display = 'none';
                          const fb = img.parentElement?.querySelector('[data-fb]') as HTMLElement | null;
                          if (fb) fb.style.display = 'grid';
                        }}
                      />
                    ) : null}

                    <div className="grain absolute inset-0 opacity-30" />

                    <div data-fb className="absolute inset-0 place-items-center hidden" style={{ display: it.image ? 'none' : 'grid' }}>
                      {Icon && <Icon className="h-12 w-12 text-gold/90" />}
                    </div>

                    <div className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.22em] text-cream/90 bg-black/35 px-2 py-1 backdrop-blur-sm">
                      {catLabel}
                    </div>
                    <div className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.22em] text-gold bg-black/35 px-2 py-1 backdrop-blur-sm">
                      {foundedYearLabel(it.year, t)}
                    </div>
                  </div>

                  <div className="p-7 flex-1 flex flex-col">
                    <h3 className="font-display text-2xl text-bordo">{it.title}</h3>
                    <div className="text-xs text-muted-foreground mt-1">{it.city} · {it.patron}</div>
                    <div className="gold-divider my-4 w-10" />
                    <p className="text-sm text-foreground/85 leading-relaxed">{it.short}</p>
                    <span className="mt-5 text-[11px] uppercase tracking-[0.22em] text-bordo group-hover:text-gold transition-colors">
                      {t("Узнать больше", "Read more")} →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-20 max-w-3xl mx-auto text-center">
            <div className="font-display text-2xl md:text-3xl text-foreground italic">
              {t("«Что отдано — то твоё. Что оставлено — пропало».", "“What is given is yours. What is kept is lost.”")}
            </div>
            <div className="text-xs tracking-widest uppercase text-gold mt-3">{t("Шота Руставели", "Shota Rustaveli")}</div>
          </div>
        </div>
      </section>

      <Dialog open={!!openItem} onOpenChange={(o) => !o && setOpenSlug(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 bg-cream border-gold/40">
          {openItem && (
            <div className="paper-bg">
              <DialogTitle className="sr-only">{openItem.title}</DialogTitle>
              <DialogDescription className="sr-only">
                {t("Подробная карточка объекта наследия с историей, ключевыми вехами и справкой.", "Detailed legacy card with history, key milestones and reference data.")}
              </DialogDescription>
              <div className="bg-bordo text-cream p-8 md:p-10 grid md:grid-cols-[320px_1fr] gap-8">
                <div>
                <div className="aspect-[4/3] relative rounded-sm overflow-hidden border-2 border-gold/50" style={{ background: openItem.imageHue }}>
                  {openItem.image ? (
                    <img
                      src={resolveLegacyImage(openItem.image)}
                      alt={openItem.title}
                      className={`w-full h-full ${openItem.imageFit === "contain" ? "object-contain" : "object-cover"}`}
                      style={{ objectPosition: openItem.imagePosition ?? "center top" }}
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.style.display = 'none';
                        const fb = img.parentElement?.querySelector('[data-mfb]') as HTMLElement | null;
                        if (fb) fb.style.display = 'grid';
                      }}
                    />
                  ) : null}
                  <div data-mfb className="absolute inset-0 place-items-center" style={{ display: openItem.image ? 'none' : 'grid' }}>
                    {OpenIcon ? <OpenIcon className="h-16 w-16 text-gold/90" /> : null}
                  </div>
                </div>
                {openItem.imageCredit && (
                  <p className="mt-2 text-[10px] leading-snug text-cream/55 italic">{openItem.imageCredit}</p>
                )}
                </div>
                <div>
                  <div className="text-[11px] tracking-[0.3em] uppercase text-gold">
                    {LEGACY_CATEGORIES[openItem.category].label} · {foundedYearLabel(openItem.year, t)}
                  </div>
                  <h2 className="mt-2 font-display text-4xl md:text-5xl">{openItem.title}</h2>
                  <div className="mt-3 text-cream/80 text-sm">
                    {openItem.city} · {t("меценат", "patron")}: {openItem.patron}
                  </div>
                  <p className="mt-5 text-cream/90 text-base leading-relaxed">{openItem.short}</p>
                  {openItem.address && (
                    <p className="mt-4 text-xs text-gold/90 italic">{openItem.address}</p>
                  )}
                </div>
              </div>

              <div className="p-8 md:p-10 grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">{t("История", "History")}</div>
                  <h3 className="font-display text-2xl text-bordo">{t("Полный рассказ", "Full story")}</h3>
                  <div className="gold-divider my-4 w-12" />
                  <p className="text-foreground/85 leading-relaxed whitespace-pre-line">{openItem.full}</p>
                </div>
                <aside className="space-y-6">
                  {openItem.details && openItem.details.length > 0 && (
                    <div className="bg-gradient-to-br from-[oklch(0.96_0.02_82)] to-[oklch(0.92_0.04_80)] border border-gold/40 p-6 rounded-sm">
                      <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">{t("Ключевые вехи", "Key milestones")}</div>
                      <ul className="space-y-2 mt-3">
                        {openItem.details.map((d) => (
                          <li key={d} className="text-sm text-foreground/85 border-l-2 border-gold pl-3">{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="bg-card border border-border/60 p-6 rounded-sm">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">{t("Карточка", "Card")}</div>
                    <dl className="text-sm space-y-2">
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">{t("Год", "Year")}</dt>
                        <dd className="text-foreground/85 text-right">{foundedYearLabel(openItem.year, t)}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">{t("Город", "City")}</dt>
                        <dd className="text-foreground/85 text-right">{openItem.city}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">{t("Меценат", "Patron")}</dt>
                        <dd className="text-foreground/85 text-right">{openItem.patron}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">{t("Рубрика", "Category")}</dt>
                        <dd className="text-foreground/85 text-right">{LEGACY_CATEGORIES[openItem.category].label}</dd>
                      </div>
                    </dl>
                  </div>
                </aside>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}
