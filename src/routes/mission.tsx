import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import heroMission from "@/assets/hero-mission.jpg";
import { PageHero } from "@/components/site/PageHero";
import { useValues } from "@/data/content.localized";
import { useT } from "@/i18n/lang";
import { BookHeart, Compass, Feather, Sparkles } from "lucide-react";

export const Route = createFileRoute("/mission")({
  head: () => ({
    meta: [
      { title: "Миссия проекта — Вестник мецената и филантропа" },
      { name: "description", content: "Манифест издания: зачем мы пишем летопись благородных дел и какие ценности её ведут." },
      { property: "og:title", content: "Миссия проекта — Вестник мецената и филантропа" },
      { property: "og:description", content: "Сохранять память о тех, кто умножал доброе." },
    ],
  }),
  component: Mission,
});

const ICONS = [BookHeart, Compass, Feather, Sparkles];

function Mission() {
  const t = useT();
  const VALUES = useValues();
  return (
    <SiteLayout>
      <PageHero image={heroMission}
        eyebrow={t("Миссия проекта", "Project mission")}
        title={t("Сохранить память о тех, кто умножал доброе", "To preserve the memory of those who multiplied the good")}
        intro={t(
          "«Вестник мецената и филантропа» — это пространство, где частная инициатива обретает голос и смысл. Здесь добро рассматривается не как разовый жест, а как часть большой культурной и общественной традиции — от исторических примеров меценатства до современных практик филантропии. Проект рассказывает о людях, которые превращали личный успех в пользу для общества, поддерживали образование, науку, искусство, здравоохранение, сохраняли память и создавали институции, пережившие своё время. Это летопись поступков, в которых частное участие становится общим достоянием, а личный выбор — вкладом в будущее.",
          "“Patron & Philanthropist Herald” is a space where private initiative finds its voice and meaning. Here, doing good is not a one-off gesture but part of a great cultural and civic tradition — from historical examples of patronage to contemporary philanthropy. The project tells of people who turned personal success into benefit for society, supporting education, science, art, healthcare, preserving memory and creating institutions that outlived their own time. It is a chronicle of deeds where private engagement becomes a common heritage, and personal choice — a contribution to the future."
        )}
        quote={t(
          "Надо, чтобы за дверью каждого довольного, счастливого человека стоял кто-нибудь с молоточком и постоянно напоминал бы стуком, что есть несчастные…",
          "Behind the door of every contented, happy person there ought to stand someone with a little hammer constantly reminding him by his knock that there are unhappy people…"
        )}
        author={t("А. П. Чехов", "A. P. Chekhov")}
      />

      <section className="relative overflow-hidden text-cream" style={{ background: "linear-gradient(180deg, oklch(0.22 0.05 25) 0%, oklch(0.16 0.04 28) 100%)" }}>
        <div className="grain absolute inset-0 opacity-30 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(at 30% 20%, oklch(0.74 0.10 80 / 0.10) 0, transparent 55%), radial-gradient(at 80% 80%, oklch(0.36 0.12 25 / 0.18) 0, transparent 50%)" }} />
        <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28 max-w-4xl relative z-10">
          <div className="prose prose-lg max-w-none">
            <p className="font-display text-2xl md:text-4xl text-gold leading-snug">
              {t(
                "«Вестник мецената и филантропа» — это пространство, где частная инициатива обретает голос и смысл.",
                "“Patron & Philanthropist Herald” is a space where private initiative finds its voice and meaning."
              )}
            </p>
            <p className="mt-8 text-cream/85 leading-relaxed text-lg">
              {t(
                "«Вестник мецената и филантропа» — не реестр имён и не перечень пожертвований. Это живая летопись человеческой щедрости — как финансовой, так и душевной — той силы, что на протяжении трёх столетий поддерживала и развивала русскую культуру, медицину, науку и образование, давала вдохновение и саму жизнь многим великим начинаниям, большая часть из которых до сих пор делает наш мир лучше.",
                "“Patron & Philanthropist Herald” is not a registry of names nor a list of donations. It is a living chronicle of human generosity — both material and spiritual — the force that for three centuries supported and developed Russian culture, medicine, science and education, gave inspiration and life itself to many great undertakings, most of which still make our world a better place."
              )}
            </p>
            <p className="mt-6 text-cream/80 leading-relaxed">
              {t(
                "«Вестник» работает как открытый архив: любой читатель может прислать историю, предложить героя, поделиться семейной памятью. Для нас благотворительность — не статья расходов, а форма культуры, которой можно учиться, как учатся языку или ремеслу.",
                "The Herald works as an open archive: any reader can send in a story, propose a hero, or share a family memory. For us, charity is not a line of expense but a form of culture that can be learned, just as one learns a language or a craft."
              )}
            </p>
          </div>

          <div className="gold-divider my-16 w-24" />

          <h2 className="font-display text-3xl md:text-5xl text-cream text-center">{t("Четыре заповеди филантропа и мецената", "Four commandments of a philanthropist and patron")}</h2>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-stretch">
            {VALUES.map((v, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div
                  key={v.title}
                  id={v.slug}
                  className="scroll-wrap scroll-target"
                  style={{ ["--unfurl-delay" as string]: `${i * 2000}ms`, ["--sway-delay" as string]: `${2200 + i * 2000}ms` }}
                >
                  {/* Верхний валик */}
                  <div className="scroll-rod scroll-rod--top">
                    <div className="scroll-cap scroll-cap--left" />
                    <div className="scroll-cap scroll-cap--right" />
                  </div>
                  {/* Тело пергамента */}
                  <div className="scroll-body">
                    <div className="absolute inset-0 grain opacity-30 pointer-events-none" />
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 55%, oklch(0.45 0.06 60 / 0.18) 100%)" }} />
                    <div className="scroll-content relative h-full flex flex-col items-center justify-center text-center px-5 py-8 gap-4">
                      <Icon className="h-7 w-7 text-bordo/80" />
                      <div className="font-display text-base md:text-lg text-bordo leading-tight tracking-tight whitespace-nowrap">{v.title}</div>
                      <div className="h-px w-10 bg-gold/60" />
                      <p className="text-sm text-bordo/85 leading-relaxed text-center max-w-[26ch] mx-auto">{v.text}</p>
                      <div className="font-display text-gold text-sm tracking-[0.3em]">❖</div>
                    </div>
                  </div>
                  {/* Нижний валик */}
                  <div className="scroll-rod scroll-rod--bottom">
                    <div className="scroll-cap scroll-cap--left" />
                    <div className="scroll-cap scroll-cap--right" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <style>{`
          @keyframes scroll-unfurl {
            0%   { transform: scaleY(0.04) scaleX(0.95); opacity: 0; filter: blur(2px); }
            10%  { opacity: 1; filter: blur(1px); }
            60%  { transform: scaleY(1.04) scaleX(1) rotate(-0.4deg); }
            80%  { transform: scaleY(0.98) rotate(0.3deg); }
            100% { transform: scaleY(1) scaleX(1) rotate(0); opacity: 1; filter: blur(0); }
          }
          @keyframes scroll-content-fade {
            0%, 60% { opacity: 0; transform: translateY(6px); }
            100%    { opacity: 1; transform: translateY(0); }
          }
          @keyframes scroll-sway {
            0%, 100% { transform: rotate(-0.7deg) translateY(0); }
            50%      { transform: rotate(0.7deg) translateY(-3px); }
          }
          .scroll-wrap { display: flex; flex-direction: column; min-height: 380px; transition: transform .4s ease; animation: scroll-sway 7s ease-in-out infinite; animation-delay: var(--sway-delay, 0ms); transform-origin: top center; scroll-margin-top: 100px; perspective: 800px; }
          .scroll-wrap:hover { transform: translateY(-4px) scale(1.01); }
          .scroll-wrap:target .scroll-body { box-shadow: 0 0 0 3px oklch(0.74 0.10 80 / 0.6), inset 6px 0 12px -8px oklch(0 0 0 / 0.25), inset -6px 0 12px -8px oklch(0 0 0 / 0.25); }
          .scroll-rod { position: relative; height: 18px; border-radius: 4px;
            background: linear-gradient(180deg, oklch(0.62 0.08 70) 0%, oklch(0.42 0.07 50) 50%, oklch(0.30 0.05 45) 100%);
            box-shadow: inset 0 1px 0 oklch(1 0 0 / 0.25), inset 0 -2px 4px oklch(0 0 0 / 0.35), 0 4px 10px -4px oklch(0 0 0 / 0.5);
          }
          .scroll-rod::before, .scroll-rod::after { content: ""; position: absolute; left: 0; right: 0; height: 2px; background: oklch(0.78 0.10 80 / 0.6); }
          .scroll-rod::before { top: 4px; }
          .scroll-rod::after { bottom: 4px; }
          .scroll-cap { position: absolute; top: 50%; transform: translateY(-50%); width: 14px; height: 26px; border-radius: 50%;
            background: radial-gradient(circle at 35% 35%, oklch(0.82 0.10 82) 0%, oklch(0.50 0.08 60) 70%, oklch(0.30 0.05 45) 100%);
            box-shadow: 0 2px 4px oklch(0 0 0 / 0.4);
          }
          .scroll-cap--left { left: -8px; }
          .scroll-cap--right { right: -8px; }
          .scroll-body { position: relative; flex: 1; overflow: hidden;
            background:
              repeating-linear-gradient(180deg, transparent 0 22px, oklch(0.55 0.05 60 / 0.04) 22px 23px),
              linear-gradient(180deg, oklch(0.93 0.025 82) 0%, oklch(0.88 0.035 80) 50%, oklch(0.93 0.025 82) 100%);
            border-left: 1px solid oklch(0.55 0.05 60 / 0.4);
            border-right: 1px solid oklch(0.55 0.05 60 / 0.4);
            box-shadow: inset 8px 0 16px -10px oklch(0 0 0 / 0.35), inset -8px 0 16px -10px oklch(0 0 0 / 0.35), 0 14px 30px -20px oklch(0 0 0 / 0.45);
            transform-origin: top;
            animation: scroll-unfurl 2.2s cubic-bezier(.2,.7,.2,1) both;
            animation-delay: var(--unfurl-delay, 0ms);
          }
          .scroll-content { opacity: 0; animation: scroll-content-fade 1s ease-out both; animation-delay: calc(var(--unfurl-delay, 0ms) + 1500ms); }
          @media (prefers-reduced-motion: reduce) {
            .scroll-wrap { animation: none; }
            .scroll-body { animation: none; transform: scaleY(1); }
          }
        `}</style>
      </section>
    </SiteLayout>
  );
}
