// Google Analytics (gtag.js) browser tracking for VidsIQ.
// Loaded only in the browser; safe to import from the root route.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// The measurement ID is public. Keep a built-in fallback because self-hosted builds
// (the VPS) are made from GitHub without the hosting-provided environment file.
const VIDSIQ_MEASUREMENT_ID = "G-4M2BJ0JGN2";
const measurementId =
  (import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY"] as string | undefined) ||
  VIDSIQ_MEASUREMENT_ID;

let initialized = false;

export function initAnalytics(): void {
  if (initialized || typeof window === "undefined" || !measurementId) return;
  initialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId);
}

// SPA route changes: gtag only auto-tracks the initial page load.
export function trackPageView(path: string): void {
  if (typeof window === "undefined" || !window.gtag || !measurementId) return;
  window.gtag("event", "page_view", { page_path: path });
}
