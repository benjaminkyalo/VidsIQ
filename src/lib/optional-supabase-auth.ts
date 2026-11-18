import { createMiddleware } from "@tanstack/react-start";

/**
 * Attaches a signed-in session token to server function calls when backend
 * settings are present, and silently does nothing when they are absent.
 *
 * Self-hosted builds (the VPS) have no backend settings baked into the browser
 * bundle; the generated attacher throws there and breaks every tool request.
 * No server function in this site requires a session, so skipping is safe.
 */
export const optionalSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const url = import.meta.env["VITE_SUPABASE_URL"];
    const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return next();
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
    } catch {
      return next();
    }
  },
);
