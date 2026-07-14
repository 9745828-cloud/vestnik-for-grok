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

function Azbuka() {
  const t = useT();
  const GLOSSARY = useGlossary();
  const lang = useLang();
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GLOSSARY.map((g) => (
              <article
                key={g.term}
                id={`term-${g.term}`}
                className="group bg-card border border-border/60 p-7 rounded-sm relative overflow-hidden hover:border-gold/60 hover:shadow-[0_20px_60px_-20px_oklch(0.18_0.05_25/0.35)] transition-all"
              >
                <div className="absolute -top-4 -right-2 font-display text-[8rem] leading-none text-bordo/8 group-hover:text-gold/15 transition-colors select-none pointer-events-none">
                  {g.letter}
                </div>
                <div className="relative">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold">{t("Буква", "Letter")} {g.letter}</div>
                  <h3 className="mt-3 font-display text-3xl text-bordo">{g.term}</h3>
                  <div className="gold-divider my-4 w-12" />
                  <p className="text-sm text-foreground/80 leading-relaxed">{g.def}</p>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>
    </SiteLayout>
  );
}
