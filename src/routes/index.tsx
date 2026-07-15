import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { EraHero } from "@/components/site/EraHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useChronicle, usePersons } from "@/data/content.localized";
import { useT } from "@/i18n/lang";
import { ArrowRight, BookOpen, Map, Users, Star, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import mamontovVideo from "@/assets/videos/mamontov.mp4.asset.json";
import shuvalovVideo from "@/assets/videos/shuvalov.mp4.asset.json";
import soldatenkovVideo from "@/assets/videos/soldatenkov.mp4.asset.json";
import gulievVideo from "@/assets/videos/guliev.mp4.asset.json";
import maecenasVideo from "@/assets/videos/maecenas.mp4.asset.json";
import prokhorovVideo from "@/assets/videos/prokhorov.mp4.asset.json";
import alMamunVideo from "@/assets/videos/al-mamun.mp4.asset.json";
import alchevskayaVideo from "@/assets/videos/alchevskaya.mp4.asset.json";
import carnegieVideo from "@/assets/videos/carnegie.mp4.asset.json";
import nobelVideo from "@/assets/videos/nobel.mp4.asset.json";
import galimzyanovVideo from "@/assets/videos/galimzyanov.mp4.asset.json";
import { resolvePortrait } from "@/lib/media";

const LIVING_FACES = [
  { slug: "maecenas", video: maecenasVideo.url },
  { slug: "al-mamun", video: alMamunVideo.url },
  { slug: "shuvalov", video: shuvalovVideo.url },
  { slug: "prokhorov", video: prokhorovVideo.url },
  { slug: "soldatenkov", video: soldatenkovVideo.url },
  { slug: "mamontov", video: mamontovVideo.url },
  { slug: "alchevskaya", video: alchevskayaVideo.url },
  { slug: "guliev", video: gulievVideo.url },
  { slug: "carnegie", video: carnegieVideo.url },
  { slug: "alfred-nobel", video: nobelVideo.url },
  { slug: "galimzyanov-asgat", video: galimzyanovVideo.url },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Вестник мецената и филантропа — летопись благородных дел" },
      { name: "description", content: "Сетевое издание о меценатах и филантропах России и стран СНГ. История, лица, география и пути благородного участия." },
      { property: "og:title", content: "Вестник мецената и филантропа" },
      { property: "og:description", content: "Летопись благородных дел от Древнего Рима до наших дней." },
    ],
  }),
  component: Home,
});

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-5xl md:text-6xl text-bordo">{value}</div>
      <div className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
    </div>
  );
}

