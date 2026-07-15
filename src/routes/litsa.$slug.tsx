import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PERSONS as STATIC_PERSONS } from "@/data/content";
import { useLitsa } from "@/lib/wp/hooks";
import { useT } from "@/i18n/lang";
import { ArrowLeft, Award, MapPin, Sparkles, Medal } from "lucide-react";
import { resolvePortrait } from "@/lib/media";

const INITIAL_BG = ["#5B1A1F", "#3d1419", "#7a4f1c", "#2c4a3d", "#43344f", "#5b3a1f", "#1f3b4a", "#4a1f2c"];

export const Route = createFileRoute("/litsa/$slug")({
  head: ({ params }) => {
    // head() выполняется до загрузки WP — используем статический fallback для SEO
    const p = STATIC_PERSONS.find((x) => x.slug === params.slug);
    return {
      meta: [
        { title: `${p?.name ?? "Лицо щедрости"} — Вестник мецената и филантропа` },
        { name: "description", content: p?.short ?? "Биография мецената." },
      ],
    };
  },
  component: PersonDetail,
});

function PersonDetail() {
  const t = useT();
  const { slug } = Route.useParams();
  const { items: PERSONS } = useLitsa();
  const idx = PERSONS.findIndex((p) => p.slug === slug);
  const p = PERSONS[idx];
  if (!p) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="font-display text-4xl text-bordo">{t("Лицо не найдено", "Person not found")}</h1>
          <Link to="/litsa" className="mt-6 inline-block text-gold underline">{t("К галерее", "To gallery")}</Link>
        </div>
      </SiteLayout>
    );
  }
  const bg = INITIAL_BG[idx % INITIAL_BG.length];
  const initials = p.name.split(" ").map((w) => w[0]).slice(0, 2).join("");

  return (
    <SiteLayout>
      <section className="relative bg-bordo text-cream overflow-hidden">
        <div className="grain absolute inset-0 opacity-20" />
        <div className="container mx-auto px-4 lg:px-8 pt-28 pb-20 grid md:grid-cols-[1fr_1.4fr] gap-10 items-center relative">
          <div className="max-w-sm w-full mx-auto md:mx-0">
            <div className="aspect-[4/5] relative rounded-sm overflow-hidden border-2 border-gold/50 shadow-[0_30px_60px_-20px_oklch(0_0_0/0.6)]" style={{ background: bg }}>
              {p.portrait ? (
                <img
                  src={resolvePortrait(p.portrait)}
                  alt={t(`Портрет: ${p.name}`, `Portrait: ${p.name}`)}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ filter: "sepia(0.15) saturate(0.95) contrast(1.04)" }}
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.style.display = 'none';
                    const fb = img.parentElement?.querySelector('[data-fallback]') as HTMLElement | null;
                    if (fb) fb.style.display = 'grid';
                  }}
                />
              ) : null}
              <div className="grain absolute inset-0 opacity-30" />
              <div data-fallback className="absolute inset-0 place-items-center text-center" style={{ display: p.portrait ? 'none' : 'grid' }}>
                <div>
                  <div className="font-display text-[8rem] leading-none text-gold/90 select-none">{initials}</div>
                  <div className="mt-4 text-[11px] tracking-[0.22em] uppercase text-cream/60">{t("Прижизненный портрет не сохранился", "No contemporary portrait preserved")}</div>
                </div>
              </div>
              <div className="absolute inset-0 ring-1 ring-inset ring-gold/20 pointer-events-none" />
            </div>
            {p.portraitCaption && (
              <p className="mt-3 text-[11px] tracking-wide text-cream/55 italic text-center">{p.portraitCaption}</p>
            )}
          </div>
          <div>
            <Link to="/litsa" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold hover:text-cream mb-6">
              <ArrowLeft className="h-3.5 w-3.5" /> {t("К галерее лиц", "Back to the gallery")}
            </Link>
            <div className="text-[11px] tracking-[0.32em] uppercase text-gold">{p.era}</div>
            <h1 className="mt-3 font-display text-5xl md:text-6xl">{p.name}</h1>
            <div className="mt-3 text-cream/75 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <span>{p.years}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-gold" />{p.region}</span>
            </div>
            <p className="mt-7 max-w-2xl text-cream/90 text-lg leading-relaxed">{p.short}</p>
          </div>
        </div>
      </section>

      {/* Горизонтальная лента вех меценатства */}
      {p.milestones.length > 0 && (
        <section className="bg-[oklch(0.18_0.04_28)] text-cream py-14 border-t border-b border-gold/15">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-6">{t("Лента меценатства", "Patronage timeline")}</div>
            <div className="relative overflow-x-auto pb-4">
              <div className="absolute left-0 right-0 top-[42px] h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              <ol className="flex gap-6 min-w-max relative">
                {p.milestones.map((m, i) => (
                  <li key={m} className="w-64 flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-6 rounded-full bg-gold ring-4 ring-bordo grid place-items-center text-[10px] font-display text-bordo">{i + 1}</div>
                      <div className="mt-4 text-sm text-cream/85 leading-relaxed text-center px-2">{m}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      <section className="paper-bg">
        <div className="container mx-auto px-4 lg:px-8 py-20 grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-card border border-border/60 p-8 rounded-sm">
            <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3">{t("Биография", "Biography")}</div>
            <h2 className="font-display text-3xl text-bordo">{t("Жизнь и дело", "Life and work")}</h2>
            <div className="gold-divider my-5 w-12" />
            <p className="text-foreground/85 leading-relaxed text-base whitespace-pre-line">{p.bio}</p>

            <div className="mt-10">
              <div className="flex items-center gap-3 text-bordo">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-display text-2xl">{t("Значение и влияние", "Significance and influence")}</h3>
              </div>
              <div className="gold-divider my-4 w-10" />
              <p className="text-foreground/90 leading-relaxed text-base font-medium">{p.influence}</p>
              {p.impactLong && (
                <p className="mt-4 text-foreground/80 leading-relaxed text-base whitespace-pre-line">{p.impactLong}</p>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-gradient-to-br from-[oklch(0.96_0.02_82)] to-[oklch(0.92_0.04_80)] border border-gold/40 p-7 rounded-sm shadow-[0_10px_30px_-15px_oklch(0.4_0.1_60/0.4)]">
              <div className="flex items-center gap-3 text-bordo">
                <Award className="h-5 w-5" />
                <h3 className="font-display text-xl">{t("Награды и признание", "Awards and recognition")}</h3>
              </div>
              <div className="gold-divider my-4 w-10" />
              <ul className="space-y-2.5">
                {p.awards.map((a) => (
                  <li key={a} className="flex items-start gap-2.5 text-sm text-foreground/85 bg-cream/40 px-3 py-2 rounded-sm border-l-2 border-gold">
                    <Medal className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border/60 p-7 rounded-sm">
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3">{t("Наследие", "Legacy")}</div>
              <p className="text-foreground/85 text-sm leading-relaxed">{p.legacy}</p>
            </div>
          </aside>
        </div>

        <div className="container mx-auto px-4 lg:px-8 pb-24 flex flex-wrap gap-3 justify-between items-center">
          {idx > 0 && (
            <Link to="/litsa/$slug" params={{ slug: PERSONS[idx - 1].slug }} className="text-xs uppercase tracking-[0.22em] text-bordo hover:text-gold">
              ← {PERSONS[idx - 1].name}
            </Link>
          )}
          <Link to="/litsa" className="text-xs uppercase tracking-[0.22em] text-gold hover:text-bordo">{t("Все лица", "All faces")}</Link>
          {idx < PERSONS.length - 1 && (
            <Link to="/litsa/$slug" params={{ slug: PERSONS[idx + 1].slug }} className="text-xs uppercase tracking-[0.22em] text-bordo hover:text-gold">
              {PERSONS[idx + 1].name} →
            </Link>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}