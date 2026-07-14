import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import heroPuti from "@/assets/hero-puti.jpg";
import { PageHero } from "@/components/site/PageHero";
import { usePaths } from "@/data/content.localized";
import { useT } from "@/i18n/lang";
import { focusElementById, getFocusTarget } from "@/lib/focus-target";
import { Heart, Building2, GraduationCap, Landmark, Briefcase, Library, Users, HandHeart, Coins, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/puti/")({
  head: () => ({
    meta: [
      { title: "Пути благородного участия — как стать меценатом" },
      { name: "description", content: "Шесть форматов щедрости: от разовой помощи до институционального меценатства." },
      { property: "og:title", content: "Пути благородного участия" },
      { property: "og:description", content: "Как стать частью традиции — практические форматы." },
    ],
  }),
  component: Puti,
});

const ICONS_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Building2, GraduationCap, Landmark, Briefcase, Library, Users, HandHeart, Coins,
};

function Puti() {
  const t = useT();
  const PATHS = usePaths();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const slug = getFocusTarget("path-");
    if (!slug) return;
    return focusElementById(`path-${slug}`);
  }, []);
  return (
    <SiteLayout>
      <PageHero image={heroPuti}
        eyebrow={t("Пути участия", "Paths of participation")}
        title={t("Дороги щедрости — выберите свою", "Roads of generosity — choose your own")}
        intro={t(
          "Меценатство рождается не от избытка, а из внутреннего импульса — бескорыстного желания оставить после себя не только результат, но и смысл.",
          "Patronage is born not of abundance but of an inner impulse — the selfless desire to leave behind not only a result, but a meaning."
        )}
        quote={t("В жизни всегда есть место подвигам", "There is always room for great deeds in life")}
        author={t("М. Горький", "M. Gorky")}
      />

      <section className="paper-bg">
        <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PATHS.map((p, i) => {
              const Icon = ICONS_MAP[p.icon] ?? Heart;
              return (
                <Link
                  key={p.slug}
                  id={`path-${p.slug}`}
                  to="/puti/$slug"
                  params={{ slug: p.slug }}
                  className="group relative bg-card border border-border/60 p-8 rounded-sm hover:border-gold/60 hover:shadow-[0_20px_60px_-20px_oklch(0.18_0.05_25/0.35)] transition-all flex flex-col"
                >
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-5">{t("Путь", "Path")} {String(i + 1).padStart(2, "0")}</div>
                  <Icon className="h-8 w-8 text-bordo" />
                  <h3 className="mt-4 font-display text-2xl text-foreground">{p.title}</h3>
                  <div className="gold-divider my-4 w-10" />
                  <p className="text-sm text-foreground/80 leading-relaxed">{p.short}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-bordo group-hover:text-gold transition-colors">
                    {t("Подробнее", "Read more")} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 bg-bordo text-cream p-10 md:p-14 rounded-sm grid md:grid-cols-[1fr_auto] items-center gap-8">
            <div>
              <div className="text-[11px] tracking-[0.3em] uppercase text-gold">{t("Готовы сделать первый шаг?", "Ready to take the first step?")}</div>
              <h3 className="mt-3 font-display text-3xl md:text-4xl">{t("Расскажите нам о своём замысле", "Tell us about your idea")}</h3>
              <p className="mt-3 text-cream/80 max-w-xl">{t("Редакция «Вестника» поможет найти проверенный фонд, связать с проектом или рассказать вашу историю — без шума и формальностей.", "The Herald's editors will help you find a trusted foundation, connect with a project or share your story — without fuss or red tape.")}</p>
            </div>
            <Link to="/prichastnost" className="inline-flex items-center px-7 py-3.5 bg-gold text-ink text-xs uppercase tracking-[0.22em] font-medium hover:bg-[oklch(0.79_0.09_82)] transition-colors whitespace-nowrap">
              {t("Сделать первый шаг", "Take the first step")}
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
