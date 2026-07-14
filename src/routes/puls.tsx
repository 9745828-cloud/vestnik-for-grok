import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import heroPuls from "@/assets/hero-puls.jpg";
import { PageHero } from "@/components/site/PageHero";
import { useNews } from "@/data/content.localized";
import { useLang, useT } from "@/i18n/lang";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/puls")({
  head: () => ({
    meta: [
      { title: "Пульс времени и перемен — современная щедрость" },
      { name: "description", content: "Свежие события, премии и инициативы в области меценатства и благотворительности." },
      { property: "og:title", content: "Пульс времени и перемен" },
      { property: "og:description", content: "Что происходит в благотворительности сегодня." },
    ],
  }),
  component: Puls,
});

function fmtDate(s: string, locale: string) {
  const d = new Date(s);
  return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}

function Puls() {
  const t = useT();
  const lang = useLang();
  const NEWS = useNews();
  return (
    <SiteLayout>
      <PageHero image={heroPuls}
        eyebrow={t("Пульс времени", "Pulse of time")}
        title={t("Меценатство, которое происходит сейчас", "Patronage happening right now")}
        intro={t(
          "Рубрика о том, что меняется на наших глазах: новые фонды, премии, восстановленные усадьбы, программы поддержки сёл и регионов.",
          "A section about what is changing before our eyes: new foundations, prizes, restored estates, programmes for villages and regions."
        )}
      />

      <section className="paper-bg">
        <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28 max-w-4xl">
          <div className="space-y-5">
            {NEWS.map((n) => (
              <article key={n.title} className="bg-card border border-border/60 rounded-sm p-7 md:p-8 hover:border-gold/60 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                  <h3 className="font-display text-2xl md:text-3xl text-bordo">{n.title}</h3>
                  <time className="text-xs tracking-[0.2em] uppercase text-gold shrink-0">{fmtDate(n.date, lang === "en" ? "en-US" : "ru-RU")}</time>
                </div>
                <p className="text-foreground/80 leading-relaxed">{n.text}</p>
                {n.url && (
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-5 text-xs uppercase tracking-[0.22em] text-bordo hover:text-gold border-b border-gold/40 pb-1 transition-colors"
                  >
                    {n.source ?? t("Открыть источник", "Open source")} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
