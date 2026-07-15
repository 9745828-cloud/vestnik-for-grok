// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/**
 * Nitro builds a deployable server bundle.
 * Pinned to Cloudflare (Workers / Pages) for hosting deploy via wrangler.
 * Outside Lovable sandbox nitro is off unless enabled — force-on here.
 */
export default defineConfig({
  nitro: {
    preset: "cloudflare-module",
  },
});
