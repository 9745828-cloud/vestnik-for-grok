import { useLang } from "@/i18n/lang";
import * as ru from "./content";
import * as en from "./content.en";
import * as zh from "./content.zh";
import * as ar from "./content.ar";

export function useContent() {
  const lang = useLang();
  if (lang === "en") return en;
  if (lang === "zh") return zh;
  if (lang === "ar") return ar;
  return ru;
}

export function useEras() {
  return useContent().ERAS;
}
export function usePersons() {
  return useContent().PERSONS;
}
export function useGlossary() {
  return useContent().GLOSSARY;
}
export function useGeo() {
  return useContent().GEO;
}
export function useLegacy() {
  return useContent().LEGACY;
}
export function useLegacyCategories() {
  return useContent().LEGACY_CATEGORIES;
}
export function useChronicle() {
  return useContent().CHRONICLE;
}
export function usePaths() {
  return useContent().PATHS;
}
export function useValues() {
  return useContent().VALUES;
}
export function useNews() {
  return useContent().NEWS;
}