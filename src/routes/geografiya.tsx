import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import heroGeografiya from "@/assets/hero-geografiya.jpg";
import { PageHero } from "@/components/site/PageHero";
import { useGeo, usePersons } from "@/data/content.localized";
import { useT, usePlural, PLURAL_CITY, PLURAL_COUNTRY } from "@/i18n/lang";
import { focusElementById, getFocusTarget } from "@/lib/focus-target";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { geoOrthographic, geoPath } from "d3-geo";
import { MapPin, Users, Pause, Play, RotateCw, ZoomIn, ZoomOut, ChevronDown, Globe2 } from "lucide-react";

// Lightweight TopoJSON of world countries (110m). CDN-hosted, cached by browser.
const WORLD_TOPO = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Coordinates: [longitude, latitude] for each city
const CITY_COORDS: Record<string, [number, number]> = {
  // Russian variants
  "Рим": [12.50, 41.90],
  "Москва": [37.62, 55.75],
  "Москва — Париж": [37.62, 55.75],
  "Подмосковье": [37.5, 55.5],
  "По всей России": [37.62, 55.75],
  "Санкт-Петербург": [30.31, 59.94],
  "Санкт-Петербург, Россия": [30.31, 59.94],
  "Нижний Новгород": [44.0, 56.32],
  "Нижний Тагил": [59.98, 57.91],
  "Иркутск": [104.28, 52.29],
  "Иркутск, Томск": [104.28, 52.29],
  "Норильск": [88.20, 69.35],
  "Харьков": [36.23, 49.99],
  "Харьков (Слобожанщина)": [36.23, 49.99],
  "Киев": [30.52, 50.45],
  "Анадырь (Чукотка)": [177.51, 64.73],
  "Баку": [49.87, 40.41],
  "Баку — Санкт-Петербург": [49.87, 40.41],
  "Тбилиси": [44.83, 41.72],
  "Ташкент": [69.24, 41.30],
  "Шуша": [46.75, 39.76],
  "Пекин": [116.40, 39.90],
  "Пекин, Китай": [116.40, 39.90],
  "Эр-Рияд": [46.72, 24.69],
  "Шарджа": [55.41, 25.35],
  "Шарджа, ОАЭ": [55.41, 25.35],
  "Доха": [51.53, 25.29],
  "Доха, Катар": [51.53, 25.29],
  "Казань": [49.12, 55.79],
  "Казахстан": [66.92, 48.02],
  "Астана": [71.43, 51.13],
  "Астана, Казахстан": [71.43, 51.13],
  "Багдад": [44.36, 33.31],
  "Беслан": [44.21, 43.19],
  "Гянджа": [46.36, 40.68],
  "Дербент": [48.29, 42.06],
  "Кедабек": [45.81, 40.57],
  "Кедабек, Азербайджан": [45.81, 40.57],
  "Махачкала": [47.50, 42.98],
  "Махачкала — Москва": [47.50, 42.98],
  "Нашвилл, США": [-86.78, 36.16],
  "Нью-Йорк": [-74.0, 40.71],
  "Нью-Йорк, США": [-74.0, 40.71],
  "Питтсбург": [-79.99, 40.44],
  "Ростов-на-Дону": [39.70, 47.23],
  "Сиэтл": [-122.33, 47.61],
  "Сиэтл, США": [-122.33, 47.61],
  "Смоленск": [32.05, 54.78],
  "Смоленская обл.": [32.05, 54.78],
  "Ставрополь": [41.97, 45.04],
  "Тегеран": [51.39, 35.69],
  "Магас": [44.81, 43.17],
  "Нальчик": [43.61, 43.48],
  "Тюмень": [65.53, 57.15],
  "Улан-Удэ": [107.58, 51.83],
  "Чебоксары": [47.25, 56.14],
  "Омаха": [-95.93, 41.26],
  "Кремниевая долина": [-122.18, 37.45],
  "Тульская обл.": [37.62, 54.20],
  "Чукотка — Москва, Россия": [177.51, 64.73],
  "США, Великобритания и весь мир": [-74.0, 40.71],
  // English variants
  "Rome": [12.50, 41.90],
  "Moscow": [37.62, 55.75],
  "Moscow — Paris": [37.62, 55.75],
  "Moscow region": [37.5, 55.5],
  "Across Russia": [37.62, 55.75],
  "Saint Petersburg": [30.31, 59.94],
  "Saint Petersburg, Russia": [30.31, 59.94],
  "Nizhny Novgorod": [44.0, 56.32],
  "Nizhny Tagil": [59.98, 57.91],
  "Irkutsk": [104.28, 52.29],
  "Irkutsk, Tomsk": [104.28, 52.29],
  "Kharkiv": [36.23, 49.99],
  "Kharkiv (Slobozhanshchina)": [36.23, 49.99],
  "Kyiv": [30.52, 50.45],
  "Anadyr (Chukotka)": [177.51, 64.73],
  "Baku": [49.87, 40.41],
  "Baku — Saint Petersburg": [49.87, 40.41],
  "Tbilisi": [44.83, 41.72],
  "Shusha": [46.75, 39.76],
  "Beijing": [116.40, 39.90],
  "Beijing, China": [116.40, 39.90],
  "Riyadh": [46.72, 24.69],
  "Sharjah": [55.41, 25.35],
  "Sharjah, UAE": [55.41, 25.35],
  "Doha": [51.53, 25.29],
  "Doha, Qatar": [51.53, 25.29],
  "Kazan": [49.12, 55.79],
  "Kazakhstan": [66.92, 48.02],
  "Astana": [71.43, 51.13],
  "Astana, Kazakhstan": [71.43, 51.13],
  "Baghdad": [44.36, 33.31],
  "Beslan": [44.21, 43.19],
  "Ganja": [46.36, 40.68],
  "Derbent": [48.29, 42.06],
  "Kedabek": [45.81, 40.57],
  "Gadabay": [45.81, 40.57],
  "Gadabay, Azerbaijan": [45.81, 40.57],
  "Makhachkala": [47.50, 42.98],
  "Makhachkala — Moscow": [47.50, 42.98],
  "Nashville, USA": [-86.78, 36.16],
  "New York": [-74.0, 40.71],
  "New York, USA": [-74.0, 40.71],
  "Pittsburgh": [-79.99, 40.44],
  "Rostov-on-Don": [39.70, 47.23],
  "Seattle": [-122.33, 47.61],
  "Seattle, USA": [-122.33, 47.61],
  "Smolensk": [32.05, 54.78],
  "Smolensk region": [32.05, 54.78],
  "Stavropol": [41.97, 45.04],
  "Tehran": [51.39, 35.69],
  "Magas": [44.81, 43.17],
  "Nalchik": [43.61, 43.48],
  "Tyumen": [65.53, 57.15],
  "Ulan-Ude": [107.58, 51.83],
  "Cheboksary": [47.25, 56.14],
  "Omaha": [-95.93, 41.26],
  "Silicon Valley": [-122.18, 37.45],
  "Tula region": [37.62, 54.20],
  "Chukotka — Moscow, Russia": [177.51, 64.73],
  "USA, UK and worldwide": [-74.0, 40.71],
  "Florence": [11.25, 43.77],
  "Washington": [-77.04, 38.90],
  "Paris": [2.35, 48.86],
  "Париж": [2.35, 48.86],
  "باريس": [2.35, 48.86],
  "巴黎": [2.35, 48.86],
  "Мумбаи": [72.88, 19.08],
  "Лиссабон": [-9.14, 38.72],
  "Бангалор": [77.59, 12.97],
  "Mumbai": [72.88, 19.08],
  "Lisbon": [-9.14, 38.72],
  "Bangalore": [77.59, 12.97],
  "مومباي": [72.88, 19.08],
  "لشبونة": [-9.14, 38.72],
  "بنغالور": [77.59, 12.97],
  "孟买": [72.88, 19.08],
  "里斯本": [-9.14, 38.72],
  "班加罗尔": [77.59, 12.97],
  "Istanbul": [28.98, 41.01],
  "إسطنبول": [28.98, 41.01],
  "伊斯坦布尔": [28.98, 41.01],
  "Стамбул": [28.98, 41.01],
  "Сямэнь": [118.09, 24.48],
  "Токио": [139.69, 35.68],
  "Гонконг": [114.17, 22.32],
  "Xiamen": [118.09, 24.48],
  "Tokyo": [139.69, 35.68],
  "Hong Kong": [114.17, 22.32],
  "شيامن": [118.09, 24.48],
  "طوكيو": [139.69, 35.68],
  "هونغ كونغ": [114.17, 22.32],
  "厦门": [118.09, 24.48],
  "东京": [139.69, 35.68],
  "香港": [114.17, 22.32],
  "Бостон": [-71.06, 42.36],
  "Фес": [-5.00, 34.03],
  "Кордова": [-4.78, 37.88],
  "Самарканд": [66.98, 39.65],
  "Замосць": [23.25, 50.72],
  "Boston": [-71.06, 42.36],
  "Fez": [-5.00, 34.03],
  "Córdoba": [-4.78, 37.88],
  "Samarkand": [66.98, 39.65],
  "Zamość": [23.25, 50.72],
  "بوسطن": [-71.06, 42.36],
  "فاس": [-5.00, 34.03],
  "قرطبة": [-4.78, 37.88],
  "سمرقند": [66.98, 39.65],
  "زاموشتش": [23.25, 50.72],
  "波士顿": [-71.06, 42.36],
  "非斯": [-5.00, 34.03],
  "科尔多瓦": [-4.78, 37.88],
  "撒马尔罕": [66.98, 39.65],
  "扎莫希奇": [23.25, 50.72],

  "London": [-0.13, 51.51],
  "Лондон": [-0.13, 51.51],
  "لندن": [-0.13, 51.51],
  "伦敦": [-0.13, 51.51],
  "Аугсбург": [10.90, 48.37],
  "Каир": [31.24, 30.04],
  "Будапешт": [19.04, 47.50],
  "Augsburg": [10.90, 48.37],
  "Cairo": [31.24, 30.04],
  "Budapest": [19.04, 47.50],
  "أوغسبورغ": [10.90, 48.37],
  "القاهرة": [31.24, 30.04],
  "بودابست": [19.04, 47.50],
  "奥格斯堡": [10.90, 48.37],
  "开罗": [31.24, 30.04],
  "布达佩斯": [19.04, 47.50],

  "Афины": [23.73, 37.98],
  "Athens": [23.73, 37.98],
  "أثينا": [23.73, 37.98],
  "雅典": [23.73, 37.98],

  "Пилани": [75.59, 28.37],
  "Pilani": [75.59, 28.37],
  "بيلاني": [75.59, 28.37],
  "皮拉尼": [75.59, 28.37],
  "Эль-Кувейт": [47.98, 29.38],
  "Kuwait City": [47.98, 29.38],
  "مدينة الكويت": [47.98, 29.38],
  "科威特城": [47.98, 29.38],
  "Монтеррей": [-100.32, 25.69],
  "Monterrey": [-100.32, 25.69],
  "مونتيري": [-100.32, 25.69],
  "蒙特雷": [-100.32, 25.69],
  "Сан-Паулу": [-46.63, -23.55],
  "São Paulo": [-46.63, -23.55],
  "ساو باولو": [-46.63, -23.55],
  "圣保罗": [-46.63, -23.55],

  "Мельбурн": [144.96, -37.81],
  "Melbourne": [144.96, -37.81],
  "ملبورن": [144.96, -37.81],
  "墨尔本": [144.96, -37.81],
  "Киото": [135.77, 35.01],
  "Kyoto": [135.77, 35.01],
  "كيوتو": [135.77, 35.01],
  "京都": [135.77, 35.01],
  "Сеул": [126.98, 37.57],
  "Seoul": [126.98, 37.57],
  "سيول": [126.98, 37.57],
  "首尔": [126.98, 37.57],
  "Чеджу": [126.53, 33.50],
  "Jeju": [126.53, 33.50],
  "جيجو": [126.53, 33.50],
  "济州": [126.53, 33.50],
  "Чикаго": [-87.63, 41.88],
  "Chicago": [-87.63, 41.88],
  "شيكاغو": [-87.63, 41.88],
  "芝加哥": [-87.63, 41.88],

  "Балтимор": [-76.61, 39.29],
  "Baltimore": [-76.61, 39.29],
  "بالتيمور": [-76.61, 39.29],
  "巴尔的摩": [-76.61, 39.29],

};

