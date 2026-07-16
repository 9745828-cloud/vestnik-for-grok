import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, X as XIcon } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { type QuizQuestion } from "@/data/quiz";
import { useQuiz, useLevels } from "@/data/quiz.localized";
import { useT } from "@/i18n/lang";
import heroKod from "@/assets/hero-kod.jpg";

export const Route = createFileRoute("/kod")({
  head: () => ({
    meta: [
      { title: "Код мецената — тест для посвящённых" },
      {
        name: "description",
        content:
          "Квиз «Вестника мецената»: 15 вопросов о меценатах, эпохах и наследии. Разгадайте код мецената.",
      },
      { property: "og:title", content: "Код мецената — тест для посвящённых" },
      { property: "og:description", content: "Квиз для внимательных читателей «Вестника мецената»." },
    ],
  }),
  component: KodPage,
});

type Stage = "start" | "quiz" | "result";
type Answer = number[]; // selected option indices

function splitLinkTarget(to: string) {
  const [pathname, hash] = to.split("#");
  return {
    pathname: pathname || "/",
    hash: hash || undefined,
  };
}

function arraysEqual(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.every((v, i) => v === sb[i]);
}

function isCorrect(q: QuizQuestion, answer: Answer): boolean {
  if (q.kind === "single") return answer.length === 1 && answer[0] === q.correct;
  return arraysEqual(answer, q.correct);
}

function readPersisted(): { stage: Stage; current: number; answers: Answer[] } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("kod-quiz-state");
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || typeof s !== "object") return null;
    return {
      stage: (s.stage as Stage) ?? "start",
      current: typeof s.current === "number" ? s.current : 0,
      answers: Array.isArray(s.answers) ? s.answers : [],
    };
  } catch {
    return null;
  }
}

