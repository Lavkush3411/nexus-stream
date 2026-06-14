"use client";

import { useEffect } from "react";
import { ADSTERRA_CDN, adsConfig, isPopunderActive } from "@/lib/ads-config";

const SESSION_KEY = "nexusstream_popunder_shown";

/**
 * Loads Adsterra popunder at most once per browser session.
 * Optional — leave NEXT_PUBLIC_ADSTERRA_POPUNDER_KEY empty to disable.
 */
export function PopunderAd() {
  useEffect(() => {
    if (!isPopunderActive()) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    sessionStorage.setItem(SESSION_KEY, "1");

    const key = adsConfig.popunderKey;
    const script = document.createElement("script");
    script.src = `${ADSTERRA_CDN}/${key}/invoke.js`;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