function Home() {
  const t = useT();
  const CHRONICLE = useChronicle();
  const PERSONS = usePersons();
  const HOME_YEARS = [-40, 1755, 1856, 1861, 1910, 2025];
  const recent = HOME_YEARS
    .map((y) => CHRONICLE.find((c) => c.year === y))
    .filter((c): c is (typeof CHRONICLE)[number] => Boolean(c));
  const maecenas = PERSONS.find((p) => p.slug === "maecenas");
  const featured = [
    ...(maecenas ? [maecenas] : []),
    ...PERSONS.filter((p) => p.slug !== "maecenas").slice(0, 3),
  ];
  const livingFaces = LIVING_FACES
    .map((lf) => {
      const person = PERSONS.find((p) => p.slug === lf.slug);
      return person ? { ...lf, person } : null;
    })
    .filter((x): x is { slug: string; video: string; person: (typeof PERSONS)[number] } => Boolean(x));
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const activePerson = livingFaces.find((lf) => lf.video === activeVideo)?.person;

  return (
    <SiteLayout>
      <EraHero />

      {/* Счётчики */}
      <section id="after-hero" className="paper-bg border-b border-border/60">
        <div className="container mx-auto px-4 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
          <Stat value="120+" label={t("Имён в летописи", "Names in the chronicle")} />
          <Stat value="40" label={t("Городов на карте", "Cities on the map")} />
          <Stat value="V" label={t("Эпох щедрости", "Eras of generosity")} />
        </div>
      </section>

      {/* Миссия */}
      <section className="paper-bg">
        <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
          <div className="text-center mx-auto max-w-3xl">
            <SectionHeading
              eyebrow={t("Миссия издания", "Editorial mission")}
              title={t("Сохранить память о тех, кто умножал доброе", "To preserve the memory of those who multiplied the good")}
              center
            />
            <p className="mt-8 text-muted-foreground text-base md:text-lg leading-relaxed text-left">
              {t(
                "«Вестник мецената и филантропа» — это пространство, где частная инициатива обретает голос и смысл. Здесь добро рассматривается не как разовый жест, а как часть большой культурной и общественной традиции — от исторических примеров меценатства до современных практик филантропии. Проект рассказывает о людях, которые превращали личный успех в пользу для общества, поддерживали образование, науку, искусство, здравоохранение, сохраняли память и создавали институции, пережившие своё время. Это летопись поступков, в которых частное участие становится общим достоянием, а личный выбор — вкладом в будущее.",
                "“Patron & Philanthropist Herald” is a space where private initiative finds its voice and meaning. Here, doing good is treated not as a one-off gesture, but as part of a great cultural and civic tradition — from historical examples of patronage to contemporary philanthropic practice. The project tells of people who turned personal success into benefit for society, supporting education, science, art, healthcare, preserving memory and creating institutions that outlived their own time. It is a chronicle of deeds in which private engagement becomes a common heritage, and personal choice — a contribution to the future."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Лица */}
      <section className="ink-bg text-cream relative overflow-hidden">
        <div className="grain absolute inset-0 pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-4">{t("Лица, оставившие свет", "Faces who left light")}</div>
              <h2 className="font-display text-3xl md:text-5xl text-cream leading-tight max-w-2xl">
                {t("Судьбы щедрости — лица меценатов", "Lives of generosity — the faces of patrons")}
              </h2>
              <div className="gold-divider mt-7 w-24" />
            </div>
            <Link to="/litsa" className="inline-flex items-center gap-2 text-gold text-sm tracking-[0.18em] uppercase hover:gap-3 transition-all">
              {t("Все лица", "All faces")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p) => {
              const isOrigin = p.slug === "maecenas";
              return (
                <Link
                  key={p.slug}
                  to="/litsa"
                  className={`group block p-6 transition-colors relative ${
                    isOrigin
                      ? "bg-[oklch(0.24_0.04_60)] border border-gold/60 hover:border-gold shadow-[0_0_40px_-12px_oklch(0.74_0.13_80/0.6)]"
                      : "bg-[oklch(0.22_0.02_50)] border border-cream/10 hover:border-gold/50"
                  }`}
                >
                  {isOrigin && (
                    <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 text-[9px] tracking-[0.18em] uppercase text-gold">
                      <Star className="h-3.5 w-3.5 fill-gold text-gold animate-pulse" />
                      {t("Начало", "The origin")}
                    </div>
                  )}
                  <div className="text-[10px] tracking-[0.22em] uppercase text-gold/80">{p.era}</div>
                  <div className="mt-3 font-display text-2xl text-cream group-hover:text-gold transition-colors">{p.name}</div>
                  <div className="text-xs text-cream/50 mt-1">{p.years} · {p.region}</div>
                  <p className="mt-4 text-sm text-cream/75 leading-relaxed line-clamp-3">{p.short}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Живые лица — видео о меценатах */}
      <section className="paper-bg border-t border-border/60">
        <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
          <SectionHeading
            eyebrow={t("Ожившая история", "History brought to life")}
            title={t("Живые лица", "Living Faces")}
            center
          />
          <p className="mt-6 mx-auto max-w-2xl text-center text-muted-foreground text-base md:text-lg leading-relaxed">
            {t(
              "Их имена сохранила история, их дела — благодарная память. Сегодня их лица оживают вновь.",
              "Their names were preserved by history, their deeds by grateful memory. Today their faces come alive again.",
            )}
          </p>

          <div className="mt-14 grid sm:grid-cols-2 gap-8 items-start">
            {livingFaces.map(({ slug, video, person }) => (
              <div key={slug} className="group flex flex-col">
                <button
                  onClick={() => setActiveVideo(video)}
                  className="block w-full aspect-[4/5] bg-black relative overflow-hidden cursor-pointer group/video"
                >
                  <img
                    src={resolvePortrait(person.portrait)}
                    alt={person.name}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/video:bg-black/50 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover/video:scale-110 transition-transform">
                      <Play className="h-7 w-7 text-white fill-white" />
                    </div>
                  </div>
                </button>
                <div className="mt-5">
                  <div className="text-[10px] tracking-[0.22em] uppercase text-gold">{person.era}</div>
                  <div className="mt-2 font-display text-2xl text-foreground">{person.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{person.years} · {person.region}</div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">{person.short}</p>
                  <Link
                    to="/litsa/$slug"
                    params={{ slug }}
                    className="mt-4 inline-flex items-center gap-2 text-bordo text-xs tracking-[0.18em] uppercase hover:gap-3 transition-all"
                  >
                    {t("Подробнее о меценате", "More about the patron")} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
            <DialogContent className="!w-[95vw] !max-w-none p-0 border-none bg-black overflow-hidden">
              {activeVideo && (
                <div className="flex flex-col">
                  <video
                    controls
                    autoPlay
                    muted
                    playsInline
                    className="w-full aspect-video bg-black"
                  >
                    <source src={activeVideo} type="video/mp4" />
                  </video>
                  {activePerson && (
                    <div className="p-5 bg-black border-t border-white/10">
                      <div className="text-[10px] tracking-[0.22em] uppercase text-gold">{activePerson.era}</div>
                      <div className="mt-1 font-display text-xl text-white">{activePerson.name}</div>
                      <div className="text-xs text-white/50">{activePerson.years} · {activePerson.region}</div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Летопись — последние записи */}
      <section className="paper-bg">
        <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <SectionHeading eyebrow={t("Летопись щедрости", "Chronicle of generosity")} title={t("Летопись благородных дел от Древнего Рима до наших дней", "A chronicle of noble deeds from Ancient Rome to today")} />
            <Link to="/letopis" className="inline-flex items-center gap-2 text-bordo text-sm tracking-[0.18em] uppercase hover:gap-3 transition-all">
              {t("Вся летопись", "Full chronicle")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ol className="relative border-l border-gold/40 ml-4 space-y-10">
            {recent.map((c) => {
              const isOrigin = c.year < 0;
              return (
                <li key={c.year + c.title} className="pl-8 relative">
                  {isOrigin ? (
                    <Star className="absolute -left-[12px] top-0.5 h-5 w-5 fill-gold text-gold animate-pulse drop-shadow-[0_0_8px_oklch(0.74_0.13_80/0.8)]" />
                  ) : (
                    <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-gold border-2 border-background" />
                  )}
                  <div className={`font-display text-3xl text-bordo ${c.year === 1861 || isOrigin ? "font-bold" : ""}`}>
                    {isOrigin ? t("Древний Рим", "Ancient Rome") : c.year}
                  </div>
                  {isOrigin && (
                    <div className="mt-1 inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-gold">
                      <Star className="h-3 w-3 fill-gold text-gold" /> {t("Начало меценатства", "The origin of patronage")}
                    </div>
                  )}
                  <div className={`text-foreground mt-1 ${c.year === 1861 || isOrigin ? "font-bold" : "font-medium"}`}>{c.title}</div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">{c.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Три карточки-разделы */}
      <section className="paper-bg border-t border-border/60">
        <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-3 gap-5">
            <Link to="/azbuka" className="group bg-card border border-border/60 p-8 rounded-sm hover:shadow-[0_20px_60px_-20px_oklch(0.18_0.05_25/0.35)] hover:border-gold/60 transition-all">
              <BookOpen className="h-7 w-7 text-bordo" />
              <div className="mt-5 font-display text-2xl text-foreground">{t("Азбука мецената", "Patron's ABC")}</div>
              <p className="mt-2 text-sm text-muted-foreground">{t("Словарь языка щедрости — от альтруизма до целевого капитала.", "A dictionary of the language of generosity — from altruism to endowment.")}</p>
              <div className="mt-5 text-xs uppercase tracking-[0.2em] text-gold inline-flex items-center gap-2 group-hover:gap-3 transition-all">{t("Читать", "Read")} <ArrowRight className="h-3.5 w-3.5" /></div>
            </Link>
            <Link to="/geografiya" className="group bg-card border border-border/60 p-8 rounded-sm hover:shadow-[0_20px_60px_-20px_oklch(0.18_0.05_25/0.35)] hover:border-gold/60 transition-all">
              <Map className="h-7 w-7 text-bordo" />
              <div className="mt-5 font-display text-2xl text-foreground">{t("География добра", "Geography of good")}</div>
              <p className="mt-2 text-sm text-muted-foreground">{t("Карта городов России и стран СНГ, где жили и творили меценаты.", "A map of cities across Russia and the CIS where patrons lived and worked.")}</p>
              <div className="mt-5 text-xs uppercase tracking-[0.2em] text-gold inline-flex items-center gap-2 group-hover:gap-3 transition-all">{t("Смотреть карту", "Open the map")} <ArrowRight className="h-3.5 w-3.5" /></div>
            </Link>
            <Link to="/prichastnost" className="group bg-bordo text-cream p-8 rounded-sm hover:bg-[oklch(0.30_0.10_25)] transition-all">
              <Users className="h-7 w-7 text-gold" />
              <div className="mt-5 font-display text-2xl">{t("Стать причастным", "Get involved")}</div>
              <p className="mt-2 text-sm text-cream/80">{t("Расскажите свою историю, поддержите проект, станьте автором.", "Share your story, support the project, become an author.")}</p>
              <div className="mt-5 text-xs uppercase tracking-[0.2em] text-gold inline-flex items-center gap-2 group-hover:gap-3 transition-all">{t("Связаться", "Contact us")} <ArrowRight className="h-3.5 w-3.5" /></div>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
