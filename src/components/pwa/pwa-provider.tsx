"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function PwaProvider() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* registration failed — non-fatal */
    });

    window.addEventListener("appinstalled", () => {
      trackEvent("pwa_installed");
    });
  }, []);

  return null;
}
