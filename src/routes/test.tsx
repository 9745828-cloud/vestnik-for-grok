import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useT, useLang } from "@/i18n/lang";

export const Route = createFileRoute("/test")({
  head: () => ({
    meta: [
      { title: "Find your path in patronage — test" },
      { name: "description", content: "Seven questions to understand which form of patronage and philanthropy fits you best." },
      { property: "og:title", content: "Find your path in patronage" },
      { property: "og:description", content: "A short test from Vestnik Mecenata." },
    ],
  }),
  component: TestPage,
});

type ResultKey =
  | "personal" | "funds" | "probono" | "endowment" | "corporate"
  | "institutional" | "volunteer" | "material" | "meaningfulDay";

const QUESTIONS_RU: { title: string; answers: { text: string; scores: ResultKey[] }[] }[] = [
  { title: "Что для вас наиболее естественный способ помогать?", answers: [
    { text: "Лично включаться и видеть результат", scores: ["personal", "volunteer"] },
    { text: "Поддерживать системно — через фонды или программы", scores: ["funds", "corporate"] },
    { text: "Делиться опытом, знаниями или профессиональными навыками", scores: ["probono"] },
  ]},
  { title: "Какой горизонт участия вам ближе?", answers: [
    { text: "Здесь и сейчас: помочь в конкретной ситуации", scores: ["material", "personal"] },
    { text: "Долгосрочно: поддержать дело на годы вперёд", scores: ["endowment", "institutional"] },
    { text: "Гибко: участвовать тогда, когда могу быть полезен", scores: ["volunteer", "probono"] },
  ]},
  { title: "Что для вас важнее всего в помощи?", answers: [
    { text: "Человеческая близость и прямой контакт", scores: ["personal"] },
    { text: "Прозрачность, отчётность и проверенные механизмы", scores: ["funds"] },
    { text: "Смысл, который можно передать другим", scores: ["meaningfulDay", "institutional"] },
  ]},
  { title: "Какой ресурс вы готовы вложить в первую очередь?", answers: [
    { text: "Время и личное участие", scores: ["volunteer"] },
    { text: "Средства, вещи, оборудование или помещение", scores: ["material"] },
    { text: "Экспертизу, связи или наставничество", scores: ["probono"] },
  ]},
  { title: "Какой масштаб вам ближе?", answers: [
    { text: "Помочь конкретному человеку, семье или небольшому проекту", scores: ["personal", "material"] },
    { text: "Поддержать фонд или программу с понятной миссией", scores: ["funds", "corporate"] },
    { text: "Создать или укрепить институцию: музей, школу, архив, библиотеку", scores: ["institutional", "endowment"] },
  ]},
  { title: "Если бы вы отмечали важную дату, какой формат выбрали бы?", answers: [
    { text: "Попросить близких сделать пожертвование вместо подарков", scores: ["meaningfulDay"] },
    { text: "Поддержать фонд или сбор от имени семьи или компании", scores: ["funds", "corporate"] },
    { text: "Организовать личное доброе дело или волонтёрскую акцию", scores: ["volunteer", "personal"] },
  ]},
  { title: "Какой образ меценатства вам ближе?", answers: [
    { text: "Живое участие — быть рядом с теми, кому нужна помощь", scores: ["personal", "volunteer"] },
    { text: "Устойчивая система — чтобы помощь работала долго", scores: ["endowment", "funds"] },
    { text: "Наследие — дело, которое останется после нас", scores: ["institutional", "meaningfulDay"] },
  ]},
];

const QUESTIONS_EN: { title: string; answers: { text: string; scores: ResultKey[] }[] }[] = [
  { title: "What is the most natural way for you to help?", answers: [
    { text: "Get personally involved and see the result", scores: ["personal", "volunteer"] },
    { text: "Support systemically — through foundations or programs", scores: ["funds", "corporate"] },
    { text: "Share experience, knowledge or professional skills", scores: ["probono"] },
  ]},
  { title: "Which time horizon of involvement is closer to you?", answers: [
    { text: "Here and now: help in a specific situation", scores: ["material", "personal"] },
    { text: "Long-term: support a cause for years to come", scores: ["endowment", "institutional"] },
    { text: "Flexibly: take part whenever I can be useful", scores: ["volunteer", "probono"] },
  ]},
  { title: "What matters most to you in helping?", answers: [
    { text: "Human closeness and direct contact", scores: ["personal"] },
    { text: "Transparency, accountability and proven mechanisms", scores: ["funds"] },
    { text: "Meaning that can be passed on to others", scores: ["meaningfulDay", "institutional"] },
  ]},
  { title: "Which resource are you ready to invest first?", answers: [
    { text: "Time and personal involvement", scores: ["volunteer"] },
    { text: "Money, goods, equipment or premises", scores: ["material"] },
    { text: "Expertise, connections or mentorship", scores: ["probono"] },
  ]},
  { title: "Which scale is closer to you?", answers: [
    { text: "Help a specific person, family or small project", scores: ["personal", "material"] },
    { text: "Support a foundation or program with a clear mission", scores: ["funds", "corporate"] },
    { text: "Build or strengthen an institution: museum, school, archive, library", scores: ["institutional", "endowment"] },
  ]},
  { title: "If you were marking an important date, which format would you choose?", answers: [
    { text: "Ask loved ones to donate instead of giving gifts", scores: ["meaningfulDay"] },
    { text: "Support a foundation or fundraiser on behalf of family or company", scores: ["funds", "corporate"] },
    { text: "Organize a personal good deed or volunteer action", scores: ["volunteer", "personal"] },
  ]},
  { title: "Which image of patronage is closer to you?", answers: [
    { text: "Living involvement — being beside those who need help", scores: ["personal", "volunteer"] },
    { text: "A sustainable system — so that help works long-term", scores: ["endowment", "funds"] },
    { text: "A legacy — a cause that outlasts us", scores: ["institutional", "meaningfulDay"] },
  ]},
];

