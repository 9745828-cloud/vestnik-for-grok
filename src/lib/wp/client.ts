import { WP_API } from "./config";

/**
 * WP REST raw post shape (subset we use).
 * Поля ACF приходят в `acf`, медиа — через `_embedded["wp:featuredmedia"]`.
 */
export type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  acf?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text?: string;
      caption?: { rendered: string };
    }>;
  };
};

/**
 * Fetch records from a custom post type. Returns [] if WP unreachable.
 * Не бросает исключения — наверху используем fallback на статические данные.
 */
export async function fetchCPT(
  cptSlug: string,
  params: Record<string, string | number> = {},
): Promise<WPPost[]> {
  const search = new URLSearchParams({
    per_page: "100",
    _embed: "1",
    _ts: String(Date.now()),
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });
  const url = `${WP_API}/${cptSlug}?${search.toString()}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn(`[wp] ${cptSlug} responded ${res.status}`);
      return [];
    }
    const data = (await res.json()) as WPPost[];
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn(`[wp] ${cptSlug} fetch failed`, err);
    return [];
  }
}

export function featuredImage(post: WPPost): string | undefined {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

/** Берём ACF-поле как string. Возвращает undefined для пустых. */
export function acfStr(post: WPPost, key: string): string | undefined {
  const v = post.meta?.[key] ?? post.acf?.[key];
  if (typeof v === "string" && v.trim()) return v;
  return undefined;
}

export function acfNum(post: WPPost, key: string): number | undefined {
  const v = post.meta?.[key] ?? post.acf?.[key];
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() && !isNaN(Number(v))) return Number(v);
  return undefined;
}

/** Поле-репитер ACF приходит как массив объектов или строк. */
export function acfList(post: WPPost, key: string): string[] {
  const v = post.meta?.[key] ?? post.acf?.[key];
  if (!v) return [];
  if (Array.isArray(v)) {
    return v
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          // repeater {value: "..."} или {text: "..."}
          const obj = item as Record<string, unknown>;
          const first = obj.value ?? obj.text ?? obj.item ?? Object.values(obj)[0];
          return typeof first === "string" ? first : "";
        }
        return "";
      })
      .filter(Boolean);
  }
  if (typeof v === "string") {
    // допускаем строку, разделённую переносами
    return v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}