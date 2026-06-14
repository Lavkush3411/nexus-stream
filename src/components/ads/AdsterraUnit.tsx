"use client";

import Script from "next/script";
import { useEffect, useId } from "react";
import { ADSTERRA_CDN } from "@/lib/ads-config";

interface AdsterraUnitProps {
  adKey: string;
  format?: "iframe" | "reflink";
  height?: number;
  width?: number;
  className?: string;
}

/**
 * Renders a single Adsterra display unit (banner or native).
 * Paste the key from atOptions or the hex string in your invoke.js URL.
 */
export function AdsterraUnit({
  adKey,
  format = "iframe",
  height = 90,
  width = 728,
  className = "",
}: AdsterraUnitProps) {
  const reactId = useId();
  const containerId = `adsterra-${adKey.slice(0, 8)}-${reactId.replace(/:/g, "")}`;

  useEffect(() => {
    (window as Window & { atOptions?: Record<string, unknown> }).atOptions = {
      key: adKey,
      format,
      height,
      width,
      params: {},
      containerId,
    };
  }, [adKey, format, height, width, containerId]);

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div id={containerId} className="min-h-[60px]" />
      <Script
        id={`adsterra-script-${adKey}`}
        src={`${ADSTERRA_CDN}/${adKey}/invoke.js`}
        strategy="afterInteractive"
      />
    </div>
  );
}
