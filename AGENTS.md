# Вестник мецената — инструкции для агента

## Жёсткие правила качества (без исключений)

1. **Заглушки запрещены.** Нельзя сдавать задачу с:
   - английским (или русским) текстом в `content.ar.ts` / `content.zh.ts` «временно»;
   - копипастой EN/RU вместо перевода;
   - пустыми/placeholder-портретами «потом заменим»;
   - частичным объёмом (только PERSONS без GEO/LEGACY, только RU без AR/ZH и т.п.).
2. **Весь объём задачи — сразу.** Если просят «добавь меценатов 10–20», в одной сессии закрыть:
   медиа + PERSONS + GEO + LEGACY + CITY_COORDS + **полноценные переводы RU/EN/AR/ZH**.
3. **Ошибки медиа — не маскировать.** Если портрет или фото наследия не удалось скачать (лимит Wikimedia API, 403/404, битый файл, нет свободного фото и т.п.):
   - **нельзя** подставлять заглушки, placeholder-картинки, случайные/чужие фото «на время», hotlink «потом заменим», data-URI, пустые строки, копировать чужой портрет, оставлять внешний URL без локального файла, чтобы «в превью хоть что-то было»;
   - **нельзя** объявлять задачу полностью готовой, если медиа не на диске;
   - тексты (PERSONS / GEO / LEGACY × RU/EN/AR/ZH) и координаты **всё равно** доводить до конца — переводы не урезать из‑за сбоя фото;
   - **по завершении работы** отдельным блоком явно перечислить пользователю, с чем проблема, чтобы он сам нашёл и скачал файлы. Формат:
     ```
     ## Медиа: требуется ручная загрузка
     - [портрет|наследие] slug / ожидаемый путь (public/portraits/… или public/legacy/…)
       причина: …
       что искали / что пробовали: …
     ```
   - после того как пользователь положит файлы в нужные пути, агент при необходимости только проверит пути и `portraitCaption` / `imageCredit`.
4. Экономия времени агента **не оправдание** для заглушек. Лучше дольше, но сразу качественно; при сбое медиа — честный список, а не «обход».

## Источник списка меценатов

- Excel (часть 3, мир): `/Users/dmitry/Desktop/Grok build/меценат/Меценаты_40_часть3.xlsx`
- Excel (часть 4, Российская империя): `/Users/dmitry/Desktop/Grok build/меценат/mecenaty_rossiyskoy_imperii_40_часть4.xlsx`
- **Зелёная заливка строки** = меценат **уже есть** на сайте → не добавлять повторно.
- Порядковый номер в таблице (колонка «№») — идентификатор задачи («добавь №7»), не slug в коде.

## Алгоритм добавления нового мецената

Делать **всё из пунктов ниже**, по аналогии с уже добавленными (Tata, Mukhtarov, Koç, Gulbenkian).  
Не останавливаться на «каноне RU + EN» — AR и ZH входят в обязательный объём.

### 1. Данные из Excel

Из строки: имя (RU), оригинал (EN), годы, страна/регион, эпоха, краткое описание, «что сделали великого», Markdown-блок (если есть).  
Дополнить фактами для `bio`, `milestones`, `legacy`, `impactLong` (без выдуманных дат/цифр).

### 2. Идентификаторы

| Поле | Правило | Примеры |
|------|---------|---------|
| `slug` | латиница, kebab-case | `jamsetji-tata`, `vehbi-koc` |
| Legacy `slug` | отдельный, по институции | `iisc-bangalore`, `mukhtarov-palace` |
| `city` | как в GEO / `CITY_COORDS` | `Мумбаи`, `Баку`, `Стамбул` |
| `mapX` / `mapY` | equirectangular: `x=(lon+180)/360*100`, `y=(90-lat)/180*100` | как у соседних городов в GEO |

### 3. Медиа — канонический метод (жёстко)

**Принцип:** новые фотографии **не через hotlink**. Файл кладётся **в репозиторий** (папки проекта), коммитится, уезжает на хостинг при деплое из git.  
В `content*.ts` в полях `portrait` / `image` — **только локальные пути** вида `"/portraits/…"` / `"/legacy/…"`, **никогда** `https://upload.wikimedia.org/…`, CDN, `/__l5e/…`.

