import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useT } from "@/i18n/lang";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/letopis/1861")({
  head: () => ({
    meta: [
      { title: "1861 — отмена крепостного права и рождение новой щедрости" },
      { name: "description", content: "Почему 1861 год стал переломной точкой в истории русского меценатства." },
      { property: "og:title", content: "1861 — переломный год русского меценатства" },
    ],
  }),
  component: Year1861,
});

function Year1861() {
  const t = useT();
  return (
    <SiteLayout>
      <section className="relative bg-bordo text-cream overflow-hidden">
        <div className="grain absolute inset-0 opacity-25" />
        <div className="container mx-auto px-4 lg:px-8 pt-28 pb-24 relative max-w-4xl">
          <Link to="/letopis" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold hover:text-cream mb-8">
            <ArrowLeft className="h-3.5 w-3.5" /> {t("К летописи", "Back to chronicle")}
          </Link>
          <div className="text-[11px] tracking-[0.32em] uppercase text-gold">{t("Переломный год", "A turning-point year")}</div>
          <div className="font-display text-[12rem] md:text-[16rem] leading-[0.85] text-gold/95 mt-2">1861</div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl">{t("Отмена крепостного права", "Abolition of serfdom")}</h1>
          <p className="mt-6 text-cream/85 text-lg leading-relaxed">
            {t(
              "Манифест 19 февраля 1861 года, подписанный Александром II, освободил более 23 миллионов крестьян. Эта реформа изменила не только сословный уклад, но и саму логику русской щедрости.",
              "The Manifesto of 19 February 1861, signed by Alexander II, freed more than 23 million peasants. This reform changed not only the estate order, but the very logic of Russian generosity."
            )}
          </p>
        </div>
      </section>

      <section className="paper-bg">
        <div className="container mx-auto px-4 lg:px-8 py-20 max-w-4xl space-y-10 text-foreground/85 leading-relaxed">
          <div>
            <h2 className="font-display text-3xl text-bordo">{t("Перелом в логике отношений", "A shift in the logic of relations")}</h2>
            <div className="gold-divider my-5 w-12" />
            <p>
              {t(
                "Отмена крепостного права в России 1861 года — это не просто социальная реформа, а перелом в самой логике отношений «человек — общество — ответственность». Именно поэтому она стала важной вехой для становления меценатства как осознанной практики, а не побочного эффекта сословной системы.",
                "The abolition of serfdom in Russia in 1861 was not merely a social reform but a shift in the very logic of the relationship between “person — society — responsibility.” That is why it became a milestone in the rise of patronage as a conscious practice, rather than a by-product of the estate system."
              )}
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl text-bordo">{t("До 1861 года", "Before 1861")}</h2>
            <div className="gold-divider my-5 w-12" />
            <p>
              {t(
                "Благотворительность была в значительной мере функцией дворянства и купечества первых гильдий. Меценатство нередко существовало как форма барской милости, родового долга или церковного попечительства. Прохоровы, Демидовы, Шуваловы строили школы и галереи, но участие большинства подданных империи было ограничено сословным положением.",
                "Charity was largely a function of the nobility and the first-guild merchants. Patronage often existed as a form of lordly favour, family duty or ecclesiastical trusteeship. The Prokhorovs, Demidovs and Shuvalovs built schools and galleries, but the involvement of most subjects of the empire was constrained by their estate."
              )}
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl text-bordo">{t("После 1861 года", "After 1861")}</h2>
            <div className="gold-divider my-5 w-12" />
            <p>
              {t(
                "Освобождение крестьян раскрыло социальные лифты. Среди новых меценатов появились выходцы из бывших крепостных и старообрядческих семей: Третьяковы, Морозовы, Солдатёнковы, Бахрушины. Их щедрость была другой — деятельной, осознанной, направленной на образование, медицину, искусство, а не на демонстрацию статуса.",
                "The emancipation of the peasants opened the social ladder. Among the new patrons were people from former serf and Old Believer families: the Tretyakovs, Morozovs, Soldatyonkovs, Bakhrushins. Their generosity was different — active, conscious, directed at education, medicine and art rather than the display of status."
              )}
            </p>
            <p className="mt-4">
              {t(
                "Само меценатство перестало быть привилегией происхождения и стало результатом личного выбора. Появились первые попечительские советы, общественные больницы, частные галереи, переданные городу. К концу XIX века Россия уже знала десятки имён, чьи дары пережили империю.",
                "Patronage itself ceased to be a privilege of birth and became the result of personal choice. The first trustee councils, public hospitals and private galleries handed over to the city appeared. By the end of the 19th century, Russia knew dozens of names whose gifts outlived the empire."
              )}
            </p>
          </div>

          <div className="bg-bordo text-cream p-10 rounded-sm">
            <div className="text-[11px] tracking-[0.32em] uppercase text-gold">{t("Главный сдвиг", "The key shift")}</div>
            <p className="mt-4 font-display text-2xl md:text-3xl italic leading-snug">
              {t(
                "«Щедрость перестала быть привилегией происхождения и стала результатом личного выбора».",
                "“Generosity ceased to be a privilege of birth and became the result of personal choice.”"
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-between pt-6">
            <Link to="/letopis" className="text-xs uppercase tracking-[0.22em] text-bordo hover:text-gold">← {t("Полная летопись", "Full chronicle")}</Link>
            <Link to="/litsa" className="text-xs uppercase tracking-[0.22em] text-bordo hover:text-gold">{t("Лица, оставившие свет", "Faces who left light")} →</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}