const RESULTS_RU: Record<ResultKey, { title: string; text: string }> = {
  personal: { title: "Личное участие", text: "Вам близка помощь, в которой есть человеческий контакт, доверие и видимый результат. Ваш путь — поддержка конкретных людей, семей или небольших инициатив." },
  funds: { title: "Через фонды", text: "Вы выбираете проверенные механизмы, прозрачность и системную работу. Ваш путь — поддержка фондов с понятной миссией и отчётностью." },
  probono: { title: "Pro bono и наставничество", text: "Ваш главный ресурс — опыт, знания и профессиональные навыки. Ваш путь — помогать через экспертизу, консультации и сопровождение." },
  endowment: { title: "Целевой капитал", text: "Вы мыслите долгосрочно и хотите, чтобы помощь работала не один день, а годы. Ваш путь — вклады, которые создают устойчивость для культурных, образовательных и социальных институций." },
  corporate: { title: "Корпоративная филантропия", text: "Вам близка идея объединять ресурсы команды, бизнеса или сообщества. Ваш путь — системные программы, гранты, партнёрства и корпоративное волонтёрство." },
  institutional: { title: "Институциональное меценатство", text: "Вам важно не просто поддержать отдельное дело, а создать среду и наследие. Ваш путь — участие в развитии музеев, школ, архивов, библиотек и других общественно значимых институций." },
  volunteer: { title: "Волонтёрство", text: "Ваш вклад — это время, внимание и личная энергия. Ваш путь — быть рядом, включаться в процессы и помогать делом." },
  material: { title: "Материальная помощь", text: "Вы предпочитаете конкретную и практическую поддержку: вещи, оборудование, пространство или другие ресурсы, которые нужны здесь и сейчас." },
  meaningfulDay: { title: "День с добрым смыслом", text: "Вам близко превращать личные события в возможность помочь другим. Ваш путь — благотворительные дни рождения, памятные даты и адресные сборы вместо подарков." },
};

const RESULTS_EN: Record<ResultKey, { title: string; text: string }> = {
  personal: { title: "Personal involvement", text: "You value help with human contact, trust and a visible result. Your path is supporting specific people, families or small initiatives." },
  funds: { title: "Through foundations", text: "You choose proven mechanisms, transparency and systemic work. Your path is supporting foundations with a clear mission and accountability." },
  probono: { title: "Pro bono and mentorship", text: "Your main resource is experience, knowledge and professional skills. Your path is helping through expertise, advice and guidance." },
  endowment: { title: "Endowment", text: "You think long-term and want help to work for years, not a single day. Your path is contributions that sustain cultural, educational and social institutions." },
  corporate: { title: "Corporate philanthropy", text: "You like the idea of pooling resources of a team, business or community. Your path is systemic programs, grants, partnerships and corporate volunteering." },
  institutional: { title: "Institutional patronage", text: "It matters to you not just to support a single cause but to create environment and legacy. Your path is helping museums, schools, archives, libraries and other socially significant institutions." },
  volunteer: { title: "Volunteering", text: "Your contribution is time, attention and personal energy. Your path is being present, joining processes and helping through action." },
  material: { title: "Material help", text: "You prefer concrete, practical support: goods, equipment, space or other resources needed here and now." },
  meaningfulDay: { title: "A day with meaning", text: "You like turning personal events into a chance to help others. Your path is charitable birthdays, memorable dates and targeted fundraisers instead of gifts." },
};

type Stage = "start" | "quiz" | "result";