#### 3.1. Куда класть файлы (два каталога, одно имя)

| Тип | 1) `public/` (URL в данных + статика Apache) | 2) `src/assets/` (бандл Vite / media-resolver) |
|-----|-----------------------------------------------|------------------------------------------------|
| Портрет («Лица») | `public/portraits/{slug}.jpg` | `src/assets/portraits/{slug}.jpg` |
| Наследие | `public/legacy/{legacy-slug}.jpg` | `src/assets/legacy-photos/{legacy-slug}.jpg` |

- Имя файла = `slug` сущности (kebab-case), расширение предпочтительно `.jpg` (допустимы `.png` / `.webp` при необходимости — тогда то же имя в данных).
- **Всегда оба места.** После скачивания/получения от пользователя:
  ```bash
  # портрет
  cp public/portraits/{slug}.jpg src/assets/portraits/{slug}.jpg
  # наследие
  cp public/legacy/{legacy-slug}.jpg src/assets/legacy-photos/{legacy-slug}.jpg
  ```
- В данных:
  - `portrait: "/portraits/{slug}.jpg"`
  - `image: "/legacy/{legacy-slug}.jpg"`
- UI: `src/lib/media.ts` (`resolvePortrait` / `resolveLegacyImage`) через `import.meta.glob` подставляет бандл `/assets/*-hash.ext`. Страницы: `litsa.tsx`, `litsa.$slug.tsx`, `nasledie.tsx`, `index.tsx` — **не** вставлять raw URL мимо резолвера.
- **Запрещено:** hotlink Wikimedia/внешних CDN; пути Lovable `/__l5e/…`; импорты только `*.asset.json` без реального файла в `public/` + `src/assets/`; заглушки и чужие портреты.

#### 3.2. Откуда брать файл

1. **От пользователя** (Desktop / «Grok build/Лица|Наследие» и т.п.) — конвертировать в JPEG при необходимости (`sips` / sharp), положить по путям выше.
2. **Скачать агентом** (Wikimedia Commons, официальные сайты, свободные фото):
   - скачать **на диск** в `public/…`, затем `cp` в `src/assets/…`;
   - User-Agent нормальный; при rate limit — паузы, `Special:FilePath`;
   - проверить: размер > ~8 KB, `file` → JPEG/PNG/WebP (не HTML-страница ошибки).
3. Если скачать нельзя — **не** подставлять hotlink/заглушку: тексты довести, в ответе блок «Медиа: требуется ручная загрузка» (правило 3 в начале файла).

#### 3.3. Подписи (credit)

- `portraitCaption` / `imageCredit` — по реальному источнику.
- Если автор/лицензия **неизвестны** — **Wikimedia Commons** (не «Архив редакции»).  
  RU: `Портрет. Wikimedia Commons` · EN: `Portrait. Wikimedia Commons` · AR/ZH: та же логика.  
  Если источник известен (Art UK, IAU, официальный сайт) — указывать его.

#### 3.4. Почему так (кратко, для агента)

- Hotlink на проде хрупкий (блокировки, 403, referrer).
- На `vestnikmecenata.ru` (Apache) пути `/portraits/*` и `/legacy/*` работают **только если файл лежит в web root** после деплоя. Нет файла в репо → 404 на проде, хотя локально `vite dev` мог «скрывать» проблему.
- Дубль в `src/assets/…` + `media.ts` даёт бандл в `/assets/*` при `npm run build` (Cloudflare/Nitro) — страховка, если статика `public/` на каком-то хосте не копируется.
- Медиа **в git** → при деплое из репозитория подтягиваются автоматически (не отдельная ручная FTP-папка «на память»).

#### 3.5. Чеклист медиа при добавлении/замене

