export function PageHero({
  eyebrow,
  title,
  intro,
  quote,
  author,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  quote?: string;
  author?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="relative ink-bg text-cream overflow-hidden min-h-[60svh]">
      {image && (
        <div className="absolute inset-0">
          <img
            src={image}
            alt={imageAlt ?? ""}
            className="h-full w-full object-cover animate-ken-burns"
            width={1536}
            height={1024}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.16_0.04_30/0.78)] via-[oklch(0.16_0.04_30/0.7)] to-[oklch(0.10_0.02_30/0.92)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,oklch(0.10_0.02_30/0.55)_100%)]" />
        </div>
      )}
      <div className="grain absolute inset-0 pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="max-w-3xl">
          <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-5">{eyebrow}</div>
          <h1 className="font-display text-4xl md:text-6xl text-cream leading-[1.05] drop-shadow-[0_2px_18px_oklch(0.10_0_0/0.7)]">{title}</h1>
          <div className="gold-divider mt-8 w-24" />
          {intro && <p className="mt-8 text-cream/85 text-lg leading-relaxed max-w-2xl">{intro}</p>}
          {quote && (
            <blockquote className="mt-10 pl-6 border-l-2 border-gold/60 italic text-cream/85 max-w-xl">
              «{quote}»
              {author && <footer className="not-italic text-sm text-gold/80 mt-2">— {author}</footer>}
            </blockquote>
          )}
        </div>
      </div>
    </section>
  );
}
