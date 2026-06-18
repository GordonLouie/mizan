/**
 * PostHogProvider
 *
 * Initializes PostHog product analytics on the client.
 * Lets us see how users actually use HalalGauge — which pages they visit, what
 * tickers they screen, which scholar they pick, time-on-page, etc.
 *
 * Direct response to BOTH Toby + Miqdad's "hook it up to posthog" suggestion.
 *
 * Setup:
 *   1. Sign up at https://posthog.com (free tier: 1M events/month)
 *   2. Create a project, copy the "Project API Key" (starts with phc_...)
 *   3. Add to .env.local AND Vercel env vars:
 *        NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
 *        NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com   (or eu.i.posthog.com)
 *   4. Redeploy — events start flowing immediately
 *
 * If env vars are absent, this component is a no-op. The site works fine
 * without PostHog; analytics just doesn't track anything.
 */

"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

let initialized = false;

function initOnce() {
  if (initialized) return;
  if (typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  if (!key) return; // Env vars not set — silently skip

  posthog.init(key, {
    api_host: host,
    capture_pageview: false, // we handle it manually so we can include search params
    capture_pageleave: true,
    persistence: "localStorage",
    autocapture: true,
    person_profiles: "identified_only",
  });
  initialized = true;
}

export default function PostHogProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initOnce();
  }, []);

  // Manually track page views so we capture the ticker query string
  // (e.g., /screen?ticker=AAPL is a different event from /screen?ticker=MSFT)
  useEffect(() => {
    if (!initialized) return;
    const url =
      pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

/**
 * Helper to track custom events from anywhere in the app.
 * Use sparingly — autocapture handles most clicks/forms automatically.
 * Reserve manual events for high-signal moments: scholar changed, stock
 * screened, watchlist added, etc.
 */
export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (!initialized) return;
  try {
    posthog.capture(name, properties);
  } catch {
    // never throw from analytics
  }
}
