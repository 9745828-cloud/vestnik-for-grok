import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PATHS } from "@/data/content";
import { usePaths } from "@/data/content.localized";
import { useT } from "@/i18n/lang";
import {
  ArrowLeft, AlertTriangle, Scale, ListChecks, Clock, Wallet, BarChart3,
  Quote, CheckCircle2, FileText, Calculator, BookOpen, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/puti/$slug")({
  head: ({ params }) => {
    const p = PATHS.find((x) => x.slug === params.slug);
    return {
      meta: [
        { title: `${p?.title ?? "Path of participation"} — Vestnik Mecenata` },
        { name: "description", content: p?.short ?? "One of the paths of noble participation." },
      ],
    };
  },
  component: PathDetail,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="font-display text-4xl text-bordo">Not found</h1>
        <Link to="/puti" className="mt-6 inline-block text-gold underline">Back to paths</Link>
      </div>
    </SiteLayout>
  ),
});

const GREENWASH_DEF = "Гринвошинг — это маркетинговый ход, при котором компания создает преувеличенное или ложное впечатление об экологичности и безопасности своей деятельности и продуктов.";

function highlightTerms(text: string): React.ReactNode {
  const parts = text.split(/(гринвошинг[а-яё]*)/giu);
  return parts.map((part, i) =>
    /^гринвошинг/iu.test(part) ? (
      <abbr key={i} title={GREENWASH_DEF} className="underline decoration-dotted decoration-gold cursor-help no-underline-offset">
        {part}
      </abbr>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

/** Простая SVG-схема: узлы по горизонтали, стрелки между ними */
function FlowDiagram({ flow }: { flow: NonNullable<(typeof PATHS)[number]["flowDiagram"]> }) {
  const W = 980;
  const H = 240;
  const padX = 90;
  const n = flow.nodes.length;
  const stepX = (W - padX * 2) / Math.max(n - 1, 1);
  const positions: Record<string, { x: number; y: number }> = {};
  flow.nodes.forEach((node, i) => {
    positions[node.id] = { x: padX + stepX * i, y: H / 2 };
  });

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[760px] h-auto">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill="oklch(0.74 0.10 80)" />
          </marker>
          <linearGradient id="nodeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.96 0.02 82)" />
            <stop offset="100%" stopColor="oklch(0.88 0.04 80)" />
          </linearGradient>
        </defs>
        {flow.edges.map((e, i) => {
          const a = positions[e.from], b = positions[e.to];
          if (!a || !b) return null;
          const sameRow = Math.abs(a.y - b.y) < 1;
          const dir = b.x > a.x ? 1 : -1;
          const startX = a.x + dir * 70;
          const endX = b.x - dir * 70;
          const midY = sameRow && b.x > a.x ? a.y : a.y + 60 * (i % 2 === 0 ? 1 : -1);
          const path = sameRow && b.x > a.x
            ? `M ${startX} ${a.y} L ${endX} ${b.y}`
            : `M ${startX} ${a.y} C ${(startX + endX) / 2} ${midY}, ${(startX + endX) / 2} ${midY}, ${endX} ${b.y}`;
          const labelLines = e.label ? e.label.split("\n") : [];
          const span = sameRow && b.x > a.x ? Math.max(1, Math.round((b.x - a.x) / stepX)) : 1;
          const labelY = sameRow && b.x > a.x ? a.y - (40 + span * 14) : midY - 6;
          return (
            <g key={i}>
              <path d={path} stroke="oklch(0.74 0.10 80)" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" strokeDasharray="2 4" />
              {labelLines.length > 0 && (
                <text
                  x={(startX + endX) / 2}
                  y={labelY}
                  textAnchor="middle"
                  fontSize="9"
                  fill="oklch(0.42 0.10 25)"
                  fontStyle="italic"
                  stroke="oklch(0.96 0.02 82)"
                  strokeWidth="3"
                  paintOrder="stroke"
                  strokeLinejoin="round"
                >
                  {labelLines.map((ln, li) => (
                    <tspan key={li} x={(startX + endX) / 2} dy={li === 0 ? 0 : 11}>{ln}</tspan>
                  ))}
                </text>
              )}
            </g>
          );
        })}
        {flow.nodes.map((node) => {
          const p = positions[node.id];
          return (
            <g key={node.id}>
              <rect x={p.x - 70} y={p.y - 40} width="140" height="80" rx="6"
                fill="url(#nodeGrad)" stroke="oklch(0.42 0.10 25)" strokeWidth="1.5" />
              <text x={p.x} y={p.y - 6} textAnchor="middle" fontSize="13" fontWeight="600" fill="oklch(0.30 0.10 25)">{node.label}</text>
              {node.sub && (
                <text x={p.x} y={p.y + 14} textAnchor="middle" fontSize="10" fill="oklch(0.45 0.05 50)">
                  {node.sub.split("\n").map((ln, li) => (
                    <tspan key={li} x={p.x} dy={li === 0 ? 0 : 11}>{ln}</tspan>
                  ))}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function PathDetail() {
  const { slug } = Route.useParams();
  const PATHS = usePaths();
  const t = useT();
  const item = PATHS.find((p) => p.slug === slug);
  if (!item) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="font-display text-4xl text-bordo">{t("Путь не найден", "Not found")}</h1>
          <Link to="/puti" className="mt-6 inline-block text-gold underline">{t("К списку путей", "Back to paths")}</Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-bordo text-cream relative overflow-hidden">
        <div className="grain absolute inset-0 opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-8 pt-28 pb-16 relative">
          <Link to="/puti" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold hover:text-cream mb-8">
            <ArrowLeft className="h-3.5 w-3.5" /> {t("К путям участия", "Back to paths")}
          </Link>
          <div className="text-[11px] tracking-[0.32em] uppercase text-gold">{t("Путь участия", "Path of participation")}</div>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">{item.title}</h1>
          <p className="mt-6 max-w-2xl text-cream/85 text-lg leading-relaxed">{item.full}</p>

          {item.badges && (
            <div className="mt-8 flex flex-wrap gap-3">
              <Badge icon={<Clock className="h-3.5 w-3.5" />} label={t("Время", "Time")} value={item.badges.time} />
              <Badge icon={<Wallet className="h-3.5 w-3.5" />} label={t("Бюджет", "Budget")} value={item.badges.budget} />
              <Badge icon={<BarChart3 className="h-3.5 w-3.5" />} label={t("Уровень", "Level")} value={item.badges.level} />
            </div>
          )}
        </div>
      </section>

      {/* Зачем это нужно */}
      {item.motivation && (
        <section className="paper-bg border-b border-border/60">
          <div className="container mx-auto px-4 lg:px-8 py-16 grid md:grid-cols-[1fr_1.4fr] gap-10 items-start">
            <div className="bg-card border border-gold/30 p-7 rounded-sm relative">
              <Quote className="h-7 w-7 text-gold absolute -top-3 -left-3 bg-cream rounded-full p-1" />
              <p className="font-display text-xl text-bordo leading-snug italic">{item.motivation.quote}</p>
              {item.motivation.quoteAuthor && (
                <footer className="mt-3 text-sm text-bordo/70 not-italic">— {item.motivation.quoteAuthor}</footer>
              )}
              {item.motivation.quoteSourceUrl && (
                <a
                  href={item.motivation.quoteSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-xs uppercase tracking-[0.22em] text-gold hover:text-bordo transition-colors border-b border-gold/40"
                >
                  {item.motivation.quoteSourceLabel ?? t("Источник", "Source")}
                </a>
              )}
            </div>
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3">{t("Зачем это нужно", "Why this matters")}</div>
              <h2 className="font-display text-3xl text-bordo">{t("Что вы получаете и что меняется", "What you gain and what changes")}</h2>
              <div className="gold-divider my-5 w-12" />
              <ul className="space-y-3">
                {item.motivation.theses.map((t) => (
                  <li key={t} className="flex gap-3 text-foreground/85 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 text-bordo flex-shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Дорожная карта */}
      {item.stepsDetailed && (
        <section className="paper-bg">
          <div className="container mx-auto px-4 lg:px-8 py-16">
            <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3">{t("Дорожная карта", "Roadmap")}</div>
            <h2 className="font-display text-3xl md:text-4xl text-bordo">{t("Пошаговый план", "Step-by-step plan")}</h2>
            <div className="gold-divider my-5 w-12" />

            <ol className="mt-10 relative space-y-8 before:content-[''] before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-gold/30">
              {item.stepsDetailed.map((step, i) => (
                <li key={step.title} className="relative pl-16">
                  <div className="absolute left-0 top-0 h-10 w-10 rounded-full bg-bordo text-cream font-display text-lg grid place-items-center ring-4 ring-cream shadow-md">
                    {i + 1}
                  </div>
                  <div className="bg-card border border-border/60 p-6 rounded-sm">
                    <h3 className="font-display text-2xl text-bordo">{step.title}</h3>
                    <p className="mt-3 text-foreground/85 leading-relaxed">{highlightTerms(step.description)}</p>
                    <div className="mt-5 grid sm:grid-cols-2 gap-5">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-bordo mb-2">
                          <ListChecks className="h-3.5 w-3.5 text-gold" /> {t("Что проверить", "What to check")}
                        </div>
                        <ul className="space-y-1.5">
                          {step.checklist.map((c) => (
                            <li key={c} className="text-sm text-foreground/80 flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-gold flex-shrink-0 mt-1" /><span>{c}</span></li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-bordo mb-2">
                          <FileText className="h-3.5 w-3.5 text-gold" /> {t("Документы", "Documents")}
                        </div>
                        <ul className="space-y-1.5">
                          {step.documents.map((d) => (
                            <li key={d} className="text-sm text-foreground/80 border-l-2 border-gold/40 pl-2.5">{d}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Схема потока помощи */}
      {item.flowDiagram && (
        <section className="bg-[oklch(0.18_0.04_28)] text-cream py-16 border-t border-b border-gold/20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3">{t("Как движется помощь", "How help flows")}</div>
            <h2 className="font-display text-3xl text-cream">{t("Схема потока", "Flow diagram")}</h2>
            <p className="mt-3 text-cream/70 max-w-2xl">{t("Визуальная карта того, как ваша поддержка превращается в реальный результат и кто отвечает за каждый шаг.", "A visual map of how your support turns into real outcomes and who is responsible for each step.")}</p>
            <div className="mt-10 bg-cream/95 rounded-sm p-6 border border-gold/30">
              <FlowDiagram flow={item.flowDiagram} />
            </div>
          </div>
        </section>
      )}

      {/* Правовая основа + налоговая выгода */}
      <section className="paper-bg">
        <div className="container mx-auto px-4 lg:px-8 py-16 grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-card border border-border/60 p-7 rounded-sm">
            <div className="flex items-center gap-3 text-bordo">
              <Scale className="h-5 w-5" />
              <h2 className="font-display text-2xl">{t("Правовая основа", "Legal basis")}</h2>
            </div>
            <div className="gold-divider my-4 w-10" />
            {item.legalDetailed ? (
              <ul className="space-y-4">
                {item.legalDetailed.map((l) => (
                  <li key={l.article} className="border-l-2 border-gold/50 pl-4">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-bordo">{l.law}</div>
                    <div className="font-display text-lg text-foreground mt-0.5">{l.article}</div>
                    <p className="mt-1 text-sm text-foreground/80 leading-relaxed">{l.plain}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-3 text-sm text-foreground/85 leading-relaxed">
                {item.legal.map((s) => <li key={s} className="border-l-2 border-gold/40 pl-3">{s}</li>)}
              </ul>
            )}
          </div>

          {item.taxBenefit && (
            <aside className="bg-gradient-to-br from-[oklch(0.96_0.02_82)] to-[oklch(0.90_0.05_80)] border border-gold/50 p-7 rounded-sm shadow-[0_10px_30px_-15px_oklch(0.4_0.1_60/0.4)]">
              <div className="flex items-center gap-3 text-bordo">
                <Calculator className="h-5 w-5" />
                <h3 className="font-display text-xl">{t("Налоговая выгода", "Tax benefit")}</h3>
              </div>
              <div className="gold-divider my-4 w-10" />
              <div className="text-[11px] uppercase tracking-[0.2em] text-bordo">{item.taxBenefit.title}</div>
              <div className="mt-3 bg-bordo text-cream rounded-sm p-4">
                <div className="font-display text-base leading-snug">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-gold/90 mr-2 align-middle">{t("Пример:", "Example:")}</span>
                  <span className="align-middle">{item.taxBenefit.example}</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-foreground/75 leading-relaxed">
                <span className="font-medium text-bordo">{t("Формула: ", "Formula: ")}</span>{item.taxBenefit.formula}
              </div>
              <div className="mt-3 text-xs text-foreground/70 italic leading-relaxed border-t border-gold/30 pt-3">
                {item.taxBenefit.note}
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* Мошенники + примеры */}
      <section className="paper-bg border-t border-border/60">
        <div className="container mx-auto px-4 lg:px-8 py-16 grid lg:grid-cols-2 gap-8 items-start">
          <div className="bg-card border border-bordo/30 p-7 rounded-sm">
            <div className="flex items-center gap-3 text-bordo">
              <AlertTriangle className="h-5 w-5" />
              <h2 className="font-display text-2xl">{t("Берегитесь мошенников", "Beware of scammers")}</h2>
            </div>
            <div className="gold-divider my-4 w-10" />
            <ul className="space-y-2.5 text-sm text-foreground/85 leading-relaxed">
              {item.scamWarnings.map((s) => (
                <li key={s} className="flex gap-2"><AlertTriangle className="h-3.5 w-3.5 text-bordo flex-shrink-0 mt-1" /><span>{highlightTerms(s)}</span></li>
              ))}
            </ul>
          </div>

          {item.examples && (
            <div className="bg-card border border-border/60 p-7 rounded-sm">
              <div className="flex items-center gap-3 text-bordo">
                <BookOpen className="h-5 w-5" />
                <h2 className="font-display text-2xl">{t("Истории, которые вдохновляют", "Stories that inspire")}</h2>
              </div>
              <div className="gold-divider my-4 w-10" />
              <div className="space-y-5">
                {item.examples.map((ex) => (
                  <div key={ex.title} className="border-l-2 border-gold pl-4">
                    <div className="font-display text-lg text-bordo flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-gold" /> {ex.title}
                    </div>
                    <p className="mt-1 text-sm text-foreground/80 leading-relaxed">{ex.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 lg:px-8 pb-24">
          <div className="bg-bordo text-cream p-10 md:p-14 rounded-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-[11px] tracking-[0.3em] uppercase text-gold">{t("Готовы попробовать?", "Ready to try?")}</div>
              <h3 className="mt-3 font-display text-3xl">{t("Сделать первый шаг", "Take the first step")}</h3>
            </div>
            <Link to="/prichastnost" className="inline-flex items-center px-7 py-3.5 bg-gold text-ink text-xs uppercase tracking-[0.22em] font-medium hover:bg-[oklch(0.79_0.09_82)] transition-colors whitespace-nowrap">
              {t("Связаться с редакцией", "Contact editors")}
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Badge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2.5 bg-cream/10 border border-gold/40 backdrop-blur px-4 py-2 rounded-sm">
      <span className="text-gold">{icon}</span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-gold/85">{label}</span>
      <span className="text-sm text-cream font-medium">{value}</span>
    </div>
  );
}
