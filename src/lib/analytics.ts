type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: AnalyticsPayload[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Lightweight analytics — forwards to gtag/dataLayer when present, logs in dev. */
export function trackEvent(name: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;

  const event = {
    event: name,
    device_type: window.matchMedia("(max-width: 1023px)").matches
      ? "mobile"
      : "desktop",
    ...payload,
  };

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event);
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);

  if (typeof window.gtag === "function") {
    window.gtag("event", name, payload);
  }
}

export function trackPageView(path: string) {
  trackEvent("page_view", { path });
}
