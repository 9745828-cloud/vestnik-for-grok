import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import heroPrichastnost from "@/assets/hero-prichastnost.jpg";
import { PageHero } from "@/components/site/PageHero";
import { z } from "zod";
import { useT } from "@/i18n/lang";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/prichastnost")({
  head: () => ({
    meta: [
      { title: "Искусство быть причастным — Вестник мецената и филантропа" },
      { name: "description", content: "Расскажите свою историю, предложите героя, поддержите проект или станьте автором «Вестника»." },
      { property: "og:title", content: "Искусство быть причастным" },
      { property: "og:description", content: "Связаться с редакцией «Вестника мецената»." },
    ],
  }),
  component: Prichastnost,
});

const schema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(80, "Слишком длинно"),
  email: z.string().trim().email("Неверный e-mail").max(160),
  type: z.enum(["story", "hero", "support", "author"]),
  message: z.string().trim().min(10, "Расскажите чуть подробнее").max(2000, "Не более 2000 символов"),
});

const TYPES = [
  { id: "story", label: "Рассказать свою историю", labelEn: "Share your story" },
  { id: "hero", label: "Предложить героя", labelEn: "Suggest a hero" },
  { id: "support", label: "Поддержать проект", labelEn: "Support the project" },
  { id: "author", label: "Стать автором", labelEn: "Become an author" },
] as const;

function Prichastnost() {
  const tr = useT();
  const [type, setType] = useState<(typeof TYPES)[number]["id"]>("story");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      type,
      message: String(fd.get("message") ?? ""),
    };
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    // Без бэкенда — сохраняем локально, чтобы редакция могла собрать вручную при подключении базы
    try {
      const stored = JSON.parse(localStorage.getItem("vm_submissions") || "[]");
      stored.push({ ...result.data, at: new Date().toISOString() });
      localStorage.setItem("vm_submissions", JSON.stringify(stored));
    } catch { /* noop */ }
    setSubmitted(true);
    e.currentTarget.reset();
  };

  return (
    <SiteLayout>
      <PageHero image={heroPrichastnost}
        eyebrow={tr("Искусство быть причастным", "The art of being involved")}
        title={tr("У каждой большой истории есть тот, кто её рассказал", "Every great story has someone who told it")}
        intro={tr(
          "«Вестник» живёт благодаря читателям. Напишите нам — расскажите семейную историю щедрости, предложите героя, поддержите редакцию или станьте её соавтором.",
          "The Herald lives thanks to its readers. Write to us — share a family story, suggest a hero, support the editors or become a co-author."
        )}
      />

      <section className="paper-bg">
        <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28 max-w-3xl">
          {submitted ? (
            <div className="bg-card border border-gold/60 rounded-sm p-10 md:p-14 text-center">
              <CheckCircle2 className="h-12 w-12 text-gold mx-auto" />
              <h2 className="mt-5 font-display text-3xl text-bordo">{tr("Спасибо — мы получили ваше сообщение", "Thank you — we have received your message")}</h2>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                {tr("Редакция «Вестника» внимательно прочитает каждое письмо и обязательно ответит. Иногда это занимает несколько дней — простите за ожидание.", "The Herald's editors will read every letter carefully and will reply. It sometimes takes a few days — thank you for your patience.")}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-8 inline-flex items-center px-6 py-3 bg-bordo text-cream text-xs uppercase tracking-[0.22em] hover:bg-[oklch(0.30_0.10_25)] transition-colors"
              >
                {tr("Написать ещё", "Write again")}
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="bg-card border border-border/60 rounded-sm p-7 md:p-10 space-y-7" noValidate>
              <div>
                <label className="block text-[11px] tracking-[0.25em] uppercase text-gold mb-3">{tr("Цель обращения", "Purpose of inquiry")}</label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`text-left px-4 py-3 border text-sm transition-colors ${
                        type === t.id
                          ? "bg-bordo text-cream border-bordo"
                          : "border-border/60 text-foreground/80 hover:border-gold hover:text-bordo"
                      }`}
                    >
                      {tr(t.label, t.labelEn)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-[11px] tracking-[0.25em] uppercase text-gold mb-2">{tr("Имя", "Name")}</label>
                  <input
                    id="name"
                    name="name"
                    maxLength={80}
                    className="w-full bg-transparent border border-border/70 focus:border-gold outline-none px-4 py-3 text-foreground"
                    placeholder={tr("Как к вам обращаться", "How should we address you")}
                  />
                  {errors.name && <p className="mt-2 text-xs text-destructive">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-[11px] tracking-[0.25em] uppercase text-gold mb-2">E-mail</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    maxLength={160}
                    className="w-full bg-transparent border border-border/70 focus:border-gold outline-none px-4 py-3 text-foreground"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="mt-2 text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-[11px] tracking-[0.25em] uppercase text-gold mb-2">{tr("Сообщение", "Message")}</label>
                <textarea
                  id="message"
                  name="message"
                  rows={7}
                  maxLength={2000}
                  className="w-full bg-transparent border border-border/70 focus:border-gold outline-none px-4 py-3 text-foreground leading-relaxed resize-y"
                  placeholder={tr("Расскажите свою историю, имя героя или замысел…", "Share your story, suggest a hero, or describe your idea…")}
                />
                {errors.message && <p className="mt-2 text-xs text-destructive">{errors.message}</p>}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                <p className="text-xs text-muted-foreground italic">
                  {tr("Нажимая «Отправить», вы соглашаетесь с тем, что редакция может связаться с вами по указанному адресу.", "By clicking Send, you agree that the editors may contact you at the address provided.")}
                </p>
                <button
                  type="submit"
                  className="px-7 py-3.5 bg-bordo text-cream text-xs uppercase tracking-[0.22em] hover:bg-[oklch(0.30_0.10_25)] transition-colors whitespace-nowrap"
                >
                  {tr("Отправить", "Send")}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
