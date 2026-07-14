import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-vm.png";
import { useT } from "@/i18n/lang";

export function Footer() {
  const t = useT();
  return (
    <footer className="ink-bg text-cream/85 mt-24">
      <div className="container mx-auto px-4 lg:px-8 py-14">
        <div className="grid lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt={t("Вестник мецената и филантропа", "Patron & Philanthropist Herald")} className="h-12 w-auto rounded-sm" />
              <div>
                <div className="font-display text-xl text-cream">{t("Вестник мецената и филантропа", "Patron & Philanthropist Herald")}</div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-gold/80">{t("Летопись благородных дел", "Chronicle of noble deeds")}</div>
              </div>
            </div>
            <p className="mt-5 text-sm text-cream/70 max-w-sm">
              {t(
                "Сетевое издание о людях, которые из века в век делают мир лучше — словом, делом и щедростью.",
                "An online publication about people who, century after century, make the world better — through word, deed, and generosity."
              )}
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-4">{t("Разделы", "Sections")}</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/mission" className="hover:text-gold">{t("Миссия", "Mission")}</Link></li>
              <li><Link to="/azbuka" className="hover:text-gold">{t("Азбука мецената", "Patron's ABC")}</Link></li>
              <li><Link to="/letopis" className="hover:text-gold">{t("Летопись щедрости", "Chronicle of generosity")}</Link></li>
              <li><Link to="/litsa" className="hover:text-gold">{t("Лица, оставившие свет", "Faces who left light")}</Link></li>
              <li><Link to="/nasledie" className="hover:text-gold">{t("Наследие", "Legacy")}</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-4">{t("Участие", "Get involved")}</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/puti" className="hover:text-gold">{t("Пути благородного участия", "Paths of noble participation")}</Link></li>
              <li><Link to="/geografiya" className="hover:text-gold">{t("География добра", "Geography of good")}</Link></li>
              <li><Link to="/prichastnost" className="hover:text-gold">{t("Искусство быть причастным", "The art of being involved")}</Link></li>
              <li><Link to="/puls" className="hover:text-gold">{t("Пульс времени и перемен", "Pulse of time and change")}</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-4">{t("Контакты", "Contacts")}</div>
            <p className="text-sm text-cream/70">{t("Москва, Россия", "Moscow, Russia")}</p>
            <p className="text-sm text-cream/70 mt-1">redaktsiya@vestnik-mecenata.ru</p>
            <p className="text-sm text-cream/70 mt-4 italic">{t(
              "«Тот, кто делает добро другому, делает наибольшее добро самому себе».",
              "“He who does good to another does good also to himself.”"
            )}</p>
            <p className="text-xs text-gold/70 mt-1">— {t("Сенека", "Seneca")}</p>
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
