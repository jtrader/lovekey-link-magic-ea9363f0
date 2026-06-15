// Lightweight client-side custom event tracking.
// Forwards to whichever analytics provider is present on the page
// (Google Analytics, Plausible, or Umami) and logs in dev as a fallback.

type EventProps = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, props: EventProps = {}): void {
  if (typeof window === "undefined") return;

  const w = window as unknown as {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    plausible?: (eventName: string, options?: { props?: EventProps }) => void;
    umami?: { track: (eventName: string, data?: EventProps) => void };
    dataLayer?: unknown[];
  };

  try {
    if (typeof w.gtag === "function") {
      w.gtag("event", name, props);
    }
    if (typeof w.plausible === "function") {
      w.plausible(name, { props });
    }
    if (w.umami && typeof w.umami.track === "function") {
      w.umami.track(name, props);
    }
    // Always push to dataLayer so GTM-style consumers can pick it up.
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: name, ...props });
    }
  } catch {
    // Never let analytics break the UI.
  }

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", name, props);
  }
}
