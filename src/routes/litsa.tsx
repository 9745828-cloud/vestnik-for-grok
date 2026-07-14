import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import heroLitsa from "@/assets/hero-litsa.jpg";
import { PageHero } from "@/components/site/PageHero";
import { useEffect, useState } from "react";
import { useLitsa } from "@/lib/wp/hooks";
import { useT } from "@/i18n/lang";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Award, MapPin, Sparkles, Medal } from "lucide-react";
import { focusElementById, getFocusTarget } from "@/lib/focus-target";

export const Route = createFileRoute("/litsa")({
  head: () => ({
    meta: [
      { title: "Лица, оставившие свет — галерея меценатов" },
      { name: "description", content: "Восемь судеб русской и евразийской щедрости — от Демидовых до Тагиева." },
      { property: "og:title", content: "Лица, оставившие свет" },
      { property: "og:description", content: "Галерея меценатов России и стран СНГ." },
    ],
  }),
  component: Litsa,
});

const INITIAL_BG = ["#5B1A1F", "#3d1419", "#7a4f1c", "#2c4a3d", "#43344f", "#5b3a1f", "#1f3b4a", "#4a1f2c"];

function ruDecline(n: number, forms: [string, string, string]): string {
  const [one, twoToFour, many] = forms;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return twoToFour;
  return many;
}

