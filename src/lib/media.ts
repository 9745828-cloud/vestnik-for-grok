/**
 * Resolve portrait/legacy image paths so they work after production deploy.
 *
 * Production (vestnikmecenata.ru) serves static files from document root under
 * `/portraits/*` and `/legacy/*` when those files exist. New files that were never
 * uploaded return 404. Lovable `/__l5e/...` URLs also 404 on this host.
 *
 * This module maps logical paths (and Lovable __l5e basenames) to Vite-bundled
 * assets under `/assets/*-hash.ext`, which are included in the build output.
 * After a full site rebuild + deploy, images work without relying on public/.
 *
 * Absolute https:// and already-bundled `/assets/` URLs are left unchanged.
 */

const portraitModules = import.meta.glob(
  "../assets/portraits/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true, import: "default" },
) as Record<string, string>;

const legacyModules = import.meta.glob(
  "../assets/legacy-photos/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true, import: "default" },
) as Record<string, string>;

function basename(p: string): string {
  const q = p.split("?")[0].split("#")[0];
  const parts = q.split("/");
  return decodeURIComponent(parts[parts.length - 1] || q);
}

function buildMap(modules: Record<string, string>): Map<string, string> {
  const map = new Map<string, string>();
  for (const [modPath, url] of Object.entries(modules)) {
    if (typeof url !== "string" || !url) continue;
    const name = basename(modPath);
    map.set(name, url);
    map.set(name.toLowerCase(), url);
    const noExt = name.replace(/\.[^.]+$/, "");
    if (!map.has(noExt)) map.set(noExt, url);
    if (!map.has(noExt.toLowerCase())) map.set(noExt.toLowerCase(), url);
  }
  return map;
}

const PORTRAIT_MAP = buildMap(portraitModules);
const LEGACY_MAP = buildMap(legacyModules);

function lookup(map: Map<string, string>, name: string): string | undefined {
  return (
    map.get(name) ||
    map.get(name.toLowerCase()) ||
    map.get(name.replace(/\.[^.]+$/, "")) ||
    map.get(name.replace(/\.[^.]+$/, "").toLowerCase())
  );
}

function resolveFromMap(
  src: string | undefined | null,
  map: Map<string, string>,
): string {
  if (!src) return "";

  // Remote / data URLs
  if (/^(https?:|data:|blob:)/i.test(src)) return src;

  // Already a Vite-hashed asset from another import
  if (src.startsWith("/assets/")) return src;

  // Public path, Lovable path, or bare filename — resolve by basename
  const name = basename(src);
  const hit = lookup(map, name);
  if (hit) return hit;

  // Fallback: keep original (works in vite dev / if file exists on Apache)
  return src;
}

/** Resolve a person portrait path to a deploy-safe URL. */
export function resolvePortrait(src: string | undefined | null): string {
  if (!src) return "";
  // Prefer portrait pack; fall back to legacy pack (rare shared images)
  const byPortrait = resolveFromMap(src, PORTRAIT_MAP);
  if (byPortrait !== src || /^(https?:|data:|blob:|\/assets\/)/i.test(src)) {
    // if map hit, byPortrait is hashed URL; if remote, resolveFromMap returned as-is
    if (lookup(PORTRAIT_MAP, basename(src))) return byPortrait;
    if (/^(https?:|data:|blob:|\/assets\/)/i.test(src)) return src;
  }
  const byLegacy = lookup(LEGACY_MAP, basename(src));
  if (byLegacy) return byLegacy;
  return byPortrait;
}

/** Resolve a legacy card image path to a deploy-safe URL. */
export function resolveLegacyImage(src: string | undefined | null): string {
  if (!src) return "";
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  if (src.startsWith("/assets/")) return src;

  const name = basename(src);
  // Some cards point at /portraits/…
  if (src.includes("/portraits/") || src.includes("portraits/")) {
    const p = lookup(PORTRAIT_MAP, name);
    if (p) return p;
  }
  const l = lookup(LEGACY_MAP, name);
  if (l) return l;
  const p = lookup(PORTRAIT_MAP, name);
  if (p) return p;
  return src;
}
