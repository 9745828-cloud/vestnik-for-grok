import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import UI_ZH from "./ui.zh";
import UI_AR from "./ui.ar";

export type Lang = "ru" | "en" | "zh" | "ar";

const SUPPORTED: Lang[] = ["ru", "en", "zh", "ar"];
const RTL_LANGS: Lang[] = ["ar"];

const UI_DICT: Partial<Record<Lang, Record<string, string>>> = {
  zh: UI_ZH,
  ar: UI_AR,
};

/** Translates an English UI string into the active language via the UI dictionary. */
function uiTranslate(lang: Lang, en: string): string {
  if (lang === "ru" || lang === "en") return en;
  return UI_DICT[lang]?.[en] ?? en;
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; locked: boolean };
const LangContext = createContext<Ctx>({ lang: "ru", setLang: () => {}, locked: false });

const STORAGE_KEY = "vmf-lang";

/**
 * Язык по умолчанию задаётся при сборке через VITE_DEFAULT_LANG ("ru" | "en" | "zh" | "ar").
 * Если VITE_LOCK_LANG === "true" — язык фиксируется и переключатель скрывается.
 */
const DEFAULT_LANG: Lang = (() => {
  const v = (import.meta.env.VITE_DEFAULT_LANG as string | undefined)?.toLowerCase();
  return SUPPORTED.includes(v as Lang) ? (v as Lang) : "ru";
})();
const LANG_LOCKED: boolean =
  String(import.meta.env.VITE_LOCK_LANG ?? "").toLowerCase() === "true";

function applyDocLang(l: Lang) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = l;
  document.documentElement.dir = RTL_LANGS.includes(l) ? "rtl" : "ltr";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Язык залочен сборкой — игнорируем сохранённое значение и язык браузера.
    if (LANG_LOCKED) {
      setLangState(DEFAULT_LANG);
      return;
    }
    const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && SUPPORTED.includes(saved)) setLangState(saved);
    else {
      const nav = window.navigator?.language?.toLowerCase() ?? "";
      if (nav.startsWith("en")) setLangState("en");
      else if (nav.startsWith("zh")) setLangState("zh");
      else if (nav.startsWith("ar")) setLangState("ar");
    }
  }, []);

  const setLang = (l: Lang) => {
    if (LANG_LOCKED) return;
    setLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, l);
      applyDocLang(l);
    }
  };

  useEffect(() => {
    applyDocLang(lang);
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, locked: LANG_LOCKED }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): Lang {
  return useContext(LangContext).lang;
}

export function useSetLang() {
  return useContext(LangContext).setLang;
}

/** Заблокирован ли выбор языка (VITE_LOCK_LANG=true). */
export function useLangLocked(): boolean {
  return useContext(LangContext).locked;
}

/** Picks one of two translations based on current language. */
export function useT() {
  const lang = useLang();
  return (ru: string, en: string) => {
    if (lang === "ru") return ru;
    return uiTranslate(lang, en);
  };
}

/** Inline helper component: <Tx ru="..." en="..." /> */
export function Tx({ ru, en }: { ru: string; en: string }) {
  const lang = useLang();
  return <>{lang === "ru" ? ru : uiTranslate(lang, en)}</>;
}