export const Route = createFileRoute("/geografiya")({
  head: () => ({
    meta: [
      { title: "География добра — карта щедрости" },
      { name: "description", content: "Вращающийся глобус в стиле сепия: меценаты и филантропы на карте мира." },
      { property: "og:title", content: "География добра" },
      { property: "og:description", content: "Где жили и творили щедрые сердца — карта мира." },
    ],
  }),
  component: Geo,
});

function Geo() {
  const t = useT();
  const plural = usePlural();
  const GEO = useGeo();
  const PERSONS = usePersons();
  const [active, setActive] = useState<number | null>(null);
  const [country, setCountry] = useState("");
  const [rotation, setRotation] = useState<[number, number, number]>([-50, -30, 0]);
  const [spinning, setSpinning] = useState(true);
  const [zoom, setZoom] = useState(1);
  const draggingRef = useRef<{ x: number; y: number; rot: [number, number, number] } | null>(null);
  const dragMovedRef = useRef(0);

  const countries = useMemo(() => {
    const set = new Set(GEO.map((g) => g.country));
    return [...set].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  }, [GEO]);

  const citiesInCountry = useMemo(() => {
    if (!country) return [] as { city: string; index: number }[];
    return GEO
      .map((g, index) => ({ city: g.city, index, country: g.country }))
      .filter((x) => x.country === country)
      .sort((a, b) => a.city.localeCompare(b.city, undefined, { sensitivity: "base" }))
      .map(({ city, index }) => ({ city, index }));
  }, [GEO, country]);

  // Auto-rotate
  useEffect(() => {
    if (!spinning) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setRotation(([l, p, g]) => [l + dt * 0.012, p, g]);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [spinning]);

  // Center globe on selected city
  const focusCity = (i: number) => {
    setActive(i);
    setCountry(GEO[i].country);
    const c = CITY_COORDS[GEO[i].city];
    if (c) {
      setSpinning(false);
      setRotation([-c[0], -c[1], 0]);
    }
  };

  const onCountryChange = (value: string) => {
    setCountry(value);
    setActive(null);
  };

  const onCityChange = (cityName: string) => {
    const idx = GEO.findIndex((g) => g.city === cityName && g.country === country);
    if (idx >= 0) focusCity(idx);
  };

  // Deep-link: ?focus=Москва focuses that city on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const city = getFocusTarget();
    if (!city) return;
    const idx = GEO.findIndex((g) => g.city === city);
    if (idx >= 0) {
      focusCity(idx);
      return focusElementById("geo-aside");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    setSpinning(false);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    draggingRef.current = { x: e.clientX, y: e.clientY, rot: rotation };
    dragMovedRef.current = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = draggingRef.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    dragMovedRef.current = Math.max(dragMovedRef.current, Math.abs(dx) + Math.abs(dy));
    setRotation([d.rot[0] + dx * 0.4, Math.max(-85, Math.min(85, d.rot[1] - dy * 0.4)), d.rot[2]]);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const moved = dragMovedRef.current;
    draggingRef.current = null;
    if (moved < 5) {
      // Treat as click — hit-test nearest visible city marker in screen space
      const svg = (e.currentTarget as HTMLElement).querySelector("svg");
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const sx = ((e.clientX - rect.left) / rect.width) * 640;
      const sy = ((e.clientY - rect.top) / rect.height) * 640;
      const path = geoPath(projection);
      let bestIdx = -1;
      let bestDist = Infinity;
      GEO.forEach((g, i) => {
        const coords = CITY_COORDS[g.city];
        if (!coords) return;
        const c = path.centroid({ type: "Point", coordinates: coords } as any);
        if (isNaN(c[0])) return;
        const d = Math.hypot(c[0] - sx, c[1] - sy);
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      });
      if (bestIdx >= 0 && bestDist < 22) {
        focusCity(bestIdx);
      }
    }
  };

  const point = active !== null ? GEO[active] : null;
  const peopleHere = point
    ? PERSONS.filter((p) => point.personSlugs.includes(p.slug))
    : [];

  const cityCount = GEO.length;
  const countryCount = countries.length;

  const selectClass =
    "w-full appearance-none rounded-sm border border-gold/40 bg-gradient-to-b from-[oklch(0.99_0.008_90)] to-[oklch(0.95_0.02_82)] px-3.5 py-2.5 pr-10 text-sm text-ink shadow-[inset_0_1px_0_oklch(1_0_0/0.7)] outline-none transition-colors hover:border-gold focus:border-bordo focus:ring-1 focus:ring-bordo/30 disabled:cursor-not-allowed disabled:opacity-50";

  // For visibility check on the back side of the globe
  const baseScale = 260 * zoom;
  const projection = geoOrthographic().scale(baseScale).translate([320, 320]).rotate(rotation);
  const isVisible = (lon: number, lat: number) => {
    const path = geoPath(projection);
    const c = path.centroid({ type: "Point", coordinates: [lon, lat] } as any);
    return !isNaN(c[0]);
  };

  return (
    <SiteLayout>
      <PageHero image={heroGeografiya}
        eyebrow={t("География добра", "Geography of good")}
        title={t("Карта щедрости", "Map of generosity")}
        intro={t(
          "Поверните глобус, чтобы увидеть, где жили и творили герои «Вестника». От Древнего Рима до Пекина, от Санкт-Петербурга до Дохи — щедрость не знает границ и эпох.",
          "Spin the globe to see where the heroes of the Herald lived and worked. From Ancient Rome to Beijing, from Saint Petersburg to Doha — generosity knows no borders or eras."
        )}
      />

      <section className="paper-bg">
        <div className="container mx-auto px-4 lg:px-8 pt-16 md:pt-20">
          <div className="grid grid-cols-2 max-w-xl mx-auto rounded-sm overflow-hidden border border-gold/40 bg-gradient-to-br from-[oklch(0.96_0.02_82)] to-[oklch(0.92_0.04_80)] shadow-[0_20px_60px_-30px_oklch(0.18_0.05_25/0.4)]">
            <div className="flex flex-col items-center justify-center py-7 px-4 border-r border-gold/30">
              <div className="font-display text-4xl md:text-5xl text-bordo leading-none">{cityCount}</div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-gold mt-2">
                {plural(cityCount, PLURAL_CITY)}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center py-7 px-4">
              <div className="font-display text-4xl md:text-5xl text-bordo leading-none">{countryCount}</div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-gold mt-2">
                {plural(countryCount, PLURAL_COUNTRY)}
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28 grid lg:grid-cols-[1.6fr_1fr] gap-10 items-start">
          <div className="relative bg-gradient-to-br from-[oklch(0.16_0.04_270)] via-[oklch(0.10_0.03_265)] to-[oklch(0.06_0.02_260)] border border-[oklch(0.45_0.08_40)] rounded-sm p-4 md:p-6 overflow-hidden shadow-[0_30px_80px_-30px_oklch(0.10_0.05_260/0.7),inset_0_1px_0_oklch(1_0_0/0.1)]">
            {/* starry sky */}
            <div className="absolute inset-0 pointer-events-none opacity-80" style={{
              backgroundImage: `radial-gradient(1px 1px at 12% 18%, oklch(0.98 0.02 90) 50%, transparent 100%),
                radial-gradient(1.2px 1.2px at 32% 72%, oklch(0.95 0.03 80) 50%, transparent 100%),
                radial-gradient(0.8px 0.8px at 58% 28%, oklch(0.92 0.04 75) 50%, transparent 100%),
                radial-gradient(1.4px 1.4px at 78% 64%, oklch(0.96 0.02 85) 50%, transparent 100%),
                radial-gradient(0.6px 0.6px at 88% 12%, oklch(0.9 0.04 75) 50%, transparent 100%),
                radial-gradient(1px 1px at 22% 88%, oklch(0.94 0.03 82) 50%, transparent 100%),
                radial-gradient(0.8px 0.8px at 46% 48%, oklch(0.92 0.03 80) 50%, transparent 100%),
                radial-gradient(1.2px 1.2px at 68% 8%, oklch(0.95 0.02 85) 50%, transparent 100%),
                radial-gradient(0.6px 0.6px at 8% 56%, oklch(0.88 0.04 75) 50%, transparent 100%),
                radial-gradient(0.9px 0.9px at 92% 82%, oklch(0.96 0.02 85) 50%, transparent 100%)`
            }} />
            {/* paper grain overlay */}
            <div className="absolute inset-0 grain pointer-events-none opacity-30" />
            {/* vignette */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 50%, oklch(0.05 0.02 260 / 0.7) 100%)" }} />

            <div className="relative flex items-center justify-end mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  aria-label="Приблизить"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[oklch(0.92_0.04_75)] to-[oklch(0.78_0.06_60)] border border-[oklch(0.45_0.08_40)] text-[oklch(0.30_0.08_30)] shadow-[inset_0_1px_0_oklch(1_0_0/0.6),0_2px_4px_-1px_oklch(0.05_0.02_260/0.6)] hover:translate-y-[-1px] transition-transform"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setZoom((z) => Math.max(0.6, z - 0.25))}
                  aria-label="Отдалить"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[oklch(0.92_0.04_75)] to-[oklch(0.78_0.06_60)] border border-[oklch(0.45_0.08_40)] text-[oklch(0.30_0.08_30)] shadow-[inset_0_1px_0_oklch(1_0_0/0.6),0_2px_4px_-1px_oklch(0.05_0.02_260/0.6)] hover:translate-y-[-1px] transition-transform"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setSpinning((v) => !v)}
                  aria-label={spinning ? "Остановить вращение" : "Запустить вращение"}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[oklch(0.92_0.04_75)] to-[oklch(0.78_0.06_60)] border border-[oklch(0.45_0.08_40)] text-[oklch(0.30_0.08_30)] shadow-[inset_0_1px_0_oklch(1_0_0/0.6),0_2px_4px_-1px_oklch(0.05_0.02_260/0.6)] hover:translate-y-[-1px] transition-transform"
                >
                  {spinning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => { setRotation([-50, -30, 0]); setZoom(1); }}
                  aria-label="Сбросить"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[oklch(0.92_0.04_75)] to-[oklch(0.78_0.06_60)] border border-[oklch(0.45_0.08_40)] text-[oklch(0.30_0.08_30)] shadow-[inset_0_1px_0_oklch(1_0_0/0.6),0_2px_4px_-1px_oklch(0.05_0.02_260/0.6)] hover:translate-y-[-1px] transition-transform"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div
              className="relative aspect-square max-w-[640px] mx-auto select-none touch-none cursor-grab active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onWheel={(e) => { setZoom((z) => Math.max(0.6, Math.min(3, z - e.deltaY * 0.001))); }}
            >
              {/* outer glow halo */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, oklch(0.85 0.10 80 / 0.25) 0%, transparent 55%)" }} />
              {/* Антикварный глобус — orthographic projection */}
              <ComposableMap
                projection={projection as any}
                width={640}
                height={640}
                style={{ width: "100%", height: "100%", display: "block" }}
              >
                <defs>
                  <radialGradient id="ocean" cx="38%" cy="32%" r="70%">
                    <stop offset="0%" stopColor="oklch(0.88 0.05 80)" />
                    <stop offset="55%" stopColor="oklch(0.74 0.07 65)" />
                    <stop offset="100%" stopColor="oklch(0.46 0.07 45)" />
                  </radialGradient>
                  <radialGradient id="land" cx="35%" cy="28%" r="85%">
                    <stop offset="0%" stopColor="oklch(0.66 0.11 60)" />
                    <stop offset="100%" stopColor="oklch(0.40 0.09 42)" />
                  </radialGradient>
                  <radialGradient id="shine" cx="28%" cy="22%" r="55%">
                    <stop offset="0%" stopColor="oklch(1 0 0 / 0.45)" />
                    <stop offset="60%" stopColor="oklch(1 0 0 / 0.05)" />
                    <stop offset="100%" stopColor="oklch(1 0 0 / 0)" />
                  </radialGradient>
                  <radialGradient id="shadow" cx="72%" cy="78%" r="65%">
                    <stop offset="0%" stopColor="oklch(0.18 0.05 30 / 0)" />
                    <stop offset="100%" stopColor="oklch(0.16 0.05 30 / 0.6)" />
                  </radialGradient>
                  <filter id="grain-f">
                    <feTurbulence baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
                    <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 0.22 0" />
                  </filter>
                </defs>

                {/* океан-сфера */}
                <circle cx={320} cy={320} r={baseScale} fill="url(#ocean)" stroke="oklch(0.32 0.08 35)" strokeWidth={1.5} />

                {/* континенты */}
                <Geographies geography={WORLD_TOPO}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: {
                            fill: "url(#land)",
                            stroke: "oklch(0.30 0.08 35 / 0.75)",
                            strokeWidth: 0.4,
                            outline: "none",
                          },
                          hover: {
                            fill: "oklch(0.72 0.10 70)",
                            stroke: "oklch(0.28 0.10 30)",
                            strokeWidth: 0.6,
                            outline: "none",
                          },
                          pressed: { fill: "oklch(0.66 0.10 65)", outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {/* Метки городов */}
                {GEO.map((g, i) => {
                  const coords = CITY_COORDS[g.city];
                  if (!coords) return null;
                  if (!isVisible(coords[0], coords[1])) return null;
                  const isActive = i === active;
                  const count = g.personSlugs.length;
                  const isOrigin = g.origin;
                  return (
                    <Marker
                      key={g.city}
                      coordinates={coords}
                      onPointerDown={(e: any) => { e.stopPropagation?.(); }}
                      onMouseDown={(e: any) => { e.stopPropagation?.(); }}
                      onClick={(e: any) => { e.stopPropagation?.(); focusCity(i); }}
                      style={{
                        default: { cursor: "pointer" },
                        hover: { cursor: "pointer" },
                        pressed: { cursor: "pointer" },
                      }}
                    >
                      {isOrigin && (
                        <circle r={14} fill="none" stroke="oklch(0.74 0.13 80)" strokeWidth={1.4} opacity={0.9}>
                          <animate attributeName="r" from="8" to={isActive ? "20" : "16"} dur="2.2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.95" to="0" dur="2.2s" repeatCount="indefinite" />
                        </circle>
                      )}
                      {isActive && !isOrigin && (
                        <circle r={12} fill="oklch(0.36 0.12 25 / 0.25)" stroke="oklch(0.36 0.12 25)" strokeWidth={1}>
                          <animate attributeName="r" from="6" to="16" dur="1.6s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.9" to="0" dur="1.6s" repeatCount="indefinite" />
                        </circle>
                      )}
                      {isOrigin && (
                        <path d="M 0 -8 L 1.8 -2.5 L 7.6 -2.5 L 2.9 1 L 4.7 6.6 L 0 3.1 L -4.7 6.6 L -2.9 1 L -7.6 -2.5 L -1.8 -2.5 Z"
                          fill="oklch(0.74 0.13 80)" stroke="oklch(0.30 0.10 40)" strokeWidth={0.6} />
                      )}
                      {!isOrigin && (
                      <circle
                        r={isActive ? 5 : 3.5}
                        fill={isActive ? "oklch(0.36 0.12 25)" : "oklch(0.28 0.08 30)"}
                        stroke="oklch(0.94 0.05 80)"
                        strokeWidth={1.2}
                      />
                      )}
                      {count > 1 && (
                        <text textAnchor="middle" y={-8} style={{ fontFamily: "var(--font-display)", fontSize: 10, fontWeight: 700, fill: "oklch(0.28 0.10 25)" }}>
                          {count}
                        </text>
                      )}
                      <text
                        textAnchor="middle"
                        y={isOrigin ? 20 : isActive ? 18 : 14}
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: isActive ? 13 : 11,
                          fontWeight: isActive ? 700 : 600,
                          fill: isActive ? "oklch(0.20 0.06 30)" : "oklch(0.24 0.07 30)",
                          paintOrder: "stroke",
                          stroke: "oklch(0.96 0.04 82 / 0.92)",
                          strokeWidth: 3,
                          pointerEvents: "none",
                        }}
                      >
                        {g.city}
                      </text>
                      {isOrigin && (
                        <text
                          textAnchor="middle"
                          y={isActive ? 32 : 28}
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 8.5,
                            fontWeight: 700,
                            letterSpacing: "0.5px",
                            fill: "oklch(0.45 0.13 60)",
                            paintOrder: "stroke",
                            stroke: "oklch(0.96 0.04 82 / 0.92)",
                            strokeWidth: 2.5,
                            pointerEvents: "none",
                          }}
                        >
                          {t("Начало меценатства", "Birth of patronage")}
                        </text>
                      )}
                    </Marker>
                  );
                })}

                {/* зерно сепии поверх сферы */}
                <circle cx={320} cy={320} r={baseScale} fill="oklch(0.4 0.05 35)" filter="url(#grain-f)" opacity={0.35} style={{ mixBlendMode: "multiply", pointerEvents: "none" }} />
                {/* блик-сфера */}
                <circle cx={320} cy={320} r={baseScale} fill="url(#shine)" style={{ pointerEvents: "none" }} />
                {/* теневая полусфера */}
                <circle cx={320} cy={320} r={baseScale} fill="url(#shadow)" style={{ pointerEvents: "none" }} />
                {/* золотая окантовка */}
                <circle cx={320} cy={320} r={baseScale + 2} fill="none" stroke="oklch(0.74 0.10 80)" strokeWidth={1.4} opacity={0.9} style={{ pointerEvents: "none" }} />
                <circle cx={320} cy={320} r={baseScale + 12} fill="none" stroke="oklch(0.74 0.10 80 / 0.4)" strokeWidth={0.6} style={{ pointerEvents: "none" }} />
              </ComposableMap>

              {/* розетка ветров — компас в углу */}
              <div className="absolute bottom-3 right-3 text-[oklch(0.30_0.08_30)] opacity-70">
                <svg width="44" height="44" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="20" fill="none" stroke="currentColor" strokeWidth="0.6" />
                  <path d="M22 4 L25 22 L22 40 L19 22 Z" fill="currentColor" opacity="0.6" />
                  <path d="M4 22 L22 19 L40 22 L22 25 Z" fill="currentColor" opacity="0.4" />
                  <text x="22" y="3" textAnchor="middle" fontSize="5" fontFamily="var(--font-display)" fill="currentColor">N</text>
                </svg>
              </div>
            </div>

            <p className="relative mt-5 text-xs text-[oklch(0.85_0.04_80)] italic font-display tracking-wide text-center">
              {t("Вращайте глобус, чтобы повернуть, кликните по городу, чтобы остановить вращение", "Drag the globe to rotate; click a city to stop the rotation")}
            </p>
          </div>

          <aside
            id="geo-aside"
            className="lg:sticky lg:top-24 rounded-sm border border-gold/30 bg-gradient-to-b from-[oklch(0.99_0.01_88)] to-[oklch(0.96_0.02_82)] p-5 md:p-6 shadow-[0_20px_50px_-28px_oklch(0.18_0.05_25/0.35)]"
          >
            <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-4 flex items-center gap-2">
              <Globe2 className="h-3.5 w-3.5" />
              {t("Найти на карте", "Find on the map")}
            </div>
            <div className="font-display text-2xl md:text-3xl text-bordo leading-tight">
              {t("Страна и город", "Country and city")}
            </div>
            <div className="gold-divider my-4 w-16" />
            <p className="text-sm text-foreground/70 leading-relaxed mb-6">
              {t(
                "Выберите страну, затем город — на глобусе откроется точка, ниже появятся меценаты этого региона.",
                "Choose a country, then a city — the globe will focus there and patrons of that region will appear below.",
              )}
            </p>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-gold">
                  <Globe2 className="h-3 w-3" />
                  {t("Страна / регион", "Country / region")}
                </span>
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => onCountryChange(e.target.value)}
                    className={selectClass}
                    aria-label={t("Страна / регион", "Country / region")}
                  >
                    <option value="">
                      {t("Выберите страну…", "Select a country…")}
                    </option>
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bordo/60" />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-gold">
                  <MapPin className="h-3 w-3" />
                  {t("Город", "City")}
                </span>
                <div className="relative">
                  <select
                    value={point?.city ?? ""}
                    onChange={(e) => onCityChange(e.target.value)}
                    disabled={!country}
                    className={selectClass}
                    aria-label={t("Город", "City")}
                  >
                    <option value="">
                      {country
                        ? t("Выберите город…", "Select a city…")
                        : t("Сначала выберите страну", "Select a country first")}
                    </option>
                    {citiesInCountry.map(({ city }) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bordo/60" />
                </div>
              </label>
            </div>

            {!point && (
              <div className="mt-8 rounded-sm border border-dashed border-gold/40 bg-[oklch(0.98_0.015_85)] px-4 py-6 text-center">
                <MapPin className="mx-auto mb-2 h-5 w-5 text-gold" />
                <p className="font-display text-base md:text-lg text-bordo/80 leading-relaxed">
                  {t(
                    "Выберите страну и город, или кликните по маркеру на глобусе",
                    "Select a country and city, or click a marker on the globe",
                  )}
                </p>
              </div>
            )}

            {point && (
              <div className="mt-8 animate-in fade-in duration-300">
                <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2 flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> {point.country}
                </div>
                <div className="font-display text-3xl md:text-4xl text-bordo leading-tight">{point.city}</div>
                <div className="gold-divider my-4 w-14" />
                <p className="text-foreground/80 leading-relaxed text-sm md:text-[15px]">{point.story}</p>

                <div className="mt-7">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3 flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    {t("Меценаты этого региона", "Patrons of this region")}
                    {peopleHere.length > 0 && (
                      <span className="ml-auto rounded-full border border-gold/50 bg-cream/80 px-2 py-0.5 text-[10px] tracking-normal text-bordo font-sans">
                        {peopleHere.length}
                      </span>
                    )}
                  </div>

                  {peopleHere.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">
                      {t("Для этого города пока нет карточек в «Лицах».", "No patron cards for this city yet.")}
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[min(28rem,50vh)] overflow-y-auto pr-1">
                      {peopleHere.map((pp) => (
                        <Link
                          key={pp.slug}
                          to="/litsa/$slug"
                          params={{ slug: pp.slug }}
                          className="group block rounded-sm border border-border/60 bg-card px-4 py-3 transition-all hover:border-gold/70 hover:shadow-[0_8px_24px_-16px_oklch(0.36_0.12_25/0.45)]"
                        >
                          <div className="font-display text-lg text-bordo leading-tight group-hover:text-bordo-deep transition-colors">
                            {pp.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {pp.years} · {pp.era}
                          </div>
                          {pp.short && (
                            <div className="mt-1.5 text-xs text-foreground/65 line-clamp-2 leading-relaxed">
                              {pp.short}
                            </div>
                          )}
                          <div className="mt-2 text-[10px] tracking-[0.2em] uppercase text-gold opacity-0 transition-opacity group-hover:opacity-100">
                            {t("Узнать больше →", "Learn more →")}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
