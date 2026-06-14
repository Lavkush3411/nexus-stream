"use client";

import { useLayoutEffect, useId, useRef } from "react";
import { ADSTERRA_CDN } from "@/lib/ads-config";
import { cn } from "@/lib/utils";

interface AdsterraUnitProps {
  adKey: string;
  format?: "iframe" | "reflink";
  height?: number;
  width?: number;
  cdn?: string;
  className?: string;
}

/**
 * Single Adsterra atOptions unit — sets atOptions then loads invoke.js
 * immediately after its container (safe for multiple units per page).
 */
export function AdsterraUnit({
  adKey,
  format = "iframe",
  height = 90,
  width = 728,
  cdn = ADSTERRA_CDN,
  className = "",
}: AdsterraUnitProps) {
  const reactId = useId();
  const containerId = `adsterra-${adKey.slice(0, 8)}-${reactId.replace(/:/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!adKey || !containerRef.current) return;
    if (document.querySelector(`script[data-ad-key="${adKey}"][data-container="${containerId}"]`)) {
      return;
    }

    (window as Window & { atOptions?: Record<string, unknown> }).atOptions = {
      key: adKey,
      format,
      height,
      width,
      params: {},
      containerId,
    };

    const script = document.createElement("script");
    script.src = `${cdn.replace(/\/$/, "")}/${adKey}/invoke.js`;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.setAttribute("data-ad-key", adKey);
    script.setAttribute("data-container", containerId);
    containerRef.current.after(script);

    return () => {
      script.remove();
    };
  }, [adKey, format, height, width, containerId, cdn]);

  return (
    <div
      className={cn("flex items-center justify-center overflow-hidden", className)}
      aria-hidden="true"
    >
      <div
        ref={containerRef}
        id={containerId}
        style={{ minHeight: height, width: "100%", maxWidth: width }}
      />
    </div>
  );
}
