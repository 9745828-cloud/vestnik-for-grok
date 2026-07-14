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
    question: "谁创立了后来成为俄罗斯艺术主博物馆的画廊？",
    options: ["萨в瓦·莫розо夫", "帕вел·特列тья科夫", "谢尔盖·休金", "阿列克谢·巴хрушин"],
    correct: 1,
    explain: "帕вел·米хаилович·特列тья科夫于1856年开始收藏俄罗斯画作，并于1892年将他的藏品捐赠给莫斯科。",
    link: { to: "/litsa#person-tretyakov", label: "帕вел·特列тья科夫" },
  },
  {
    kind: "single",
    id: "azbuka-mecenat",
    question: "门户网站《字母表》中“赞助人”一词的含义是什么？",
    options: [
      "艺术、科学和教育的赞助人",
      "修道院的财务经理",
      "寺庙的捐款收集者",
      "商人行会的会长",
    ],
    correct: 0,
    explain:
      "在《慈善字母表》中，赞助人是艺术、科学和教育的保护者。这个名字可以追溯到盖乌斯·西尔尼乌斯·梅塞纳斯——维吉尔和贺拉斯的赞助人。",
    link: { to: "/azbuka#term-%D0%9C%D0%B5%D1%86%D0%B5%D0%BD%D0%B0%D1%82", label: "字母表 — 字母 M" },
  },
  {
    kind: "single",
    id: "portrait-shuvalov",
    question: "肖像中描绘的是谁？莫斯科大学和艺术学院的创始人。",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/85/Ivan_Shuvalov_by_F.Rokotov_%281760%2C_Hermitage%29.jpg",
    imageAlt: "18世纪赞助人的肖像",
    options: ["伊万·别茨科伊", "尼古拉·鲁мян采夫", "伊万·舒瓦洛夫", "亚历山大·斯特罗ганов"],
    correct: 2,
    explain: "1755年，伊万·舒瓦洛夫与米хаил·瓦сильевич·罗моносов共同创立了莫斯科大学，并于1757年创立了艺术学院。",
    link: { to: "/litsa#person-shuvalov", label: "伊万·舒瓦洛夫" },
  },
  {
    kind: "single",
    id: "msu-year",
    question: "莫斯科大学是哪一年成立的？",
    options: ["1724", "1755", "1764", "1802"],
    correct: 1,
    explain: "伊丽莎白·彼得罗夫娜女皇关于建立莫斯科大学的法令于1755年签署。",
    link: { to: "/nasledie#legacy-msu", label: "遗产 — 莫斯科大学" },
  },
  {
    kind: "multi",
    id: "morozovs",
    question: "以下哪些人属于莫розо夫家族的赞助人和企业家？",
    options: ["萨в瓦·莫розо夫", "瓦рвара·莫розова", "伊万·莫розо夫", "阿列克谢·巴хрушин", "玛ргарита·莫розова", "帕влик·莫розо夫"],
    correct: [0, 1, 2, 4],
    explain: "萨в瓦、瓦рвара、伊万和玛ргарита是著名的莫розо夫商人王朝的代表。巴хрушин来自另一个莫斯科商人家族，而帕влик·莫розо夫是苏联时期的先锋，与该王朝无关。",
    link: { to: "/litsa", label: "人物画廊" },
  },
  {
    kind: "single",
    id: "baku-water",
    question: "谁建造了为巴库提供清洁水的肖拉尔输水管道？",
    options: ["穆萨·纳гиев", "伊曼纽尔·诺贝尔", "哈吉·塔гиев", "阿方斯·沙нявский"],
    correct: 2,
    explain: "哈吉·宰纳拉бдин·塔гиев资助了肖拉尔输水管道的建设——这是巴库最大的工程项目之一。",
    link: { to: "/litsa#person-tagiev", label: "哈吉·塔гиев" },
  },
  {
    kind: "single",
    id: "rumyantsev",
    question: "谁的藏书和手稿构成了俄罗斯国家图书馆的基础？",
    options: ["尼古拉·鲁мян采夫", "科兹马·索лдатенков", "伊万·舒瓦洛夫", "尼古拉·尤супов"],
    correct: 0,
    explain: "尼古拉·鲁мян采夫伯爵将他的藏书和手稿遗赠给国家——这是未来俄罗斯国家图书馆的基础。",
    link: { to: "/litsa#person-rumyantsev", label: "尼古拉·鲁мян采夫" },
  },
  {
    kind: "single",
    id: "era-1861",
    question: "《编年史》中废除农奴制属于哪个时代？",
    options: ["18世纪", "1861年之前", "1861年", "白银时代"],
    correct: 2,
    explain: "1861年2月19日的宣言是一个里程碑，它为俄罗斯慈善事业开创了一个新时代。",
    link: { to: "/letopis/1861", label: "编年史 · 1861" },
  },
  {
    kind: "single",
    id: "portrait-tretyakov",
    question: "伊利亚·列宾的肖像中描绘的是谁？",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/82/Ilja_Jefimowitsch_Repin_-_Portrait_of_Pavel_Mikha%C3%AFlovitch_Tr%C3%A9tiakov.jpg",
    imageAlt: "伊利亚·列宾的肖像",
    options: ["谢尔盖·休金", "帕вел·特列тья科夫", "萨вва·马монтов", "科兹马·索лдатенков"],
    correct: 1,
    explain: "伊利亚·列宾于1883年绘制的帕вел·特列тья科夫的著名肖像。",
    link: { to: "/litsa#person-tretyakov", label: "帕вел·特列тья科夫" },
  },
  {
    kind: "single",
    id: "mht",
    question: "哪位赞助人资助了莫斯科艺术剧院的创建？",
    options: ["萨в瓦·莫розо夫", "谢尔盖·休金", "阿列克谢·巴хрушин", "斯捷пан·雷ябушинский"],
    correct: 0,
    explain: "萨в瓦·莫розо夫于1898年将自己的资金投入到康斯坦丁·斯坦尼斯拉夫斯基和弗拉基米尔·涅米罗维奇-丹琴科的新剧院。",
    link: { to: "/nasledie#legacy-mht", label: "遗产 — 莫斯科艺术剧院" },
  },
  {
    kind: "single",
    id: "tenisheva",
    question: "谁在塔拉什基诺创建了艺术工作室和学校？",
    options: ["瓦рвара·莫розова", "玛ргарита·莫розова", "玛丽亚·捷нишева", "赫里斯тина·阿尔切вская"],
    correct: 2,
    explain: "玛丽亚·捷нишева公主在斯摩棱斯克附近的塔拉什基诺庄园建立了工作室、学校和俄罗斯艺术中心。",
    link: { to: "/litsa#person-tenisheva", label: "玛丽亚·捷нишева" },
  },
  {
    kind: "multi",
    id: "baku-patrons",
    question: "以下哪位赞助人曾在巴库工作？",
    options: ["哈吉·塔吉耶夫", "因诺肯季·西比里亚科夫", "伊曼纽尔·诺贝尔", "穆萨·纳吉耶夫", "尼古拉·布格罗夫"],
    correct: [0, 2, 3],
    explain: "塔吉耶夫、诺贝尔和纳吉耶夫是巴库石油时代的赞助人。西比里亚科夫与伊尔库茨克有关，布格罗夫与下诺夫哥罗德有关。",
    link: { to: "/geografiya#%D0%91%D0%B0%D0%BA%D1%83", label: "善行地理 — 巴库" },
  },
  {
    kind: "single",
    id: "pushkin-museum",
    question: "谁成为普希金国家美术博物馆的主要捐助者？",
    options: ["萨瓦·马蒙托夫", "尤里·涅恰耶夫-马尔佐夫", "帕维尔·特列季亚科夫", "尼古拉·尤苏波夫"],
    correct: 1,
    explain: "尤里·涅恰耶夫-马尔佐夫投入了美术博物馆建设总金额的大约三分之二。",
    link: { to: "/litsa#person-nechaev-maltsov", label: "尤里·涅恰耶夫-马尔佐夫" },
  },
  {
    kind: "single",
    id: "demidov-prize",
    question: "谁设立了在19世纪支持俄罗斯科学的德米多夫奖？",
    options: ["普罗科皮·德米多夫", "阿纳托利·德米多夫", "亚历山大·斯特罗加诺夫", "尼古拉·鲁缅采夫"],
    correct: 1,
    explain: "阿纳托利·德米多夫于1832年设立了德米多夫奖 — 这是革命前俄罗斯最负盛名的科学奖项。",
    link: { to: "/nasledie#legacy-demidov-prize", label: "遗产 — 德米多夫奖" },
  },
  {
    kind: "single",
    id: "form-endowment",
    question: "有一种捐赠类型，其资本不被花费，而是为基金会的目标服务数十年，这种捐赠的名称是什么？",
    options: ["定向援助", "定向资本（捐赠基金）", "公益服务", "企业志愿服务"],
    correct: 1,
    explain: "定向资本（捐赠基金）是根据FZ-275规则投资的长期基金。只有收益用于实现目标。",
    link: { to: "/puti#path-endowment", label: "参与方式 — 捐赠基金" },
  },
  {
    kind: "single",
    id: "potanin-foundation",
    question: "哪位现代赞助人创立了最大的私人文化和教育支持基金会？",
    options: ["阿利舍尔·乌斯马诺夫", "维克托·维克塞尔伯格", "弗拉基米尔·波塔宁", "罗曼·阿布拉莫维奇"],
    correct: 2,
    explain: "弗拉基米尔·波塔宁基金会成立于1999年，支持文化、教育和博物馆运营方面的项目。",
    link: { to: "/litsa#person-potanin", label: "弗拉基米尔·波塔宁" },
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
    title: "新手",
    text: "您刚刚开始您的“先驱”之旅。前方是高尚事迹的完整编年史。请查看“字母表”和“编年史”，以掌握俄罗斯慈善事业的语言。",
    links: [
      { to: "/azbuka", label: "慈善事业字母表" },
      { to: "/letopis", label: "编年史" },
    ],
  },
  {
    min: 5,
    max: 8,
    title: "同伴",
    text: "您熟悉传统并认识标志性人物。打开“面孔”部分 — 它展示了没有这些人物就无法理解俄罗斯慷慨的人生。",
    links: [
      { to: "/litsa", label: "留下光芒的面孔" },
      { to: "/nasledie", label: "遗产" },
    ],
  },
  {
    min: 9,
    max: 12,
    title: "守护者",
    text: "您是“先驱”的细心读者。您不仅知道名字，还了解时代的背景。是时候选择您自己的参与之路了。",
    links: [
      { to: "/puti", label: "参与方式" },
      { to: "/geografiya", label: "善行地理" },
    ],
  },
  {
    min: 13,
    max: 15,
    title: "入门者",
    text: "您已经解读了“赞助人代码”。对您来说，慈善不是一种姿态，而是一种服务方式。加入这项事业 — 参与其中。",
    links: [
      { to: "/prichastnost", label: "参与其中" },
      { to: "/mission", label: "先驱的使命" },
    ],
  },
];