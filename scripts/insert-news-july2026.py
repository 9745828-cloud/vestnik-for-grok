# -*- coding: utf-8 -*-
"""Insert July 2026 news into NEWS arrays (all languages), newest first."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "src" / "data"

# Order: newest → oldest within the new batch; undated Iran/Ingos placed by inferred mid-July
NEW = {
    "ru": [
        {
            "date": "2026-07-29",
            "title": "В Екатеринбурге обсудили новую модель российского меценатства",
            "text": "29 июля 2026 года в Екатеринбурге прошла пленарная сессия «Уральский код меценатства: от традиций к инновациям», объединившая представителей бизнеса, благотворительных фондов, власти и учреждений культуры. Главная тема — переход от разовой благотворительной помощи к долгосрочным социальным инвестициям в культуру, образование, городскую среду и развитие регионов. В числе практик — проекты Русской медной компании, фондов «Синара» и СКБ Контур. Особенно показателен опыт Екатерининской Ассамблеи: за 15 лет проект собрал более 1 млрд рублей на инициативы в сфере культуры, медицины, образования, спорта и социальной поддержки.",
            "source": "Форум Доноров",
            "url": "https://donorsforum.ru/text-9/v-ekaterinburge-obsudili-buduschee-mecenatstva-ot-blagotvoritelnosti-k-partnerstvu-v-razvitii-territoriy/",
        },
        {
            "date": "2026-07-27",
            "title": "Фонд Потанина поддержит проекты личной филантропии",
            "text": "Благотворительный фонд Владимира Потанина открыл конкурс «Практики личной филантропии и альтруизма». Он ориентирован на локальные инициативы, которые помогают решать проблемы городов, профессиональных сообществ и отдельных социальных групп. Максимальный размер гранта — 500 тысяч рублей; срок проектов — от трёх месяцев до одного года.",
            "source": "АСИ",
            "url": "https://asi.org.ru/news/2026/07/27/fond-potanina-otkryl-priem-zayavok-na-konkurs-praktiki-lichnoj-filantropii-i-altruizma/",
        },
        {
            "date": "2026-07-27",
            "title": "В Москве запустят маршруты по истории меценатства",
            "text": "В августе 2026 года в Москве пройдут бесплатные пешеходные экскурсии «Гуляй и помогай», посвящённые истории столичной благотворительности. Маршруты охватят районы Кузнецкого Моста и Большой Ордынки: участникам расскажут о наследии Третьяковых, Морозовых и Мамонтовых и покажут места, связанные с развитием частной благотворительности.",
            "source": "АСИ",
            "url": "https://asi.org.ru/news/2026/07/27/moskvicham-rasskazhut-ob-istorii-stolichnoj-blagotvoritelnosti/",
        },
        {
            "date": "2026-07-15",
            "title": "Опубликовано исследование традиций меценатства в Иране",
            "text": "В рамках сравнительного исследования меценатства в странах БРИКС+ вышел материал, посвящённый Ирану. В центре — вакф, один из древнейших механизмов благотворительности, при котором имущество или средства передаются на религиозные и общественно полезные цели. Исследование показывает, как многовековая традиция целевых пожертвований действует в современном правовом поле.",
            "source": "Форум Доноров",
            "url": "https://donorsforum.ru/text-9/986/",
        },
        {
            "date": "2026-07-10",
            "title": "«Ингосстрах» продолжил поддержку молодых артистов Большого театра",
            "text": "Компания «Ингосстрах» продлила партнёрство с Молодёжной оперной программой Большого театра. Программа помогает начинающим певцам и концертмейстерам совершенствовать мастерство под руководством известных педагогов и получать сценический опыт — пример корпоративного меценатства, когда бизнес вкладывается в долгосрочную подготовку молодых исполнителей, а не только в разовые мероприятия.",
            "source": "Ингосстрах",
            "url": "https://www.ingos.ru/company/news",
        },
        {
            "date": "2026-07-07",
            "title": "Фильм о меценатах и предпринимателях прошлого собрал более 1300 зрителей",
            "text": "В московском Храме Христа Спасителя состоялась премьера документального фильма «Святые предприниматели». Показ посетили более 1300 человек. Картина рассказывает о дореволюционных предпринимателях, строивших школы, больницы, богадельни, храмы и культурные учреждения, и о современных бизнесменах, продолжающих традиции социально ответственного предпринимательства. В основе — исследование Музея предпринимателей, меценатов и благотворителей о 33 предпринимателях, причисленных к лику святых, а также о наследии Третьяковых, Бахрушиных, фон Мекк и Абрикосовых.",
            "source": "Музей предпринимателей, меценатов и благотворителей",
            "url": "https://www.muzeydela.ru/novosti/bolee-1300-gostey-posetili-premeru-filma-svyatye-predprinimateli-v-moskve/",
        },
        {
            "date": "2026-07-02",
            "title": "Учёный ТГУ впервые сопоставил традиции благотворительности России и Европы",
            "text": "Доцент Томского государственного университета Александр Быков выпустил монографию «Благотворительность как социокультурный феномен». Исследователь проследил развитие помощи нуждающимся от античности до XIX века и комплексно сопоставил российскую и западноевропейскую модели: в России традицию помощи долго поддерживала прежде всего церковь, тогда как в Европе муниципальные и светские власти включились раньше. Монография готовилась 12 лет и опубликована в открытом доступе.",
            "source": "Томский государственный университет",
            "url": "https://news.tsu.ru/news/uchenyy-fsf-vpervye-sopostavil-traditsii-metsenatstva-v-rossii-i-evrope/",
        },
        {
            "date": "2026-07-01",
            "title": "Эрмитаж посвятил масштабную выставку меценату Александру Штиглицу",
            "text": "В Манеже Малого Эрмитажа открылась выставка «Барон Штиглиц. “Подвиг просвещённой благотворительности”», приуроченная к 150-летию Академии Штиглица. В 1876 году промышленник и финансист Александр Штиглиц пожертвовал миллион рублей на создание училища технического рисования, а позднее основал музей прикладного искусства. На выставке — около 800 произведений; значительная часть экспонатов специально отреставрирована и показывается впервые.",
            "source": "Петербургский дневник",
            "url": "https://spbdnevnik.ru/news/2026-07-01/podvig-prosveshchennoy-blagotvoritelnosti-v-peterburge-otkrylas-vystavka-po-sluchayu-150-letiya-akademii-shtiglitsa",
        },
    ],
    "en": [
        {
            "date": "2026-07-29",
            "title": "A new model of Russian patronage discussed in Yekaterinburg",
            "text": "On 29 July 2026, Yekaterinburg hosted the plenary session “The Ural Code of Patronage: From Tradition to Innovation,” bringing together business, charitable foundations, government and cultural institutions. The focus was a shift from one-off charity to long-term social investment in culture, education, urban environments and regional development. Practices presented included projects of the Russian Copper Company and the Sinara and SKB Kontur foundations. Especially notable is the Yekaterinburg Assembly: over 15 years the project has raised more than 1 billion rubles for culture, medicine, education, sport and social support.",
            "source": "Donors Forum",
            "url": "https://donorsforum.ru/text-9/v-ekaterinburge-obsudili-buduschee-mecenatstva-ot-blagotvoritelnosti-k-partnerstvu-v-razvitii-territoriy/",
        },
        {
            "date": "2026-07-27",
            "title": "Potanin Foundation to support personal philanthropy projects",
            "text": "The Vladimir Potanin Charity Foundation opened the competition “Practices of Personal Philanthropy and Altruism.” It targets local initiatives that help solve problems of cities, professional communities and specific social groups. The maximum grant is 500,000 rubles; project duration ranges from three months to one year.",
            "source": "ASI",
            "url": "https://asi.org.ru/news/2026/07/27/fond-potanina-otkryl-priem-zayavok-na-konkurs-praktiki-lichnoj-filantropii-i-altruizma/",
        },
        {
            "date": "2026-07-27",
            "title": "Moscow to launch walking routes on the history of patronage",
            "text": "In August 2026 Moscow will host free walking tours “Walk and Help” on the history of capital philanthropy. Routes will cover Kuznetsky Most and Bolshaya Ordynka, telling visitors about the Tretyakovs, Morozovs and Mamontovs and places linked to the rise of private charity in Moscow.",
            "source": "ASI",
            "url": "https://asi.org.ru/news/2026/07/27/moskvicham-rasskazhut-ob-istorii-stolichnoj-blagotvoritelnosti/",
        },
        {
            "date": "2026-07-15",
            "title": "Study published on traditions of patronage in Iran",
            "text": "As part of comparative research on patronage in the BRICS+ countries, a paper on Iran has been released. At its centre is the waqf, one of the oldest forms of charity, in which property or funds are dedicated to religious and public purposes. The study shows how a centuries-old tradition of earmarked giving operates in today’s legal framework.",
            "source": "Donors Forum",
            "url": "https://donorsforum.ru/text-9/986/",
        },
        {
            "date": "2026-07-10",
            "title": "Ingosstrakh continues support for young artists of the Bolshoi Theatre",
            "text": "Ingosstrakh has extended its partnership with the Bolshoi Theatre’s Young Opera Programme. The programme helps emerging singers and accompanists refine their craft under leading teachers and gain stage experience — an example of corporate patronage investing in long-term training of young performers, not only one-off events.",
            "source": "Ingosstrakh",
            "url": "https://www.ingos.ru/company/news",
        },
        {
            "date": "2026-07-07",
            "title": "Film on patrons and entrepreneurs of the past drew over 1,300 viewers",
            "text": "The premiere of the documentary “Holy Entrepreneurs” was held at the Cathedral of Christ the Saviour in Moscow and attended by more than 1,300 people. The film tells of pre-revolutionary entrepreneurs who built schools, hospitals, almshouses, churches and cultural institutions, and of today’s business leaders continuing the tradition of socially responsible enterprise. It draws on research by the Museum of Entrepreneurs, Patrons and Philanthropists on 33 entrepreneurs canonized as saints and on the legacy of the Tretyakovs, Bakhrushins, von Mecks and Abrikosovs.",
            "source": "Museum of Entrepreneurs, Patrons and Philanthropists",
            "url": "https://www.muzeydela.ru/novosti/bolee-1300-gostey-posetili-premeru-filma-svyatye-predprinimateli-v-moskve/",
        },
        {
            "date": "2026-07-02",
            "title": "TSU scholar compares Russian and European traditions of charity",
            "text": "Tomsk State University associate professor Alexander Bykov published the monograph “Charity as a Sociocultural Phenomenon.” He traces aid to those in need from antiquity to the nineteenth century and systematically compares Russian and West European models: in Russia the church long sustained the tradition of help, while in Europe municipal and secular authorities engaged earlier. The book was twelve years in the making and is available in open access.",
            "source": "Tomsk State University",
            "url": "https://news.tsu.ru/news/uchenyy-fsf-vpervye-sopostavil-traditsii-metsenatstva-v-rossii-i-evrope/",
        },
        {
            "date": "2026-07-01",
            "title": "The Hermitage opens a major exhibition on patron Alexander Stieglitz",
            "text": "The Manege of the Small Hermitage opened the exhibition “Baron Stieglitz. ‘A Feat of Enlightened Philanthropy’,” marking the 150th anniversary of the Stieglitz Academy. In 1876 industrialist and financier Alexander Stieglitz donated one million rubles to found a school of technical drawing and later established a museum of applied art. About 800 works are on show; many were specially restored and are displayed for the first time.",
            "source": "Petersburg Diary",
            "url": "https://spbdnevnik.ru/news/2026-07-01/podvig-prosveshchennoy-blagotvoritelnosti-v-peterburge-otkrylas-vystavka-po-sluchayu-150-letiya-akademii-shtiglitsa",
        },
    ],
    "ar": [
        {
            "date": "2026-07-29",
            "title": "نقاش في يكاترينبورغ حول نموذج جديد للرعاية الروسية",
            "text": "في 29 يوليو 2026 عُقدت في يكاترينبورغ الجلسة العامة «رمز الأورال للرعاية: من التقاليد إلى الابتكار»، جمعت ممثلي الأعمال والصناديق الخيرية والسلطة ومؤسسات الثقافة. الموضوع الرئيسي — الانتقال من المساعدة الخيرية لمرة واحدة إلى استثمارات اجتماعية طويلة الأمد في الثقافة والتعليم والبيئة الحضرية وتنمية الأقاليم. من بين الممارسات مشاريع شركة النحاس الروسية وصندوقي «سينارا» وSKB Kontur. وتبرز تجربة جمعية يكاترينينسكايا: خلال 15 عاماً جمعت أكثر من مليار روبل لمبادرات الثقافة والطب والتعليم والرياضة والدعم الاجتماعي.",
            "source": "منتدى المانحين",
            "url": "https://donorsforum.ru/text-9/v-ekaterinburge-obsudili-buduschee-mecenatstva-ot-blagotvoritelnosti-k-partnerstvu-v-razvitii-territoriy/",
        },
        {
            "date": "2026-07-27",
            "title": "صندوق بوتانين يدعم مشاريع العمل الخيري الشخصي",
            "text": "فتح صندوق فلاديمير بوتانين الخيري مسابقة «ممارسات العمل الخيري الشخصي والإيثار». وهي موجهة للمبادرات المحلية التي تساعد على حل مشكلات المدن والمجتمعات المهنية والفئات الاجتماعية. الحد الأقصى للمنحة 500 ألف روبل، ومدة المشاريع من ثلاثة أشهر إلى سنة.",
            "source": "وكالة المعلومات الاجتماعية",
            "url": "https://asi.org.ru/news/2026/07/27/fond-potanina-otkryl-priem-zayavok-na-konkurs-praktiki-lichnoj-filantropii-i-altruizma/",
        },
        {
            "date": "2026-07-27",
            "title": "موسكو تطلق مسارات عن تاريخ الرعاية",
            "text": "في أغسطس 2026 ستُقام في موسكو جولات مشي مجانية «تمشَّ وساعد» عن تاريخ العمل الخيري في العاصمة. تغطي المسارات حيي كوزنتسكي موست وبولشايا أردينكا، وتُعرّف الزوار بإرث تريتياكوف وموروزوف ومامونتوف وبأماكن ارتبطت بتطور العمل الخيري الخاص في موسكو.",
            "source": "وكالة المعلومات الاجتماعية",
            "url": "https://asi.org.ru/news/2026/07/27/moskvicham-rasskazhut-ob-istorii-stolichnoj-blagotvoritelnosti/",
        },
        {
            "date": "2026-07-15",
            "title": "نشر دراسة عن تقاليد الرعاية في إيران",
            "text": "ضمن بحث مقارن عن الرعاية في دول بريكس+ صدرت مادة عن إيران. في مركزها الوقف، أحد أقدم آليات العمل الخيري، حيث تُخصَّص الممتلكات أو الأموال لأغراض دينية ونفع عام. تبيّن الدراسة كيف تعمل تقاليد التبرع المخصص عبر القرون في الإطار القانوني المعاصر.",
            "source": "منتدى المانحين",
            "url": "https://donorsforum.ru/text-9/986/",
        },
        {
            "date": "2026-07-10",
            "title": "«إنغوستراخ» تواصل دعم الفنانين الشباب في مسرح البولشوي",
            "text": "مدّدت شركة «إنغوستراخ» شراكتها مع برنامج الأوبرا الشبابي لمسرح البولشوي. يساعد البرنامج المغنين والمرافقين المبتدئين على صقل مهاراتهم بإشراف معلمين معروفين واكتساب خبرة مسرحية — مثال على رعاية الشركات حين يستثمر العمل في إعداد طويل الأمد للمؤديين الشباب لا في فعاليات لمرة واحدة فقط.",
            "source": "إنغوستراخ",
            "url": "https://www.ingos.ru/company/news",
        },
        {
            "date": "2026-07-07",
            "title": "فيلم عن رعاة ورجال أعمال الماضي جذب أكثر من 1300 مشاهد",
            "text": "عُرضت في كاتدرائية المسيح المخلّص في موسكو العرض الأول للفيلم الوثائقي «رجال الأعمال القديسون»، وحضره أكثر من 1300 شخص. يروي الفيلم عن رجال أعمال ما قبل الثورة بنوا مدارس ومستشفيات ودور عجزة وكنائس ومؤسسات ثقافية، وعن رجال أعمال معاصرين يواصلون تقاليد المسؤولية الاجتماعية. ويستند إلى بحث متحف رجال الأعمال والرعاة والمحسنين عن 33 رجل أعمال قُدّسوا، وعن إرث تريتياكوف وباخروشين وفون ميك وأبريكوسوف.",
            "source": "متحف رجال الأعمال والرعاة والمحسنين",
            "url": "https://www.muzeydela.ru/novosti/bolee-1300-gostey-posetili-premeru-filma-svyatye-predprinimateli-v-moskve/",
        },
        {
            "date": "2026-07-02",
            "title": "باحث في جامعة تومسك يقارن تقاليد العمل الخيري في روسيا وأوروبا",
            "text": "أصدر ألكسندر بيكوف، الأستاذ المشارك في جامعة تومسك الحكومية، كتاب «العمل الخيري كظاهرة اجتماعية ثقافية». يتتبع تطور مساعدة المحتاجين من العصور القديمة حتى القرن التاسع عشر ويقارن النموذج الروسي والغربي الأوروبي: في روسيا ظلت الكنيسة طويلاً عماد تقليد العون، بينما انخرطت السلطات البلدية والعلمانية في أوروبا مبكراً. استغرق الكتاب 12 عاماً وهو متاح في الوصول المفتوح.",
            "source": "جامعة تومسك الحكومية",
            "url": "https://news.tsu.ru/news/uchenyy-fsf-vpervye-sopostavil-traditsii-metsenatstva-v-rossii-i-evrope/",
        },
        {
            "date": "2026-07-01",
            "title": "الإرميتاج يخصص معرضاً كبيراً للراعي ألكسندر شتيغليتس",
            "text": "افتُتح في مانيج الإرميتاج الصغير معرض «البارون شتيغليتس. “مأثرة الإحسان المستنير”» بمناسبة الذكرى الـ150 لأكاديمية شتيغليتس. في 1876 تبرع الصناعي والمموّل ألكسندر شتيغليتس بمليون روبل لإنشاء مدرسة الرسم التقني، ثم أسس متحفاً للفنون التطبيقية. يعرض المعرض نحو 800 عمل؛ أُعيد ترميم جزء كبير منها ويُعرض للمرة الأولى.",
            "source": "يوميات بطرسبرغ",
            "url": "https://spbdnevnik.ru/news/2026-07-01/podvig-prosveshchennoy-blagotvoritelnosti-v-peterburge-otkrylas-vystavka-po-sluchayu-150-letiya-akademii-shtiglitsa",
        },
    ],
    "zh": [
        {
            "date": "2026-07-29",
            "title": "叶卡捷琳堡讨论俄罗斯赞助的新模式",
            "text": "2026年7月29日，叶卡捷琳堡举行全体会议「乌拉尔赞助密码：从传统到创新」，汇集商界、慈善基金、政府与文化机构代表。核心议题是从一次性慈善转向对文化、教育、城市环境与区域发展的长期社会投资。所展示的实践包括俄罗斯铜业公司以及「西纳拉」和SKB Kontur基金会的项目。叶卡捷琳娜大会的经验尤为突出：15年来该项目为文化、医疗、教育、体育与社会支持筹集超过10亿卢布。",
            "source": "捐赠者论坛",
            "url": "https://donorsforum.ru/text-9/v-ekaterinburge-obsudili-buduschee-mecenatstva-ot-blagotvoritelnosti-k-partnerstvu-v-razvitii-territoriy/",
        },
        {
            "date": "2026-07-27",
            "title": "波塔宁基金会将支持个人慈善项目",
            "text": "弗拉基米尔·波塔宁慈善基金会启动竞赛「个人慈善与利他实践」。面向有助于解决城市、专业社群及特定社会群体问题的本地倡议。最高资助额为50万卢布，项目周期为三个月至一年。",
            "source": "社会信息社",
            "url": "https://asi.org.ru/news/2026/07/27/fond-potanina-otkryl-priem-zayavok-na-konkurs-praktiki-lichnoj-filantropii-i-altruizma/",
        },
        {
            "date": "2026-07-27",
            "title": "莫斯科将推出赞助史步行路线",
            "text": "2026年8月，莫斯科将举办免费步行导览「走走并帮助」，讲述首都慈善史。路线覆盖库兹涅茨基桥与大奥尔登卡一带，介绍特列季亚科夫、莫罗佐夫与马蒙托夫的遗产，以及与莫斯科私人慈善发展相关的地点。",
            "source": "社会信息社",
            "url": "https://asi.org.ru/news/2026/07/27/moskvicham-rasskazhut-ob-istorii-stolichnoj-blagotvoritelnosti/",
        },
        {
            "date": "2026-07-15",
            "title": "发表关于伊朗赞助传统的研究",
            "text": "在金砖+国家赞助比较研究框架下，刊发了关于伊朗的材料。核心是瓦克夫（waqf）——最古老的慈善机制之一，将财产或资金用于宗教与公益目的。研究展示了延续数百年的定向捐赠传统如何在当代法律框架中运作。",
            "source": "捐赠者论坛",
            "url": "https://donorsforum.ru/text-9/986/",
        },
        {
            "date": "2026-07-10",
            "title": "「英戈斯斯特拉赫」继续支持大剧院青年艺术家",
            "text": "「英戈斯斯特拉赫」公司延长了与大剧院青年歌剧项目的合作。该项目帮助初出茅庐的歌手与伴奏在知名教师指导下提升技艺并获得舞台经验——体现了企业赞助将投入用于青年表演者的长期培养，而非仅支持一次性活动。",
            "source": "英戈斯斯特拉赫",
            "url": "https://www.ingos.ru/company/news",
        },
        {
            "date": "2026-07-07",
            "title": "关于昔日赞助人与企业家的影片吸引逾1300名观众",
            "text": "纪录片《圣洁的企业家》在莫斯科救世主大教堂首映，观众超过1300人。影片讲述革命前建造学校、医院、救济院、教堂与文化机构的企业家，以及延续社会责任企业传统的当代商人。内容基于企业家、赞助人与慈善家博物馆的研究，涉及33位被封圣的企业家，以及特列季亚科夫、巴赫鲁申、冯·梅克与阿布里科索夫家族的遗产。",
            "source": "企业家、赞助人与慈善家博物馆",
            "url": "https://www.muzeydela.ru/novosti/bolee-1300-gostey-posetili-premeru-filma-svyatye-predprinimateli-v-moskve/",
        },
        {
            "date": "2026-07-02",
            "title": "托木斯克国立大学学者首次系统比较俄欧慈善传统",
            "text": "托木斯克国立大学副教授亚历山大·贝科夫出版专著《作为社会文化现象的慈善》。作者梳理了从古代到19世纪对贫困者援助的发展，并系统比较俄罗斯与西欧模式：在俄罗斯，援助传统长期主要由教会维系，而在欧洲，市政与世俗当局更早介入。专著历时12年完成，并以开放获取方式发表。",
            "source": "托木斯克国立大学",
            "url": "https://news.tsu.ru/news/uchenyy-fsf-vpervye-sopostavil-traditsii-metsenatstva-v-rossii-i-evrope/",
        },
        {
            "date": "2026-07-01",
            "title": "艾尔米塔什为赞助人亚历山大·施蒂格利茨举办大型展览",
            "text": "小艾尔米塔什马内日厅开幕展览《施蒂格利茨男爵。“开明慈善的功业”》，纪念施蒂格利茨学院成立150周年。1876年，实业家兼金融家亚历山大·施蒂格利茨捐出100万卢布创办技术绘画学校，后又建立应用艺术博物馆。展出约800件作品，其中相当部分经专门修复并首次展出。",
            "source": "彼得堡日报",
            "url": "https://spbdnevnik.ru/news/2026-07-01/podvig-prosveshchennoy-blagotvoritelnosti-v-peterburge-otkrylas-vystavka-po-sluchayu-150-letiya-akademii-shtiglitsa",
        },
    ],
}


def fmt_item(item: dict) -> str:
    def esc(s: str) -> str:
        return s.replace("\\", "\\\\").replace('"', '\\"')

    lines = [
        "  {",
        f'    date: "{item["date"]}",',
        f'    title: "{esc(item["title"])}",',
        f'    text: "{esc(item["text"])}",',
        f'    source: "{esc(item["source"])}",',
        f'    url: "{item["url"]}",',
        "  },",
    ]
    return "\n".join(lines)


def insert(lang: str, filename: str) -> None:
    path = ROOT / filename
    text = path.read_text(encoding="utf-8")
    marker = "export const NEWS: NewsItem[] = [\n"
    if marker not in text:
        raise SystemExit(f"{lang}: NEWS marker missing")
    # idempotent
    if 'date: "2026-07-29"' in text:
        print(f"{lang}: already has 2026-07-29, skip")
        return
    block = "\n".join(fmt_item(i) for i in NEW[lang]) + "\n"
    text2 = text.replace(marker, marker + block, 1)
    path.write_text(text2, encoding="utf-8")
    dates = re.findall(r'date: "([^"]+)"', text2[text2.find("export const NEWS") : text2.find("export const NEWS") + 20000])
    print(f"{lang}: inserted 8; first dates: {dates[:10]}; total ~{len(dates)}")


def main() -> None:
    insert("ru", "content.ts")
    insert("en", "content.en.ts")
    insert("ar", "content.ar.ts")
    insert("zh", "content.zh.ts")
    print("OK")


if __name__ == "__main__":
    main()