```
[ ] Файл в public/portraits|legacy/{slug}.jpg (реальный image, не HTML)
[ ] Та же копия в src/assets/portraits|legacy-photos/{slug}.jpg
[ ] В content.ts / .en / .ar / .zh: путь /portraits/… или /legacy/…, НЕ https://
[ ] Нет /__l5e/ и hotlink
[ ] portraitCaption / imageCredit обновлены
[ ] UI идёт через resolvePortrait / resolveLegacyImage (не обходить)
[ ] После деплоя: GET https://…/portraits|legacy/{file} → 200 image/*
```

### 4. Обязательные правки в данных (4 языковых файла)

Один и тот же набор сущностей дублировать в:

1. `src/data/content.ts` — **русский** (канон)
2. `src/data/content.en.ts` — English
3. `src/data/content.ar.ts` — العربية (**полный перевод**, не EN)
4. `src/data/content.zh.ts` — 中文 (**полный перевод**, не EN)

`content.localized.ts` трогать не нужно: он выбирает файл по языку.

**Переводы:** для каждого поля пользователя (`name`, `short`, `legacy`, `bio`, `milestones`, `awards`, `influence`, `impactLong`, GEO `city`/`country`/`story`, LEGACY `title`/`short`/`full`/`details`/`address`/`imageCredit`/`patron`) — текст на языке файла.  
Допустимы латиницей только имена собственные/бренды (Tate Britain, Le Bon Marché), как в остальных карточках сайта.  
**Нельзя** вставить EN-блок в ar/zh «чтобы быстрее» — это брак сдачи.

#### 4.1. PERSONS (раздел «Лица»)

Добавить объект `Person` (удобно рядом с недавно добавленными, перед `temirkanov` или в логичном месте массива):

```ts
{
  slug, name, years, era, region, city,
  mapX, mapY,
  portrait, portraitCaption,
  // опционально: portraitFit, portraitPosition
  short, legacy, bio,
  milestones: string[],
  awards: string[],
  influence, impactLong,
}
```

Список «Лица» берётся из статики через `useLitsa()` → `useContent().PERSONS` (WP только для опциональных медиа).

#### 4.2. GEO (раздел «География добра» + глобус)

- Если город **уже есть** в `GEO` — добавить `slug` в `personSlugs` и при необходимости обновить `story`.
- Если города **нет** — новая запись:

```ts
{ city: "…", country: "…", x, y, story: "…", personSlugs: ["slug"] }
```

- `city` должен совпадать с ключом в `CITY_COORDS` (см. п. 5).

#### 4.3. LEGACY (раздел «Наследие»)

Одна (или больше) карточка институции, связанной с меценатом:

```ts
{
  slug, category, // galleries | theatres | schools | medicine | museums | universities | libraries | science | other
  title, year, city, patron,
  short, full,
  imageHue, image, imageFit, imagePosition, imageCredit,
  address?, details?,
}
```

Категорию выбирать по сути наследия (вуз → `universities`, музей/фонд-музей → `museums`, дворец/фонд без узкой категории → `other`).

### 5. Глобус — координаты городов

Файл: `src/routes/geografiya.tsx`, объект `CITY_COORDS`.

Добавить **все языковые варианты** названия города, которые встречаются в GEO:

```ts
"Мумбаи": [lon, lat],
"Mumbai": [lon, lat],
// + ar / zh при новых городах
```

Без ключа маркер на глобусе не фокусируется.  
`Баку` / `Стамбул` и др. уже есть — для них достаточно обновить `GEO.personSlugs`.

### 6. Чего не трогать (обычно)

- `src/routes/litsa.tsx`, `nasledie.tsx`, `litsa.$slug.tsx` — списки из данных, не хардкод.
- `routeTree.gen.ts` — генерируется.
- Отдельный роут под каждого мецената не нужен: карточка = элемент `PERSONS` + модалка/страница по `slug`.

### 7. Проверка

- Dev: `http://127.0.0.1:5173` (часто уже `vite dev --host 127.0.0.1 --port 5173`).
- `/litsa` — карточка и портрет.
- `/geografiya` — город в списке, фокус на глобусе, связь с персоной.
- `/nasledie` — карточка наследия с фото.
- Картинки: `GET /portraits/...` и `/legacy/...` → 200.
- Во всех четырёх `content*.ts` есть `slug` персоны, legacy и GEO.

