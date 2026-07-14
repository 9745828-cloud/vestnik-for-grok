import { useQuery } from "@tanstack/react-query";
import { fetchCPT } from "./client";
import { mapLegacy, mapPerson } from "./mappers";
import type { Person, LegacyItem } from "@/data/content";
import { useContent } from "@/data/content.localized";

const STALE = 0;

/**
 * Список «Лиц». Если в WP создан CPT `litsa` и есть записи —
 * показываем их. Иначе fallback на встроенный список.
 */
export function useLitsa(): { items: Person[]; source: "wp" | "static"; loading: boolean } {
  const STATIC_PERSONS = useContent().PERSONS;
  const q = useQuery({
    queryKey: ["wp", "litsa"],
    queryFn: () => fetchCPT("litsa"),
    staleTime: STALE,
    gcTime: 60_000,
    retry: 1,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
  // Возвращаем статический список — он задаёт полный канон персоналий, тексты и порядок.
  // WP-данные используем только как запасной источник для необязательных медиа-полей,
  // чтобы редакционные правки в коде всегда отображались на сайте сразу.
  const bySlug = new Map((q.data ?? []).map((p) => [p.slug, mapPerson(p)] as const));
  const items = STATIC_PERSONS.map((p) => {
    const wp = bySlug.get(p.slug);
    if (!wp) return p;
    return {
      ...p,
      portrait: p.portrait || wp.portrait,
      portraitCaption: p.portraitCaption ?? wp.portraitCaption,
      portraitFit: p.portraitFit ?? wp.portraitFit,
      portraitPosition: p.portraitPosition ?? wp.portraitPosition,
    };
  });
  return { items, source: "static", loading: q.isLoading };
}

export function useNasledie(): { items: LegacyItem[]; source: "wp" | "static"; loading: boolean } {
  const STATIC_LEGACY = useContent().LEGACY;
  const q = useQuery({
    queryKey: ["wp", "nasledie"],
    queryFn: () => fetchCPT("nasledie"),
    staleTime: STALE,
    gcTime: 60_000,
    retry: 1,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
  // Полный канон и изображения берём из статики: редакционные правки в коде
  // должны отображаться сразу и не перекрываться устаревшими или битыми
  // ссылками из WP. WP используем только как запасной источник для полей,
  // которых нет в статике.
  const bySlug = new Map((q.data ?? []).map((p) => [p.slug, mapLegacy(p)] as const));
  const items = STATIC_LEGACY.map((it) => {
    const wp = bySlug.get(it.slug);
    if (!wp) return it;
    return {
      ...it,
      title: it.title || wp.title,
      year: it.year || wp.year,
      city: it.city || wp.city,
      patron: it.patron || wp.patron,
      short: it.short || wp.short,
      full: it.full || wp.full,
      image: it.image || wp.image,
      details: wp.details && wp.details.length ? wp.details : it.details,
      address: wp.address || it.address,
      imageCredit: it.imageCredit || wp.imageCredit,
    };
  });
  return { items, source: "static", loading: q.isLoading };
}