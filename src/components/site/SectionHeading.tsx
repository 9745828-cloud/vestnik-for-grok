export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {eyebrow && (
        <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-4 ornament-frame inline-block">
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight">{title}</h2>
      {subtitle && <p className="mt-5 text-muted-foreground text-base md:text-lg">{subtitle}</p>}
      <div className={`gold-divider mt-7 ${center ? "mx-auto w-24" : "w-24"}`} />
    </div>
  );
}
