import { useLang } from "@/i18n/lang";
import * as ru from "./quiz";
import * as en from "./quiz.en";
import * as zh from "./quiz.zh";
import * as ar from "./quiz.ar";

export function useQuiz() {
  const lang = useLang();
  if (lang === "en") return en.QUIZ;
  if (lang === "zh") return zh.QUIZ;
  if (lang === "ar") return ar.QUIZ;
  return ru.QUIZ;
}
export function useLevels() {
  const lang = useLang();
  if (lang === "en") return en.LEVELS;
  if (lang === "zh") return zh.LEVELS;
  if (lang === "ar") return ar.LEVELS;
  return ru.LEVELS;
}