function KodPage() {
  const QUIZ = useQuiz();
  const LEVELS = useLevels();
  const t = useT();
  const [stage, setStage] = useState<Stage>("start");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [draft, setDraft] = useState<Answer>([]);
  const [revealed, setRevealed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persisted = readPersisted();
    if (persisted) {
      setStage(persisted.stage);
      setCurrent(persisted.current);
      setAnswers(persisted.answers);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(
        "kod-quiz-state",
        JSON.stringify({ stage, current, answers }),
      );
    } catch {}
  }, [hydrated, stage, current, answers]);

  const total = QUIZ.length;
  const q = QUIZ[current];

  const score = useMemo(
    () => answers.reduce((s, a, i) => s + (isCorrect(QUIZ[i], a) ? 1 : 0), 0),
    [answers],
  );
  const level = useMemo(
    () => LEVELS.find((l) => score >= l.min && score <= l.max) ?? LEVELS[0],
    [score],
  );

  const start = () => {
    setStage("quiz");
    setCurrent(0);
    setAnswers([]);
    setDraft([]);
    setRevealed(false);
  };

  const toggle = (idx: number) => {
    if (revealed) return;
    if (q.kind === "single") {
      setDraft([idx]);
    } else {
      setDraft((prev) => (prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx]));
    }
  };

  const confirm = () => {
    if (draft.length === 0) return;
    setRevealed(true);
  };

  const next = () => {
    const newAnswers = [...answers, draft];
    setAnswers(newAnswers);
    setDraft([]);
    setRevealed(false);
    if (current + 1 < total) {
      setCurrent(current + 1);
    } else {
      setStage("result");
    }
  };

  const restart = () => {
    setStage("start");
    setCurrent(0);
    setAnswers([]);
    setDraft([]);
    setRevealed(false);
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow={t("Квиз · Тест для посвящённых", "Quiz · Test for the initiated")}
        title={t("Код мецената", "The Patron's Code")}
        intro={t("Квиз для внимательных читателей портала и своеобразное посвящение в историю добрых дел. Проверьте, насколько хорошо вы знаете меценатов, благотворительные традиции и инициативы, ставшие частью культурной памяти.", "A quiz for attentive readers of the portal and a kind of initiation into the history of good deeds. Test how well you know patrons, charitable traditions, and initiatives that became part of cultural memory.")}
        quote={t("Чем человек умнее и добрее, тем больше он замечает добра.", "The smarter and kinder a person is, the more good they notice.")}
        author={t("Б. Паскаль", "B. Pascal")}
        image={heroKod}
        imageAlt={t("Антикварная рукопись с печатью и пером — символ кода мецената", "Antique manuscript with seal and quill — symbol of the patron's code")}
      />

      <section className="paper-bg">
        <div className="container mx-auto px-4 lg:px-8 py-20 md:py-24 max-w-3xl">
          {hydrated && stage === "start" && (
            <div className="bg-card border border-border/60 p-10 md:p-14 rounded-sm text-center">
              <div className="text-[11px] tracking-[0.3em] uppercase text-gold">
                {total} {t("вопросов · 5 минут · неограниченные попытки", "questions · 5 minutes · unlimited attempts")}
              </div>
              <h2 className="mt-4 font-display text-3xl md:text-4xl text-bordo">
                {t("Готовы разгадать код мецената?", "Ready to crack the patron's code?")}
              </h2>
              <p className="mt-5 text-foreground/80 leading-relaxed max-w-xl mx-auto">
                {t("Вас ждут вопросы разных типов: выбрать один или несколько верных ответов, узнать мецената по портрету, определить эпоху и форму участия. После каждого ответа — разбор. В конце — ваш уровень и ссылки на материалы портала.", "You'll face questions of different kinds: choose one or several correct answers, identify a patron by portrait, name the era and form of participation. Each answer is followed by an explanation. At the end — your level and links to portal materials.")}
              </p>
              <button
                onClick={start}
                className="mt-8 inline-flex items-center px-8 py-4 bg-bordo text-cream text-xs uppercase tracking-[0.22em] hover:bg-[oklch(0.30_0.10_25)] transition-colors"
              >
                {t("Начать испытание", "Start the challenge")}
              </button>
            </div>
          )}

          {hydrated && stage === "quiz" && (
            <div className="bg-card border border-border/60 p-8 md:p-12 rounded-sm">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-gold">
                <span>
                  {t("Вопрос", "Question")} {current + 1} {t("из", "of")} {total}
                </span>
                <span>{q.kind === "multi" ? t("Несколько ответов", "Multiple answers") : t("Один ответ", "Single answer")}</span>
              </div>
              <div className="mt-3 h-1 w-full bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-500"
                  style={{ width: `${(current / total) * 100}%` }}
                />
              </div>

              <h2 className="mt-8 font-display text-2xl md:text-3xl text-bordo leading-snug">
                {q.question}
              </h2>

              {q.kind === "single" && q.image && (
                <div className="mt-6 flex justify-center">
                  <img
                    src={q.image}
                    alt={q.imageAlt ?? ""}
                    className="max-h-72 w-auto rounded-sm border border-border/60"
                    style={{ filter: "sepia(0.18) saturate(0.92) contrast(1.02)" }}
                  />
                </div>
              )}

              <div className="mt-8 grid gap-3">
                {q.options.map((opt, idx) => {
                  const selected = draft.includes(idx);
                  const correctSet =
                    q.kind === "single" ? [q.correct] : q.correct;
                  const isRight = correctSet.includes(idx);
                  let cls =
                    "text-left px-6 py-4 border rounded-sm transition-colors text-foreground/85 leading-relaxed flex items-start gap-3";
                  if (revealed) {
                    if (isRight) {
                      cls +=
                        " border-[oklch(0.55_0.15_145)] bg-[oklch(0.95_0.05_145)] text-foreground";
                    } else if (selected) {
                      cls += " border-bordo bg-[oklch(0.95_0.04_25)] text-bordo";
                    } else {
                      cls += " border-border/70 opacity-60";
                    }
                  } else {
                    cls += selected
                      ? " border-gold bg-cream"
                      : " border-border/70 hover:border-gold hover:bg-cream";
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggle(idx)}
                      className={cls}
                      disabled={revealed}
                    >
                      <span
                        className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center border border-current text-[11px] ${
                          q.kind === "single" ? "rounded-full" : "rounded-sm"
                        }`}
                        aria-hidden
                      >
                        {revealed && isRight ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : revealed && selected ? (
                          <XIcon className="h-3.5 w-3.5" />
                        ) : selected ? (
                          q.kind === "single" ? (
                            <span className="h-2 w-2 rounded-full bg-current" />
                          ) : (
                            "✓"
                          )
                        ) : (
                          ""
                        )}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {revealed && (
                <div
                  className={`mt-6 p-5 rounded-sm border text-sm leading-relaxed ${
                    isCorrect(q, draft)
                      ? "border-[oklch(0.55_0.15_145)] bg-[oklch(0.96_0.04_145)] text-foreground"
                      : "border-bordo/50 bg-[oklch(0.96_0.03_25)] text-foreground"
                  }`}
                >
                  <div className="text-[11px] uppercase tracking-[0.22em] mb-2 text-bordo">
                    {isCorrect(q, draft) ? t("Верно", "Correct") : t("Неверно", "Incorrect")}
                  </div>
                  {q.explain}
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {q.kind === "multi"
                    ? t("Отметьте все подходящие варианты", "Mark all that apply")
                    : t("Выберите один вариант", "Choose one option")}
                </div>
                {!revealed ? (
                  <button
                    onClick={confirm}
                    disabled={draft.length === 0}
                    className="inline-flex items-center px-6 py-3 bg-bordo text-cream text-xs uppercase tracking-[0.22em] hover:bg-[oklch(0.30_0.10_25)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t("Ответить", "Answer")}
                  </button>
                ) : (
                  <button
                    onClick={next}
                    className="inline-flex items-center px-6 py-3 bg-bordo text-cream text-xs uppercase tracking-[0.22em] hover:bg-[oklch(0.30_0.10_25)] transition-colors"
                  >
                    {current + 1 < total ? t("Следующий вопрос", "Next question") : t("Подвести итог", "Finish")}
                  </button>
                )}
              </div>
            </div>
          )}

          {hydrated && stage === "result" && (
            <div className="bg-card border border-border/60 p-8 md:p-12 rounded-sm">
              <div className="text-[11px] tracking-[0.3em] uppercase text-gold">{t("Итог", "Result")}</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-bordo">
                {level.title}
              </h2>
              <div className="mt-2 text-foreground/70">
                {t("Правильных ответов:", "Correct answers:")} <span className="font-semibold text-bordo">{score}</span> {t("из", "of")} {total}
              </div>
              <p className="mt-5 text-foreground/85 leading-relaxed max-w-2xl">{level.text}</p>

              {level.links.length > 0 && (
                <div className="mt-8">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-gold mb-3">
                    {t("Рекомендуем", "Recommended")}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
                    {level.links.map((l) => {
                      const target = splitLinkTarget(l.to);
                      return (
                        <Link
                          key={l.to}
                          to={target.pathname}
                          hash={target.hash}
                          className="group flex items-center justify-between gap-3 rounded-sm border border-gold/50 bg-cream/80 px-5 py-4 text-bordo transition-colors hover:border-gold hover:bg-ivory"
                        >
                          <span className="font-display text-base md:text-lg leading-snug">
                            {l.label}
                          </span>
                          <span className="shrink-0 text-gold transition-transform group-hover:translate-x-0.5" aria-hidden>
                            →
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-10 pt-8 border-t border-border/60">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">
                  {t("Разбор ответов", "Answer review")}
                </div>
                <div className="mt-5 grid gap-5">
                  {QUIZ.map((qq, i) => {
                    const a = answers[i] ?? [];
                    const ok = isCorrect(qq, a);
                    const correctList =
                      qq.kind === "single" ? [qq.correct] : qq.correct;
                    return (
                      <div
                        key={qq.id}
                        className="border border-border/60 rounded-sm p-5 bg-ivory/40"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-cream ${
                              ok ? "bg-[oklch(0.55_0.15_145)]" : "bg-bordo"
                            }`}
                          >
                            {ok ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <XIcon className="h-3.5 w-3.5" />
                            )}
                          </span>
                          <div className="flex-1">
                            <div className="font-display text-lg text-foreground leading-snug">
                              {i + 1}. {qq.question}
                            </div>
                            <div className="mt-2 text-sm text-foreground/80">
                              <span className="text-muted-foreground">{t("Правильно: ", "Correct: ")}</span>
                              {correctList.map((idx) => qq.options[idx]).join(", ")}
                            </div>
                            {!ok && a.length > 0 && (
                              <div className="text-sm text-bordo/80">
                                <span className="text-muted-foreground">{t("Ваш ответ: ", "Your answer: ")}</span>
                                {a.map((idx) => qq.options[idx]).join(", ")}
                              </div>
                            )}
                            <div className="mt-2 text-sm text-foreground/75 leading-relaxed">
                              {qq.explain}
                            </div>
                            {qq.link && (
                              <Link
                                to={splitLinkTarget(qq.link.to).pathname}
                                hash={splitLinkTarget(qq.link.to).hash}
                                className="mt-3 inline-flex items-center text-[11px] uppercase tracking-[0.22em] text-bordo border-b border-gold/60 hover:border-bordo"
                              >
                                {qq.link.label} →
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-border/60 space-y-6">
                <div>
                  <button
                    onClick={restart}
                    className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-3.5 bg-bordo text-cream text-xs uppercase tracking-[0.2em] hover:bg-[oklch(0.30_0.10_25)] transition-colors"
                  >
                    {t("Пройти заново", "Try again")}
                  </button>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-gold mb-3">
                    {t("Продолжить чтение", "Continue reading")}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(
                      [
                        { to: "/azbuka", label: t("Азбука мецената", "Patron's ABC") },
                        { to: "/litsa", label: t("Лица", "Faces") },
                        { to: "/nasledie", label: t("Наследие", "Legacy") },
                        { to: "/puti", label: t("Пути участия", "Paths") },
                        { to: "/geografiya", label: t("География добра", "Geography of good") },
                        { to: "/letopis", label: t("Летопись", "Chronicle") },
                      ] as const
                    ).map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="group flex items-center justify-between gap-3 rounded-sm border border-border/70 bg-card px-4 py-3.5 text-sm text-foreground/85 transition-colors hover:border-gold hover:text-bordo hover:bg-cream/60"
                      >
                        <span className="leading-snug">{item.label}</span>
                        <span className="shrink-0 text-gold/80 text-xs transition-transform group-hover:translate-x-0.5" aria-hidden>
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}