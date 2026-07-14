export type QuizQuestion =
  | {
      kind: "single";
      id: string;
      question: string;
      options: string[];
      correct: number;
      explain: string;
      link?: { to: string; label: string };
      image?: string;
      imageAlt?: string;
    }
  | {
      kind: "multi";
      id: string;
      question: string;
      options: string[];
      correct: number[];
      explain: string;
      link?: { to: string; label: string };
    };

export const QUIZ: QuizQuestion[] = [
  {
    kind: "single",
    id: "tretyakov",
    question: "Who founded the gallery that became the main museum of Russian art?",
    options: ["Savva Morozov", "Pavel Tretyakov", "Sergei Shchukin", "Aleksei Bakhrushin"],
    correct: 1,
    explain: "Pavel Mikhailovich Tretyakov began collecting Russian paintings in 1856 and donated his collection to Moscow in 1892.",
    link: { to: "/litsa#person-tretyakov", label: "Pavel Tretyakov" },
  },
  {
    kind: "single",
    id: "azbuka-mecenat",
    question: "What does the word 'patron' mean in the portal's 'Alphabet'?",
    options: [
      "A patron of arts, sciences, and education",
      "A financial manager of a monastery",
      "A donation collector at a temple",
      "A head of a merchant guild",
    ],
    correct: 0,
    explain:
      "In the 'Alphabet of Philanthropy,' a patron is a protector of arts, sciences, and education. The name traces back to Gaius Cilnius Maecenas — the patron of Virgil and Horace.",
    link: { to: "/azbuka#term-%D0%9C%D0%B5%D1%86%D0%B5%D0%BD%D0%B0%D1%82", label: "Alphabet — Letter M" },
  },
  {
    kind: "single",
    id: "portrait-shuvalov",
    question: "Who is depicted in the portrait? The founder of Moscow University and the Academy of Arts.",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/85/Ivan_Shuvalov_by_F.Rokotov_%281760%2C_Hermitage%29.jpg",
    imageAlt: "Portrait of an 18th-century patron",
    options: ["Ivan Betskoy", "Nikolai Rumyantsev", "Ivan Shuvalov", "Aleksandr Stroganov"],
    correct: 2,
    explain: "In 1755, Ivan Shuvalov, together with M. V. Lomonosov, founded Moscow University, and in 1757, the Academy of Arts.",
    link: { to: "/litsa#person-shuvalov", label: "Ivan Shuvalov" },
  },
  {
    kind: "single",
    id: "msu-year",
    question: "In what year was Moscow University founded?",
    options: ["1724", "1755", "1764", "1802"],
    correct: 1,
    explain: "Empress Elizaveta Petrovna's decree on the establishment of Moscow University was signed in 1755.",
    link: { to: "/nasledie#legacy-msu", label: "Legacy — Moscow University" },
  },
  {
    kind: "multi",
    id: "morozovs",
    question: "Which of the following people belong to the Morozov dynasty of patrons and entrepreneurs?",
    options: ["Savva Morozov", "Varvara Morozova", "Ivan Morozov", "Aleksei Bakhrushin", "Margarita Morozova", "Pavlik Morozov"],
    correct: [0, 1, 2, 4],
    explain: "Savva, Varvara, Ivan, and Margarita are representatives of the famous Morozov merchant dynasty. Bakhrushin came from another Moscow merchant family, while Pavlik Morozov was a Soviet-era pioneer with no relation to the dynasty.",
    link: { to: "/litsa", label: "Gallery of Faces" },
  },
  {
    kind: "single",
    id: "baku-water",
    question: "Who built the Shollar water pipeline that provided Baku with clean water?",
    options: ["Musa Nagiyev", "Emanuel Nobel", "Haji Taghiyev", "Alfons Shanyavsky"],
    correct: 2,
    explain: "Haji Zeynalabdin Taghiyev financed the construction of the Shollar water pipeline — one of Baku's largest engineering projects.",
    link: { to: "/litsa#person-tagiev", label: "Haji Taghiyev" },
  },
  {
    kind: "single",
    id: "rumyantsev",
    question: "Whose collection of books and manuscripts formed the basis of the Russian State Library?",
    options: ["Nikolai Rumyantsev", "Kozma Soldatyonkov", "Ivan Shuvalov", "Nikolai Yusupov"],
    correct: 0,
    explain: "Count Nikolai Rumyantsev bequeathed his collection of books and manuscripts to the state — the foundation of the future RSL.",
    link: { to: "/litsa#person-rumyantsev", label: "Nikolai Rumyantsev" },
  },
  {
    kind: "single",
    id: "era-1861",
    question: "To which era of the 'Chronicle' does the abolition of serfdom belong?",
    options: ["18th century", "Before 1861", "Year 1861", "Silver Age"],
    correct: 2,
    explain: "The Manifesto of February 19, 1861, was a milestone that opened a new era for Russian charity.",
    link: { to: "/letopis/1861", label: "Chronicle · 1861" },
  },
  {
    kind: "single",
    id: "portrait-tretyakov",
    question: "Who is depicted in the portrait by Ilya Repin?",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/82/Ilja_Jefimowitsch_Repin_-_Portrait_of_Pavel_Mikha%C3%AFlovitch_Tr%C3%A9tiakov.jpg",
    imageAlt: "Portrait by I. Repin",
    options: ["Sergei Shchukin", "Pavel Tretyakov", "Savva Mamontov", "Kozma Soldatyonkov"],
    correct: 1,
    explain: "The famous portrait of Pavel Tretyakov painted by Ilya Repin in 1883.",
    link: { to: "/litsa#person-tretyakov", label: "Pavel Tretyakov" },
  },
  {
    kind: "single",
    id: "mht",
    question: "Which patron financially supported the creation of the Moscow Art Theatre?",
    options: ["Savva Morozov", "Sergei Shchukin", "Aleksei Bakhrushin", "Stepan Ryabushinsky"],
    correct: 0,
    explain: "Savva Morozov invested his own funds into the new theatre of K. S. Stanislavski and V. I. Nemirovich-Danchenko in 1898.",
    link: { to: "/nasledie#legacy-mht", label: "Legacy — MAT" },
  },
  {
    kind: "single",
    id: "tenisheva",
    question: "Who created the art workshops and school in Talashkino?",
    options: ["Varvara Morozova", "Margarita Morozova", "Maria Tenisheva", "Khristina Alchevskaya"],
    correct: 2,
    explain: "Princess Maria Tenisheva established workshops, a school, and a center for Russian art at the Talashkino estate near Smolensk.",
    link: { to: "/litsa#person-tenisheva", label: "Maria Tenisheva" },
  },
  {
    kind: "multi",
    id: "baku-patrons",
    question: "Which of these patrons worked in Baku?",
    options: ["Haji Taghiyev", "Innokenty Sibiryakov", "Emanuel Nobel", "Musa Nagiyev", "Nikolai Bugrov"],
    correct: [0, 2, 3],
    explain: "Taghiyev, Nobel, and Nagiyev were patrons of the Baku oil era. Sibiryakov is linked to Irkutsk, and Bugrov to Nizhny Novgorod.",
    link: { to: "/geografiya#%D0%91%D0%B0%D0%BA%D1%83", label: "Geography of Good — Baku" },
  },
  {
    kind: "single",
    id: "pushkin-museum",
    question: "Who became the main benefactor of the Pushkin State Museum of Fine Arts?",
    options: ["Savva Mamontov", "Yury Nechaev-Maltsov", "Pavel Tretyakov", "Nikolai Yusupov"],
    correct: 1,
    explain: "Yury Nechaev-Maltsov invested about two-thirds of the total amount in the construction of the Museum of Fine Arts.",
    link: { to: "/litsa#person-nechaev-maltsov", label: "Yury Nechaev-Maltsov" },
  },
  {
    kind: "single",
    id: "demidov-prize",
    question: "Who established the Demidov Prize, which supported Russian science in the 19th century?",
    options: ["Prokopy Demidov", "Anatoly Demidov", "Aleksandr Stroganov", "Nikolai Rumyantsev"],
    correct: 1,
    explain: "Anatoly Demidov established the Demidov Prize in 1832 — the most prestigious scientific award in pre-revolutionary Russia.",
    link: { to: "/nasledie#legacy-demidov-prize", label: "Legacy — Demidov Prize" },
  },
  {
    kind: "single",
    id: "form-endowment",
    question: "What is the name of a type of donation where the capital is not spent but works for the foundation's goals for decades?",
    options: ["Targeted assistance", "Targeted capital (endowment)", "Pro bono", "Corporate volunteering"],
    correct: 1,
    explain: "Targeted capital (endowment) is a long-term fund invested according to FZ-275 rules. Only the returns are used for the objectives.",
    link: { to: "/puti#path-endowment", label: "Ways to participate — endowment" },
  },
  {
    kind: "single",
    id: "potanin-foundation",
    question: "Which modern patron founded the largest private foundation for culture and education support?",
    options: ["Alisher Usmanov", "Viktor Vekselberg", "Vladimir Potanin", "Roman Abramovich"],
    correct: 2,
    explain: "The Vladimir Potanin Foundation, founded in 1999, supports programs in culture, education, and museum operations.",
    link: { to: "/litsa#person-potanin", label: "Vladimir Potanin" },
  },
];

