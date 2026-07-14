import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { LanguageProvider } from "@/i18n/lang";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  // Static fallback shell; language toggle is unavailable here without provider context.
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="font-display text-[8rem] leading-none text-bordo">404</div>
        <h2 className="mt-2 font-display text-2xl text-foreground">Page not found / Страница не найдена</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Perhaps it has moved to the archive or has not yet been written by the chroniclers.
        </p>
        <div className="mt-7">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-bordo text-cream text-xs uppercase tracking-[0.22em] hover:bg-[oklch(0.30_0.10_25)] transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  ssr: false,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Вестник мецената и филантропа — летопись благородных дел" },
      { name: "description", content: "Сетевое издание о меценатах и филантропах России и стран СНГ. История, лица, география и пути благородного участия." },
      { name: "author", content: "Вестник мецената и филантропа" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Вестник мецената и филантропа" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#5B1A1F" },
      { property: "og:title", content: "Вестник мецената и филантропа — летопись благородных дел" },
      { name: "twitter:title", content: "Вестник мецената и филантропа — летопись благородных дел" },
      { property: "og:description", content: "Сетевое издание о меценатах и филантропах России и стран СНГ. История, лица, география и пути благородного участия." },
      { name: "twitter:description", content: "Сетевое издание о меценатах и филантропах России и стран СНГ. История, лица, география и пути благородного участия." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/faf31907-8d53-410b-9511-155e9fa5bd5a/id-preview-d490b0dd--96a07f15-a859-4661-b390-a1c56a66e2b0.lovable.app-1777913456756.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/faf31907-8d53-410b-9511-155e9fa5bd5a/id-preview-d490b0dd--96a07f15-a859-4661-b390-a1c56a66e2b0.lovable.app-1777913456756.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 5 * 60_000, retry: 1, refetchOnWindowFocus: false } },
  }));
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Outlet />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
