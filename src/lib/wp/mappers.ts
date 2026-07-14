import type { Person, LegacyItem } from "@/data/content";
import { acfList, acfStr, featuredImage, stripHtml, type WPPost } from "./client";

/**
 * Маппер WP-записи в `Person`.
 * Все поля ACF опциональны — если их нет, берём осмысленные дефолты.
 */
export function mapPerson(post: WPPost): Person {
  const name = stripHtml(post.title.rendered) || post.slug;
  return {
    slug: post.slug,
    name,
    years: acfStr(post, "years") ?? "",
    era: acfStr(post, "era") ?? "",
    region: acfStr(post, "region") ?? "",
    city: acfStr(post, "city") ?? "",
    mapX: Number(acfStr(post, "map_x") ?? 50),
    mapY: Number(acfStr(post, "map_y") ?? 50),
    short: stripHtml(post.excerpt.rendered) || acfStr(post, "short") || "",
    legacy: acfStr(post, "legacy") ?? "",
    bio: stripHtml(post.content.rendered) || acfStr(post, "bio") || "",
    milestones: acfList(post, "milestones"),
    awards: acfList(post, "awards"),
    influence: acfStr(post, "influence") ?? "",
    portrait: featuredImage(post) ?? acfStr(post, "portrait"),
    portraitCaption: acfStr(post, "portrait_caption"),
    portraitFit: (acfStr(post, "portrait_fit") as Person["portraitFit"]) ?? undefined,
    portraitPosition: acfStr(post, "portrait_position"),
    impactLong: acfStr(post, "impact_long"),
  };
}

const LEGACY_CATEGORIES_SET = new Set<LegacyItem["category"]>([
  "galleries", "theatres", "schools", "medicine", "museums",
  "universities", "libraries", "science", "other",
]);

export function mapLegacy(post: WPPost): LegacyItem {
  const rawCat = acfStr(post, "category") ?? "other";
  const category = (LEGACY_CATEGORIES_SET.has(rawCat as LegacyItem["category"])
    ? rawCat
    : "other") as LegacyItem["category"];
  return {
    slug: post.slug,
    category,
    title: stripHtml(post.title.rendered) || post.slug,
    year: acfStr(post, "year") ?? "",
    city: acfStr(post, "city") ?? "",
    patron: acfStr(post, "patron") ?? "",
    short: stripHtml(post.excerpt.rendered) || acfStr(post, "short") || "",
    full: stripHtml(post.content.rendered) || acfStr(post, "full") || "",
    imageHue: acfStr(post, "image_hue") ?? "oklch(0.36 0.10 30)",
    image: featuredImage(post) ?? acfStr(post, "image"),
    details: acfList(post, "details"),
    address: acfStr(post, "address"),
    imageCredit: acfStr(post, "image_credit"),
  };
}