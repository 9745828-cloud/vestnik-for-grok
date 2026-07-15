// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/**
 * Nitro is required for a real SSR deploy.
 * - On Vercel: VERCEL=1 → force preset "vercel" (otherwise Vercel serves nothing → NOT_FOUND).
 * - Elsewhere (local / Cloudflare / self-host): nitro: true so builds produce a server bundle
 *   (defaultPreset cloudflare-module; Nitro can still auto-detect host when applicable).
 * - Dev (`vite dev`) does not need nitro; the plugin only runs on `vite build`.
 */
export default defineConfig({
  nitro: process.env.VERCEL ? { preset: "vercel" } : true,
});
