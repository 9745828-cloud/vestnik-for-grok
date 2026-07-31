import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import heroAzbuka from "@/assets/hero-azbuka.jpg";
import { PageHero } from "@/components/site/PageHero";
import { useGlossary } from "@/data/content.localized";
import { useLang, useT } from "@/i18n/lang";
import { focusElementById, getFocusTarget } from "@/lib/focus-target";

export const Route = createFileRoute("/azbuka")({
  head: () => ({
    meta: [
      { title: "Азбука мецената — словарь щедрости" },
      { name: "description", content: "Ключевые понятия благотворительности и меценатства — от альтруизма до целевого капитала." },
      { property: "og:title", content: "Азбука мецената" },
      { property: "og:description", content: "Словарь языка благих дел." },
    ],
  }),
  component: Azbuka,
});

/** Latin parallels for Russian alphabet letters (helps ZH/AR readers). */
const LETTER_LATIN: Record<string, string> = {
  А: "A",
  Б: "B",
  В: "V",
  Г: "G",
  Д: "D",
  Е: "E",
  Ж: "Zh",
  З: "Z",
  И: "I",
  К: "K",
  Л: "L",
  М: "M",
  Н: "N",
  О: "O",
  П: "P",
  Р: "R",
  С: "S",
  Т: "T",
  У: "U",
  Ф: "F",
  Х: "Kh",
  Ц: "Ts",
  Ч: "Ch",
  Щ: "Shch",
  Э: "E",
  Ю: "Yu",
  Я: "Ya",
};

function Azbuka() {
  const t = useT();
  const GLOSSARY = useGlossary();
  const lang = useLang();
  const showLatinHint = lang === "zh" || lang === "ar";
  useEffect(() => {
    if (typeof window === "undefined") return;
    const term = getFocusTarget("term-");
    if (!term) return;
    return focusElementById(`term-${term}`);
  }, []);
  return (
    <SiteLayout>
      <PageHero image={heroAzbuka}
        eyebrow={t("Азбука мецената", "Patron's ABC")}
        title={t("Словарь языка щедрости", "A dictionary of the language of generosity")}
        quote={t(
          "Слово — выражение мысли, мысль — проявление Божеской силы, и потому слово должно соответствовать тому, что оно выражает. Оно может быть безразлично, но не может и не должно быть выражением зла.",
          "A word is the expression of a thought, a thought is a manifestation of divine power, and therefore a word must correspond to what it expresses. It may be indifferent, but it cannot and must not be an expression of evil."
        )}
        author={t("Лев Толстой", "Leo Tolstoy")}
      />

      <section className="paper-bg">
        <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
          {showLatinHint && (
            <p className="mb-10 max-w-3xl text-sm md:text-base text-foreground/70 leading-relaxed">
              {t(
                "Статьи расположены в порядке русского алфавита.",
                "Entries are ordered by the Russian alphabet.",
              )}
            </p>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GLOSSARY.map((g) => {
              const latin = LETTER_LATIN[g.letter];
              return (
              <article
                key={g.term}
                id={`term-${g.term}`}
                className="group bg-card border border-border/60 p-7 rounded-sm relative overflow-hidden hover:border-gold/60 hover:shadow-[0_20px_60px_-20px_oklch(0.18_0.05_25/0.35)] transition-all"
              >
                <div className="absolute -top-4 -right-2 font-display text-[8rem] leading-none text-bordo/8 group-hover:text-gold/15 transition-colors select-none pointer-events-none">
                  {g.letter}
                </div>
                <div className="relative">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold">
                    {t("Буква", "Letter")} {g.letter}
                    {showLatinHint && latin ? (
                      <span className="tracking-normal normal-case text-foreground/45">
                        {" "}
                        ({latin})
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 font-display text-3xl text-bordo">{g.term}</h3>
                  <div className="gold-divider my-4 w-12" />
                  <p className="text-sm text-foreground/80 leading-relaxed">{g.def}</p>
                </div>
              </article>
              );
            })}
          </div>

        </div>
      </section>
    </SiteLayout>
  );
}