### 8. Чеклист (кратко)

```
[ ] Строка не зелёная в Excel
[ ] Медиа: §3 — public/ + src/assets/ (оба), пути /portraits|/legacy, без hotlink/__l5e
[ ] PERSONS × 4 (ts, en, ar, zh) — ar/zh НЕ на английском
[ ] GEO: city + personSlugs × 4 — города/story переведены
[ ] LEGACY × 4 — title/short/full переведены
[ ] CITY_COORDS (если новый город / RU+EN+AR+ZH имена)
[ ] Нет заглушек / «временно EN» / partial-only
[ ] Если медиа не скачалось — в ответе блок «Медиа: требуется ручная загрузка» (правило 3)
[ ] Превью /litsa, /geografiya, /nasledie
```

## Добавление новостей в «Пульс времени» (жёсткий алгоритм)

**Триггер от пользователя (типичные формулировки):**  
«залил свежие новости», «нужно добавить новости», «обнови пульс», «новости на сайт» и т.п. — **не ждать** уточнений, сразу идти по шагам ниже.

### Источник

- Папка: `/Users/dmitry/Desktop/Grok build/меценат/`
- Файл: Word **`.docx`**, обычно `новости.docx` (имя может чуть отличаться: «Новости», дата в имени и т.п.) — брать **самый свежий** `.docx` про новости в этой папке (игнорировать `~$…` lock-файлы).
- Формат внутри: блоки «заголовок → дата/источник → текст → URL» (иногда нумерация 1), 2)…; иногда дата только в тексте).

### Куда писать

| Что | Где |
|-----|-----|
| Массив | `export const NEWS: NewsItem[]` |
| Файлы | `src/data/content.ts`, `content.en.ts`, `content.ar.ts`, `content.zh.ts` |
| UI | `/puls` (`src/routes/puls.tsx`) — только читает `useNews()`, **роуты не трогать** |
| Поля | `date` (ISO `YYYY-MM-DD`), `title`, `text`, `source?`, `url?` |

### Правила

1. **Порядок в массиве — от новых к старым** (как сейчас в `NEWS`: сверху свежее). После вставки **пересортировать** весь `NEWS` по `date` desc (при равных датах — стабильный порядок).
2. **Только новые** — не дублировать уже существующие (сверять по `url` и/или `title`+`date`).
3. **Дата:**
   - брать из документа (день + месяц + год);
   - формат в коде: `"2026-07-29"`;
   - если пользователь потом уточнил дату («ингосстрах 09.07») — **исправить** и пересортировать;
   - если даты **нет** в docx — **не выдумывать «красивую»** без пометки: спросить пользователя **или** временно поставить осознанный placeholder и **явно сказать** в ответе, какие даты оценочные.
4. **Текст** — по смыслу документа, в стиле существующих карточек (1–3 предложения, без воды и без копипасты «Источник — …» внутрь `text`, если есть поле `source`/`url`).
5. **Переводы обязательны:** полный смысл на **RU / EN / AR / ZH** (не оставлять EN в ar/zh). Имена брендов/площадок латиницей допустимы, как в остальных карточках.
6. **URL** — из документа; если битый/пустой — всё равно завести карточку, `url` опционален.
7. **Не пушить** на GitHub без явной просьбы.
8. **Превью:** `/puls` на `http://127.0.0.1:5173` (при необходимости поднять `npm run dev -- --host 127.0.0.1 --port 5173`).

### Чеклист

```
[ ] Прочитан свежий .docx из Desktop/Grok build/меценат/
[ ] Разобраны все блоки новостей (title, date, text, source, url)
[ ] Нет дублей с уже существующими NEWS
[ ] NEWS × 4 (ts, en, ar, zh) — ar/zh не на английском
[ ] Массив отсортирован date desc (новые сверху)
[ ] Даты ISO; спорные/отсутствующие — отмечены пользователю
[ ] Превью /puls
```

### Ответ пользователю (кратко)

- сколько добавлено;
- таблица дат/заголовков (сверху — самые новые);
- если какие-то даты были без дня в исходнике — перечислить.

## База кода (актуально)

