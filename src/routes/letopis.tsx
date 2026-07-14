import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import heroLetopis from "@/assets/hero-letopis.jpg";
import { PageHero } from "@/components/site/PageHero";
import { useChronicle } from "@/data/content.localized";
import { useT } from "@/i18n/lang";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/letopis")({
  head: () => ({
    meta: [
      { title: "Летопись щедрости — хронология благих дел" },
      { name: "description", content: "Хронология ключевых событий русского меценатства от 1755 года до наших дней." },
      { property: "og:title", content: "Летопись щедрости" },
      { property: "og:description", content: "Триста лет благих дел в одной хронике." },
    ],
  }),
  component: Letopis,
});

const FILTERS_BASE = [
  { id: "all", ru: "Все эпохи", en: "All eras", from: -1000, to: 2100 },
  { id: "antiq", ru: "Древний мир", en: "Ancient world", from: -1000, to: 1000 },
  { id: "do", ru: "До 1861", en: "Before 1861", from: 1000, to: 1861 },
  { id: "posle", ru: "1861 — 1917", en: "1861 – 1917", from: 1861, to: 1917 },
  { id: "xx", ru: "XX век", en: "20th century", from: 1917, to: 2000 },
  { id: "now", ru: "Наши дни", en: "Today", from: 2000, to: 2100 },
];

function Letopis() {
  const t = useT();
  const FILTERS = FILTERS_BASE.map((f) => ({ ...f, label: t(f.ru, f.en) }));
  const CHRONICLE = useChronicle();
  const [filter, setFilter] = useState(FILTERS[0]);
  const items = useMemo(
    () => CHRONICLE.filter((c) => c.year >= filter.from && c.year < filter.to).sort((a, b) => a.year - b.year),
    [filter],
  );

  return (
    <SiteLayout>
      <PageHero image={heroLetopis}
        eyebrow={t("Летопись щедрости", "Chronicle of generosity")}
        title={t("Хроника благих дел", "Chronicle of good deeds")}
        intro={t(
          "Время идёт, история переворачивает свои страницы, добро обретает новые формы и находит новые пути, но суть остаётся неизменной: оно всегда совершается от сердца, от души, как искренний импульс, что не подвластен времени. Добро — это не форма, а внутреннее движение, которое живёт в каждом из нас. Летопись меценатов — это память о тех, чьи поступки преодолевают века и чей след в истории несёт свет и тепло для будущих поколений.",
          "Time passes, history turns its pages, goodness takes on new forms and finds new paths, but its essence remains unchanged: it is always done from the heart, as a sincere impulse beyond time. Good is not a form but an inner movement that lives in each of us. The chronicle of patrons is the memory of those whose deeds cross the centuries and whose trace in history carries light and warmth to the generations to come."
        )}
      />

      <section className="bg-bordo text-cream">
        <div className="container mx-auto px-4 lg:px-8 py-16 md:py-20">
          <figure className="max-w-3xl mx-auto text-center">
            <blockquote className="font-display text-xl md:text-2xl text-cream italic leading-relaxed">
              {t(
                "«История меценатства показывает: у добра нет национальности и конфессии — оно рождается из сердца, из веры, из чувства ответственности перед Богом, людьми и будущим. „Вестник мецената“ возвращает нам имена тех, кто на протяжении трёх веков создавал общее культурное и духовное пространство, где разные народы и религии соединяются в единых ценностях милосердия, просвещения и служения человеку».",
                "“The history of patronage shows that goodness has no nationality or confession — it is born of the heart, of faith, of a sense of responsibility before God, people and the future. The ‘Patron Herald’ returns to us the names of those who, for three centuries, built a shared cultural and spiritual space where different peoples and religions are united in the common values of mercy, enlightenment and service to humanity.”"
              )}
            </blockquote>
            <figcaption className="mt-6">
              <div className="font-display text-2xl md:text-3xl text-gold">{t("Рамиль Керимов", "Ramil Kerimov")}</div>
              <div className="mt-2 text-xs tracking-[0.22em] uppercase text-cream/75">
                {t("руководитель фонда «Полилог», создатель сайта «Вестник мецената и филантропа»", "head of the Polylog Foundation, founder of the Patron & Philanthropist Herald")}
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="paper-bg">
        <div className="container mx-auto px-4 lg:px-8 py-16 md:py-20">
          <div className="flex flex-wrap gap-2 mb-12">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border transition-colors ${
                  filter.id === f.id
                    ? "bg-bordo text-cream border-bordo"
                    : "bg-transparent border-border/70 text-foreground/70 hover:border-gold hover:text-bordo"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <ol className="relative border-l border-gold/40 ml-4 space-y-12">
            {items.map((c) => (
              <li key={c.year + c.title} className="pl-10 relative">
                <span className={`absolute -left-[11px] top-2 rounded-full border-4 border-background ${
                  c.pivot ? "h-6 w-6 bg-bordo shadow-[0_0_0_4px_oklch(0.74_0.10_80/0.4)]" : "h-4 w-4 bg-gold"
                }`} />
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-6">
                  <div className={`font-display shrink-0 ${c.pivot ? "text-6xl text-bordo" : "text-4xl text-bordo"}`}>
                    {c.year < 0 ? `${Math.abs(c.year)} ${t("до н. э.", "BC")}` : c.year}
                  </div>
                  <div className="flex-1">
                    {c.pivot ? (
                      <Link to="/letopis/1861" className="group inline-flex items-center gap-2 font-display text-2xl md:text-3xl text-bordo border-b-2 border-gold hover:border-bordo transition-colors">
                        {c.title} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <div className="font-medium text-foreground text-lg">{c.title}</div>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">{c.text}</p>
                  </div>
                </div>
              </li>
            ))}
            {items.length === 0 && (
              <li className="pl-10 text-muted-foreground">{t("В этот период записей пока нет.", "No entries for this period yet.")}</li>
            )}
          </ol>
        </div>
      </section>
    </SiteLayout>
  );
}