function personSortYear(years: string): number {
  const isBC = /до н\. ?э\.|BC/i.test(years);
  const match = years.match(/\d+/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  const n = parseInt(match[0], 10);
  return isBC ? -n : n;
}

function Litsa() {
  const t = useT();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const { items: PERSONS_RAW } = useLitsa();
  const PERSONS = [...PERSONS_RAW].sort((a, b) => personSortYear(a.years) - personSortYear(b.years));
  const openPerson = PERSONS.find((p) => p.slug === openSlug) ?? null;
  const openIdx = openPerson ? PERSONS.findIndex((p) => p.slug === openPerson.slug) : -1;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (PERSONS.length === 0) return;
    const slug = getFocusTarget("person-");
    if (!slug) return;
    return focusElementById(`person-${slug}`);
  }, [PERSONS.length]);

  return (
    <SiteLayout>
      <PageHero image={heroLitsa}
        eyebrow={t("Лица, оставившие свет", "Faces who left light")}
        title={t(
          `${PERSONS.length} ${ruDecline(PERSONS.length, ["судьба", "судьбы", "судеб"])} щедрости`,
          `${PERSONS.length} lives of generosity`
        )}
        intro={t(
          "Они были разными — дворянами и купцами, бывшими крепостными и нефтепромышленниками, врачами и предпринимателями, шейхами и меценатами разных стран и эпох. Но каждый из них умел распоряжаться своими возможностями так, что свет от их дел доходит до нас.",
          "They were different — nobles and merchants, former serfs and oil magnates, doctors and entrepreneurs, sheikhs and patrons from different countries and eras. But each of them knew how to use their means so that the light of their deeds still reaches us."
        )}
        quote={t(
          "Самое маленькое проявление доброты стоит больше, чем самое большое намерение",
          "The smallest act of kindness is worth more than the grandest intention."
        )}
        author={t("Халиль Джебран", "Khalil Gibran")}
      />

      <section className="paper-bg">
        <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {PERSONS.map((p, i) => (
              <button
                type="button"
                key={p.slug}
                id={`person-${p.slug}`}
                onClick={() => setOpenSlug(p.slug)}
                className="group bg-card border border-border/60 rounded-sm overflow-hidden hover:border-gold/60 hover:shadow-[0_20px_60px_-20px_oklch(0.18_0.05_25/0.35)] transition-all flex flex-col text-left h-full"
              >
                <div className="aspect-[4/5] relative overflow-hidden flex-shrink-0" style={{ background: INITIAL_BG[i % INITIAL_BG.length] }}>
                  {p.portrait ? (
                    <img
                      src={p.portrait}
                      alt={t(`Портрет: ${p.name}`, `Portrait: ${p.name}`)}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: p.portraitPosition ?? "center" }}
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.style.display = 'none';
                        const fb = img.parentElement?.querySelector('[data-fallback]') as HTMLElement | null;
                        if (fb) fb.style.display = 'grid';
                      }}
                    />
                  ) : null}

                  <div className="absolute inset-0 grain opacity-30" />

                  <div data-fallback className="absolute inset-0 place-items-center hidden" style={{ display: p.portrait ? 'none' : 'grid' }}>
                    <div className="text-center px-6">
                      <div className="font-display text-[7rem] leading-none text-gold/90 select-none">
                        {p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </div>
                      <div className="mt-3 text-[10px] tracking-[0.18em] uppercase text-cream/60">Портрет не сохранился</div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/85 via-black/55 to-transparent">
                    <div className="text-[10px] tracking-[0.22em] uppercase text-gold/90">{p.era}</div>
                    <div className="font-display text-2xl text-cream mt-1 leading-tight">{p.name}</div>
                    <div className="text-xs text-cream/70 mt-1">{p.years} · {p.region}</div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm text-foreground/85 leading-relaxed line-clamp-3">{p.short}</p>
                  <div className="gold-divider my-5 w-12" />
                  <div className="text-[10px] tracking-[0.22em] uppercase text-gold mb-1">{t("Наследие", "Legacy")}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{p.legacy}</p>
                  
                  <span className="mt-auto text-[11px] uppercase tracking-[0.22em] text-bordo group-hover:text-gold transition-colors pt-4">
                    {t("Узнать больше", "Read more")} →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!openPerson} onOpenChange={(o) => !o && setOpenSlug(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 bg-cream border-gold/40">
          {openPerson && (
            <div className="paper-bg">
              <DialogTitle className="sr-only">{openPerson.name}</DialogTitle>
              <DialogDescription className="sr-only">
                {t("Подробная карточка мецената с биографией, влиянием и наследием.", "Detailed patron card with biography, impact and legacy.")}
              </DialogDescription>
              <div className="bg-bordo text-cream p-8 md:p-10 grid md:grid-cols-[260px_1fr] gap-8">
                <div>
                <div className="aspect-[4/5] relative rounded-sm overflow-hidden border-2 border-gold/50" style={{ background: INITIAL_BG[openIdx % INITIAL_BG.length] }}>
                  {openPerson.portrait ? (
                    <img src={openPerson.portrait} alt={openPerson.name} decoding="async" className={`absolute inset-0 h-full w-full ${openPerson.portraitFit === "contain" ? "object-contain" : "object-cover"}`} style={{ objectPosition: openPerson.portraitPosition ?? "center" }} onError={(e) => { const img = e.currentTarget as HTMLImageElement; img.style.display='none'; const fb=img.parentElement?.querySelector('[data-fb]') as HTMLElement|null; if(fb) fb.style.display='grid'; }} />
                  ) : null}
                  <div data-fb className="absolute inset-0 place-items-center text-center" style={{ display: openPerson.portrait ? 'none' : 'grid' }}>
                    <div>
                      <div className="font-display text-[6rem] leading-none text-gold/90">{openPerson.name.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
                      <div className="mt-2 text-[10px] tracking-[0.2em] uppercase text-cream/60">{t("Портрет не сохранился", "Portrait not preserved")}</div>
                    </div>
                  </div>
                </div>
                {openPerson.portraitCaption && (
                  <p className="mt-3 text-[11px] tracking-wide text-cream/55 italic text-center">{openPerson.portraitCaption}</p>
                )}
                </div>
                <div>
                  <div className="text-[11px] tracking-[0.3em] uppercase text-gold">{openPerson.era}</div>
                  <h2 className="mt-2 font-display text-4xl md:text-5xl">{openPerson.name}</h2>
                  <div className="mt-2 text-cream/75 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    <span>{openPerson.years}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-gold" />{openPerson.region}</span>
                  </div>
                  <p className="mt-5 text-cream/90 text-base leading-relaxed">{openPerson.short}</p>
                  <div className="mt-6 flex items-center gap-3 text-gold/80" aria-hidden>
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/50 to-gold/70" />
                    <svg viewBox="0 0 64 16" className="h-4 w-16" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M2 8 H22" />
                      <path d="M42 8 H62" />
                      <circle cx="32" cy="8" r="3" fill="currentColor" />
                      <circle cx="26" cy="8" r="1.2" fill="currentColor" />
                      <circle cx="38" cy="8" r="1.2" fill="currentColor" />
                      <path d="M32 2 L34 8 L32 14 L30 8 Z" fill="currentColor" opacity="0.7" />
                    </svg>
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/50 to-gold/70" />
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-10 grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">{t("Биография", "Biography")}</div>
                  <h3 className="font-display text-2xl text-bordo">{t("Жизнь и дело", "Life and work")}</h3>
                  <div className="gold-divider my-4 w-12" />
                  <p className="text-foreground/85 leading-relaxed whitespace-pre-line">{openPerson.bio}</p>

                  <div className="mt-8 flex items-center gap-3 text-bordo">
                    <Sparkles className="h-5 w-5" />
                    <h3 className="font-display text-2xl">{t("Значение и влияние", "Significance and influence")}</h3>
                  </div>
                  <div className="gold-divider my-3 w-10" />
                  <p className="text-foreground/90 font-medium leading-relaxed">{openPerson.influence}</p>
                  {openPerson.impactLong && (
                    <p className="mt-3 text-foreground/80 leading-relaxed whitespace-pre-line">{openPerson.impactLong}</p>
                  )}

                  {openPerson.milestones.length > 0 && (
                    <div className="mt-8">
                      <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3">{t("Ключевые вехи", "Key milestones")}</div>
                      <ol className="space-y-2">
                        {openPerson.milestones.map((m, i) => (
                          <li key={m} className="flex gap-3 text-sm text-foreground/85">
                            <span className="font-display text-gold">{i+1}.</span><span>{m}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
                <aside className="space-y-6">
                  <div className="bg-gradient-to-br from-[oklch(0.96_0.02_82)] to-[oklch(0.92_0.04_80)] border border-gold/40 p-6 rounded-sm">
                    <div className="flex items-center gap-3 text-bordo">
                      <Award className="h-5 w-5" />
                      <h3 className="font-display text-xl">{t("Награды и признание", "Awards and recognition")}</h3>
                    </div>
                    <div className="gold-divider my-3 w-10" />
                    <ul className="space-y-2">
                      {openPerson.awards.map((a) => (
                        <li key={a} className="flex items-start gap-2 text-sm text-foreground/85 bg-cream/40 px-3 py-2 rounded-sm border-l-2 border-gold">
                          <Medal className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-card border border-border/60 p-6 rounded-sm">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">{t("Наследие", "Legacy")}</div>
                    <p className="text-foreground/85 text-sm leading-relaxed">{openPerson.legacy}</p>
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