function TestPage() {
  const t = useT();
  const lang = useLang();
  const QUESTIONS = lang === "en" ? QUESTIONS_EN : QUESTIONS_RU;
  const RESULTS = lang === "en" ? RESULTS_EN : RESULTS_RU;
  const [stage, setStage] = useState<Stage>("start");
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});

  const start = () => { setStage("quiz"); setCurrent(0); setScores({}); };
  const restart = () => { setStage("start"); setCurrent(0); setScores({}); };

  const select = (keys: ResultKey[]) => {
    const next = { ...scores };
    keys.forEach((k) => { next[k] = (next[k] || 0) + 1; });
    setScores(next);
    if (current + 1 < QUESTIONS.length) setCurrent(current + 1);
    else setStage("result");
  };

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const mainKey = sorted[0]?.[0] as ResultKey | undefined;
  const secondKey = sorted[1]?.[0] as ResultKey | undefined;

  return (
    <SiteLayout>
      <PageHero
        eyebrow={t("Тест", "Test")}
        title={t("Найдите свой путь в меценатстве", "Find your path in patronage")}
        intro={t("Ответьте на несколько вопросов, чтобы понять, какие сферы и формы участия ближе именно вам.", "Answer a few questions to see which areas and forms of involvement suit you best.")}
      />

      <section className="paper-bg">
        <div className="container mx-auto px-4 lg:px-8 py-20 md:py-24 max-w-3xl">
          {stage === "start" && (
            <div className="bg-card border border-border/60 p-10 md:p-14 rounded-sm text-center">
              <div className="text-[11px] tracking-[0.3em] uppercase text-gold">{t("7 вопросов · 2 минуты", "7 questions · 2 minutes")}</div>
              <h2 className="mt-4 font-display text-3xl md:text-4xl text-bordo">{t("Начнём?", "Shall we begin?")}</h2>
              <p className="mt-5 text-foreground/80 leading-relaxed max-w-xl mx-auto">
                {t("Тест поможет определить подходящие формы участия — от личной помощи до институционального меценатства.", "The test helps identify suitable forms of involvement — from personal help to institutional patronage.")}
              </p>
              <button
                onClick={start}
                className="mt-8 inline-flex items-center px-8 py-4 bg-bordo text-cream text-xs uppercase tracking-[0.22em] hover:bg-[oklch(0.30_0.10_25)] transition-colors"
              >
                {t("Пройти тест", "Take the test")}
              </button>
            </div>
          )}

          {stage === "quiz" && (
            <div className="bg-card border border-border/60 p-8 md:p-12 rounded-sm">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-gold">
                <span>{t("Вопрос", "Question")} {current + 1} {t("из", "of")} {QUESTIONS.length}</span>
                <span>{Math.round(((current) / QUESTIONS.length) * 100)}%</span>
              </div>
              <div className="mt-3 h-1 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full bg-gold transition-all duration-500" style={{ width: `${((current) / QUESTIONS.length) * 100}%` }} />
              </div>
              <h2 className="mt-8 font-display text-2xl md:text-3xl text-bordo leading-snug">
                {QUESTIONS[current].title}
              </h2>
              <div className="mt-8 grid gap-3">
                {QUESTIONS[current].answers.map((a) => (
                  <button
                    key={a.text}
                    onClick={() => select(a.scores)}
                    className="text-left px-6 py-4 border border-border/70 hover:border-gold hover:bg-cream rounded-sm transition-colors text-foreground/85 leading-relaxed"
                  >
                    {a.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {stage === "result" && mainKey && (
            <div className="bg-card border border-border/60 p-8 md:p-12 rounded-sm">
              <div className="text-[11px] tracking-[0.3em] uppercase text-gold">{t("Ваш результат", "Your result")}</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-bordo">{RESULTS[mainKey].title}</h2>
              <p className="mt-5 text-foreground/85 leading-relaxed">{RESULTS[mainKey].text}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[mainKey, secondKey].filter(Boolean).map((k) => (
                  <span key={k as string} className="text-[11px] uppercase tracking-[0.22em] text-bordo border border-gold/60 bg-cream px-3 py-1.5 rounded-sm">
                    {RESULTS[k as ResultKey].title}
                  </span>
                ))}
              </div>

              {secondKey && (
                <div className="mt-8 pt-8 border-t border-border/60">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold">{t("Дополнительный путь", "Additional path")}</div>
                  <h3 className="mt-2 font-display text-2xl text-foreground">{RESULTS[secondKey].title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{RESULTS[secondKey].text}</p>
                </div>
              )}

              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="/puti" className="inline-flex items-center px-6 py-3 bg-bordo text-cream text-xs uppercase tracking-[0.22em] hover:bg-[oklch(0.30_0.10_25)] transition-colors">
                  {t("Подобрать проекты", "Find projects")}
                </Link>
                <button onClick={restart} className="inline-flex items-center px-6 py-3 border border-gold/70 text-bordo text-xs uppercase tracking-[0.22em] hover:bg-cream transition-colors">
                  {t("Пройти заново", "Try again")}
                </button>
              </div>

              <p className="mt-10 text-sm text-muted-foreground italic leading-relaxed border-l-2 border-gold/50 pl-5">
                {t("Редакция «Вестника мецената» поможет найти проверенные проекты и сделать первый осмысленный шаг.", "The Vestnik Mecenata editorial team will help you find vetted projects and take a first meaningful step.")}
              </p>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}