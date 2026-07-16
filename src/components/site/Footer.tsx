import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-vm.png";
import { useT } from "@/i18n/lang";

export function Footer() {
  const t = useT();
  const brand = t("Вестник мецената и филантропа", "Patron & Philanthropist Herald");
  const subtitle = t("Летопись благородных дел", "Chronicle of noble deeds");
  const about = t(
    "Сетевое издание о людях, которые из века в век делают мир лучше — словом, делом и щедростью.",
    "An online publication about people who, century after century, make the world better — through word, deed, and generosity.",
  );

  return (
    <footer className="ink-bg text-cream/85 mt-24">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-70" />
      <div className="container mx-auto px-4 lg:px-8 py-14 md:py-16">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10">
          {/* Бренд: вертикальная колонна — логотип → название → девиз → описание */}
          <div className="lg:col-span-5 max-w-md">
            <Link to="/" className="group inline-flex flex-col items-start gap-0">
              <img
                src={logo}
                alt={brand}
                className="h-14 w-auto rounded-sm opacity-95 group-hover:opacity-100 transition-opacity"
              />
              <div className="mt-5 font-display text-2xl md:text-[1.65rem] leading-snug text-cream tracking-tight group-hover:text-gold transition-colors">
                {brand}
              </div>
              <div className="mt-3 flex items-center gap-2.5 text-[10px] tracking-[0.28em] uppercase text-gold/85">
                <span className="h-px w-7 bg-gold/55 shrink-0" aria-hidden />
                {subtitle}
              </div>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-cream/65 max-w-[22rem] border-s border-gold/25 ps-4">
              {about}
            </p>
          </div>

          <div className="lg:col-span-2">
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-4">{t("Разделы", "Sections")}</div>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/mission" className="hover:text-gold transition-colors">{t("Миссия", "Mission")}</Link></li>
              <li><Link to="/azbuka" className="hover:text-gold transition-colors">{t("Азбука мецената", "Patron's ABC")}</Link></li>
              <li><Link to="/letopis" className="hover:text-gold transition-colors">{t("Летопись щедрости", "Chronicle of generosity")}</Link></li>
              <li><Link to="/litsa" className="hover:text-gold transition-colors">{t("Лица, оставившие свет", "Faces who left light")}</Link></li>
              <li><Link to="/nasledie" className="hover:text-gold transition-colors">{t("Наследие", "Legacy")}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-4">{t("Участие", "Get involved")}</div>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/puti" className="hover:text-gold transition-colors">{t("Пути благородного участия", "Paths of noble participation")}</Link></li>
              <li><Link to="/geografiya" className="hover:text-gold transition-colors">{t("География добра", "Geography of good")}</Link></li>
              <li><Link to="/prichastnost" className="hover:text-gold transition-colors">{t("Искусство быть причастным", "The art of being involved")}</Link></li>
              <li><Link to="/puls" className="hover:text-gold transition-colors">{t("Пульс времени и перемен", "Pulse of time and change")}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-4">{t("Контакты", "Contacts")}</div>
            <p className="text-sm text-cream/70">{t("Москва, Россия", "Moscow, Russia")}</p>
            <p className="text-sm text-cream/70 mt-1 break-all">redaktsiya@vestnik-mecenata.ru</p>

            <blockquote className="mt-7 max-w-[22rem] border-s border-gold/25 ps-4">
              <p className="text-sm leading-relaxed text-cream/65 italic">
                {t(
                  "«Тот, кто делает добро другому, делает наибольшее добро самому себе».",
                  "“He who does good to another does good also to himself.”",
                )}
              </p>
              <footer className="mt-2.5 flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-gold/70 not-italic">
                <span className="h-px w-5 bg-gold/40 shrink-0" aria-hidden />
                {t("Сенека", "Seneca")}
              </footer>
            </blockquote>
          </div>
        </div>

        <div className="gold-divider my-10 opacity-40" />

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-cream/50 gap-3">
          <div>© {new Date().getFullYear()} {t("Вестник мецената и филантропа. Все материалы — для просветительских целей.", "Patron & Philanthropist Herald. All materials are for educational purposes.")}</div>
          <div className="font-display text-gold/80 tracking-widest">VM · MMXXV</div>
        </div>
      </div>
    </footer>
  );
}