Локальный проект: GitHub `9745828-cloud/vestnik-for-grok` (main) + добавленные меценаты.  
Из Excel-таблицы в коде: **часть 3 №1–42** + **Эдмон де Ротшильд**; **часть 4 (РИ) №1–5** (Нарышкины … Икавитц).

### Уже добавленные из таблицы (slug’ы)

| № | Имя | slug | Город GEO | Legacy slug |
|---|-----|------|-----------|-------------|
| 6 | Джамсетджи Тата | `jamsetji-tata` | Мумбаи | `iisc-bangalore` |
| 7 | Муртуза Мухтаров | `murtuza-mukhtarov` | Баку | `mukhtarov-palace` |
| 8 | Вехби Коч | `vehbi-koc` | Стамбул | `koc-university` |
| 9 | Калуст Гюльбенкян | `calouste-gulbenkian` | Лиссабон | `gulbenkian-foundation` |
| 10 | Альберт Кан | `albert-kahn` | Париж | `archives-of-the-planet` |
| 11 | Тан Ках Ки | `tan-kah-kee` | Сямэнь | `xiamen-university` |
| 12 | Окура Кихатиро | `okura-kihachiro` | Токио | `okura-museum` |
| 13 | Ран Ран Шоу | `run-run-shaw` | Гонконг | `shaw-prize` |
| 14 | Генри Тейт | `henry-tate` | Лондон | `tate-britain` |
| 15 | Маргарита Бусико | `marguerite-boucicaut` | Париж | `hopital-boucicaut` |
| 16 | Изабелла Стюарт Гарднер | `isabella-stewart-gardner` | Бостон | `gardner-museum` |
| 17 | Фатима аль-Фихри | `fatima-al-fihri` | Фес | `al-qarawiyyin` |
| 18 | Аль-Хакам II | `al-hakam-ii` | Кордова | `cordoba-library` |
| 19 | Улугбек | `ulugh-beg` | Самарканд | `ulugh-beg-observatory` |
| 20 | Ян Замойский | `jan-zamoyski` | Замосць | `zamosc-academy` |
| 21 | Якоб Фуггер | `jakob-fugger` | Аугсбург | `fuggerei` |
| 22 | Михримах-султан | `mihrimah-sultan` | Стамбул | `mihrimah-mosque` |
| 23 | Безмиалем Валиде-султан | `bezmialem-valide-sultan` | Стамбул | `dolmabahce-mosque` |
| 24 | Принцесса Фатима Исмаил | `fatima-ismail` | Каир | `cairo-university` |
| 25 | Иштван Сеченьи | `istvan-szechenyi` | Будапешт | `hungarian-academy` |
| 26 | Эвангелис Заппас | `evangelis-zappas` | Афины | `zappeion` |
| 27 | Георгиос Авероф | `georgios-averoff` | Афины | `panathenaic-stadium` |
| 28 | Эмануил Гожду | `emanuil-gojdu` | Будапешт | `gojdu-foundation` |
| 29 | Премчанд Ройчанд | `premchand-roychand` | Мумбаи | `rajabai-tower` |
| 30 | Сэр Дорабджи Тата | `dorabji-tata` | Мумбаи | `sir-dorabji-tata-trust` |
| 31 | Г. Д. Бирла | `gd-birla` | Пилани | `bits-pilani` |
| 32 | Абдул Рахман аль-Сумайт | `abdul-rahman-al-sumait` | Эль-Кувейт | `direct-aid-sumait` |
| 33 | Эухенио Гарса Сада | `eugenio-garza-sada` | Монтеррей | `tec-monterrey` |
| 34 | Ассис Шатобриан | `assis-chateaubriand` | Сан-Паулу | `masp` |
| 35 | Сисилло Матараццо | `ciccillo-matarazzo` | Сан-Паулу | `mam-sao-paulo` |
| 36 | Сидни Майер | `sidney-myer` | Мельбурн | `myer-music-bowl` |
| 37 | Кадзуо Инамори | `kazuo-inamori` | Киото | `kyoto-prize` |
| 38 | Ю Ильхан | `yu-il-han` | Сеул | `yuhan-corporation` |
| 39 | Ким Мандок | `kim-man-deok` | Чеджу | `jeju-mandeok` |
| 40 | Джулиус Розенвальд | `julius-rosenwald` | Чикаго | `rosenwald-schools` |
| 41 | Герман Захарьяев | `german-zakharyayev` | Москва | `stmegi-foundation` |
| 42 | Зарах Илиев | `zarakh-iliev` | Москва / Красная Слобода | `mountain-jews-museum` |
| — | Эдмон де Ротшильд | `edmond-de-rothschild` | Париж / Зихрон-Яаков | `ramat-hanadiv` |
| **ч.4 №1** | Э. Д. Нарышкин | `emmanuil-dmitrievich-naryshkin` | Тамбов | `naryshkin-reading-house` |
| **ч.4 №2** | А. Н. Нарышкина | `alexandra-naryshkina` | Тамбов | `naryshkin-tambov-patronage` |
| **ч.4 №3** | А. М. Носов | `andrey-mikhailovich-nosov` | Тамбов | `nosov-almshouse` |
| **ч.4 №4** | А. И. Толмачёв | `alexander-ivanovich-tolmachyov` | Тамбов | `tolmachyov-schools` |
| **ч.4 №5** | Э. Х. Икавитц | `eduard-ikavits` | Тамбов | `ikavits-zemstvo-medicine` |

