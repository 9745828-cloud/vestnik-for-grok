import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEras } from "@/data/content.localized";
import { useLang, useT } from "@/i18n/lang";

export function EraHero() {
  const ERAS = useEras();
  const lang = useLang();
  const t = useT();
  const [idx, setIdx] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const touchStart = useRef<number | null>(null);

  // Авто-смена каждые 6 сек, пока пользователь не начал взаимодействовать
  useEffect(() => {
    if (interacted) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % ERAS.length), 6000);
    return () => clearInterval(id);
  }, [interacted]);

  const select = (i: number) => {
    setIdx(i);
    setInteracted(true);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 40) {
      setInteracted(true);
      setIdx((i) => (dx < 0 ? Math.min(ERAS.length - 1, i + 1) : Math.max(0, i - 1)));
    }
    touchStart.current = null;
  };

  const era = ERAS[idx];

  return (
    <section
      className="relative h-[100svh] min-h-[640px] max-h-[920px] w-full overflow-hidden bg-ink text-cream select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label={t("Смена эпох русского меценатства", "Eras of Russian philanthropy")}
    >
      {/* Фоновые слои с кросс-фейдом */}
      {ERAS.map((e, i) => (
        <div
          key={e.id}
          aria-hidden={i !== idx}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={e.image}
            alt=""
            className={`h-full w-full object-cover ${i === idx ? "animate-ken-burns" : ""}`}
            loading={i === 0 ? "eager" : "lazy"}
            width={1536}
            height={1024}
          />
        </div>
      ))}

      {/* Виньетки и затемнение */}
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.16_0.04_30/0.55)] via-[oklch(0.16_0.04_30/0.45)] to-[oklch(0.10_0.02_30/0.92)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,oklch(0.10_0.02_30/0.55)_100%)]" />
      <div className="grain absolute inset-0 pointer-events-none" />

      {/* Контент */}
      <div className="relative z-10 h-full container mx-auto px-4 lg:px-8 flex flex-col">
        {/* Бейдж эпохи */}
        <div className="pt-20 md:pt-28 max-w-3xl">
          <div key={`eyebrow-${idx}`} className="animate-fade-in">
            <div className="text-[11px] tracking-[0.32em] uppercase text-gold/90">{era.accent}</div>
            {era.note && (
              <div className="mt-2 inline-block text-[10px] tracking-[0.25em] uppercase text-gold border border-gold/40 px-2 py-1">
                {era.note}
              </div>
            )}
          </div>

          <h1 className="mt-5 font-display text-5xl md:text-7xl lg:text-8xl text-cream leading-[1] drop-shadow-[0_2px_18px_oklch(0.10_0_0/0.7)]">
            {t("Вестник", "Patron")}
            <br />
            <span className="text-gold">{t("мецената", "Herald")}</span>
          </h1>
          <div className="mt-5 text-sm md:text-base tracking-[0.18em] uppercase text-cream/80">
            {t("Летопись благородных дел", "Chronicle of noble deeds")} · {era.years}
          </div>

          {/* Карточка эпохи */}
          <div key={`card-${idx}`} className="animate-fade-up mt-10 max-w-xl">
            <div className="text-gold font-display text-2xl md:text-3xl">{era.patron}</div>
            <div className="text-xs md:text-sm text-cream/70 mt-1">{era.patronTitle}</div>
            <blockquote className="mt-5 pl-5 border-l-2 border-gold/60 italic text-cream/85 text-base md:text-lg leading-relaxed">
              {(() => {
                const needle =
                  lang === "ru"
                    ? "Отмена крепостного права"
                    : lang === "en"
                      ? "abolition of serfdom"
                      : "";
                if (!needle) return era.quote;
                if (era.quote.toLowerCase().includes(needle.toLowerCase())) {
                  const re = new RegExp(needle, "i");
                  const parts = era.quote.split(re);
                  return (
                    <>
                      {parts[0]}
                      <Link to="/letopis/1861" className="not-italic text-gold underline decoration-gold/50 underline-offset-4 hover:text-cream">
                        {needle}
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                return era.quote;
              })()}
            </blockquote>
          </div>
        </div>

        <div className="flex-1" />

        {/* Шкала эпох */}
        <div className="pb-10 md:pb-14">
          <div className="relative">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gold/30" />
            <div
              className="absolute top-1/2 h-px bg-gold transition-all duration-700"
              style={{ width: `${(idx / (ERAS.length - 1)) * 100}%` }}
            />
            <div className="relative flex justify-between">
              {ERAS.map((e, i) => {
                const active = i === idx;
                const isPivot = e.id === "do-1861" || e.id === "posle-1861";
                return (
                  <button
                    key={e.id}
                    onClick={() => select(i)}
                    className="group flex flex-col items-center gap-3 text-left"
                    aria-label={t("Перейти к эпохе ", "Go to era ") + e.label}
                    aria-pressed={active}
                  >
                    <span
                      className={`block h-3 w-3 rounded-full border transition-all ${
                        active
                          ? "bg-gold border-gold scale-125 shadow-[0_0_18px_2px_oklch(0.74_0.10_80/0.55)]"
                          : "bg-ink border-gold/60 group-hover:border-gold"
                      }`}
                    />
                    <span
                      className={`text-[10px] md:text-xs uppercase tracking-[0.18em] transition-colors max-w-[80px] md:max-w-none text-center ${
                        active ? "text-gold" : "text-cream/60 group-hover:text-cream"
                      } ${isPivot ? "font-semibold" : ""}`}
                    >
                      {e.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Подсказка / CTA */}
          <div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <p className="text-xs md:text-sm text-cream/60 max-w-md">
              {t(
                "Перетаскивайте по шкале, нажимайте на эпоху или свайпайте, чтобы увидеть, как менялись лица русской щедрости.",
                "Drag the timeline, tap an era, or swipe to see how the faces of Russian generosity changed over time.",
              )}
            </p>
            <Link
              to="/litsa"
              className="inline-flex items-center self-start md:self-auto px-6 py-3 bg-gold text-ink text-xs uppercase tracking-[0.22em] font-medium hover:bg-[oklch(0.79_0.09_82)] transition-colors"
            >
              {t("Открыть галерею лиц", "Open faces gallery")}
            </Link>
          </div>
        </div>
      </div>

      {/* Стрелка-приглашение к скроллу */}
      <a
        href="#after-hero"
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 text-gold/70 hover:text-gold animate-bounce"
        aria-label={t("Прокрутить вниз", "Scroll down")}
      >
        <ChevronDown className="h-6 w-6" />
      </a>
    </section>
  );
}