export type QuizLevel = {
  min: number;
  max: number;
  title: string;
  text: string;
  links: { to: string; label: string }[];
};

export const LEVELS: QuizLevel[] = [
  {
    min: 0,
    max: 4,
    title: "Novice",
    text: "You are just beginning your journey through the 'Herald.' Ahead lies a whole chronicle of noble deeds. Take a look at the Alphabet and Chronicle to master the language of Russian philanthropy.",
    links: [
      { to: "/azbuka", label: "Alphabet of Philanthropy" },
      { to: "/letopis", label: "Chronicle" },
    ],
  },
  {
    min: 5,
    max: 8,
    title: "Companion",
    text: "You are familiar with the tradition and recognize iconic names. Open the 'Faces' section — it features the lives without which Russian generosity cannot be understood.",
    links: [
      { to: "/litsa", label: "Faces that left a light" },
      { to: "/nasledie", label: "Legacy" },
    ],
  },
  {
    min: 9,
    max: 12,
    title: "Guardian",
    text: "You are an attentive reader of the 'Herald.' You know not only the names but also the context of the eras. It's time to choose your own path of participation.",
    links: [
      { to: "/puti", label: "Ways to participate" },
      { to: "/geografiya", label: "Geography of Good" },
    ],
  },
  {
    min: 13,
    max: 15,
    title: "Initiate",
    text: "You have decoded the 'patron code.' For you, philanthropy is not a gesture but a way of service. Join the cause — become involved.",
    links: [
      { to: "/prichastnost", label: "Become involved" },
      { to: "/mission", label: "Mission of the Herald" },
    ],
  },
];
