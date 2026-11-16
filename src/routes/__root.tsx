import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import poppinsRegular from '@fontsource/poppins/files/poppins-latin-400-normal.woff2?url';
import poppinsBold from '@fontsource/poppins/files/poppins-latin-700-normal.woff2?url';
import poppinsExtraBold from '@fontsource/poppins/files/poppins-latin-800-normal.woff2?url';
import { reportLovableError } from "../lib/lovable-error-reporting";

const recoveryLinks = [
  { label: "Monetization Checker", slug: "monetization-checker" },
  { label: "Channel ID Finder", slug: "channel-id-finder" },
  { label: "Tag Extractor", slug: "tag-extractor" },
  { label: "Money Calculator", slug: "money-calculator" },
  { label: "Thumbnail Viewer", slug: "thumbnail-viewer" },
] as const;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. Here is where you can go:
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {recoveryLinks.map((link) => (
            <li key={link.slug}>
              <Link
                to="/tools/$slug"
                params={{ slug: link.slug }}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              All tools
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Replace these placeholders with the app's name and description when first building the app.
    // Each content route, / included, must still set its own head(). Never add og:image or
    // twitter:image here: every page without its own would inherit the root's preview image.
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "VidsIQ – Free YouTube Creator Tools" },
      { name: "description", content: "Free YouTube tools: check monetization eligibility, audit public channel data, generate metadata, and save permitted assets." },
      { name: "application-name", content: "VidsIQ" },
      { name: "apple-mobile-web-app-title", content: "VidsIQ" },
      { property: "og:site_name", content: "VidsIQ" },
      { property: "og:title", content: "VidsIQ – Free YouTube Creator Tools" },
      { property: "og:description", content: "Free YouTube tools: check monetization eligibility, audit public channel data, generate metadata, and save permitted assets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'VidsIQ',
        url: 'https://vidsiq.com/',
        logo: 'https://vidsiq.com/icon-512.png',
        description: 'Public YouTube channel research, metadata utilities, earnings calculators, and permitted asset downloads.',
      }),
    }],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: 'preload', as: 'font', type: 'font/woff2', href: poppinsRegular, crossOrigin: 'anonymous' },
      { rel: 'preload', as: 'font', type: 'font/woff2', href: poppinsBold, crossOrigin: 'anonymous' },
      { rel: 'preload', as: 'font', type: 'font/woff2', href: poppinsExtraBold, crossOrigin: 'anonymous' },
      { rel: "preconnect", href: "https://i.ytimg.com" },
      { rel: "preconnect", href: "https://yt3.ggpht.com" },
      { rel: "preconnect", href: "https://yt3.googleusercontent.com" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
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
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