## Стек проекта (кратко)

- TanStack Start / Router, React, Vite
- Контент: `src/data/content*.ts`
- Превью: локальный Vite; деплой отдельно (GitHub Pages и т.п.)

## GitHub / экспорт (жёсткое правило)

Репозиторий: `https://github.com/9745828-cloud/vestnik-for-grok` (ветка `main`).

- **По умолчанию работать только локально** в `/Users/dmitry/vestnik-for-grok`.
- **Запрещено** автоматически после правок делать `git push`, force-push, `gh` upload, MCP `push_files` / `create_or_update_file` и любой другой выгрузку в GitHub.
- **Выгрузка в GitHub — только по явной просьбе пользователя** («залей на GitHub», «экспортируй», «запушь», «обнови репозиторий» и т.п.).
- Локальный `git commit` — тоже только если пользователь просит зафиксировать/закоммитить, либо как шаг внутри явного запроса на выгрузку.
- При выгрузке **обязательно включать** новые файлы из `public/portraits`, `public/legacy`, `src/assets/portraits`, `src/assets/legacy-photos` (иначе на проде снова 404).
- Промежуточные локальные бэкапы (папка baseline) **не** равны обновлению GitHub.

## Сборка / деплой

- Target: **Cloudflare** — `vite.config.ts`: `nitro: { preset: "cloudflare-module" }`.
- Локально: `npm run build` → артефакты в `.output/` (public + server).
- Медиа в репо (см. §3) — часть деплоя; не рассчитывать на hotlink «чтобы быстрее».

## Локальные бэкапы (жёсткое правило)

| Роль | Путь | Можно удалять? |
|------|------|----------------|
| **№1 — неприкасаемый** | `/Users/dmitry/vestnik-for-grok-baseline-github-2026-07-13` | **НЕТ. Никогда. Ни сейчас, ни в будущем.** Не удалять, не перезаписывать, не «чистить». |
| **№2 — «Промежуточный бэкап 3»** (актуальная точка 2026-07-30: ч.3 + Ротшильд; ч.4 №1–5 Тамбов; NEWS июль 2026; GEO Тамбов) | `/Users/dmitry/vestnik-for-grok-Промежуточный-бэкап-3` | Только по явной просьбе пользователя |

Агенту **запрещено** удалять первый бэкап по любой причине (в т.ч. «освободить место», «заменить актуальным»).  
Промежуточные бэкапы **не удалять** без явной просьбы пользователя.

Восстановление «Промежуточный бэкап 3» (актуальный):
```bash
rsync -a --delete --exclude node_modules \
  "/Users/dmitry/vestnik-for-grok-Промежуточный-бэкап-3/" \
  "/Users/dmitry/vestnik-for-grok/"
```

