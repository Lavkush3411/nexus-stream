"use client";

import { useLayoutEffect, useId, useRef } from "react";
import { ADSTERRA_CDN } from "@/lib/ads-config";
import { scheduleAdUnitLoad } from "@/lib/ad-load-queue";
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
 * Loads one Adsterra atOptions unit: inline config then invoke.js (sequential queue).
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
    const container = containerRef.current;
    if (!adKey || !container || container.dataset.adLoaded === "1") return;

    container.dataset.adLoaded = "1";

    scheduleAdUnitLoad(
      () =>
        new Promise((resolve) => {
          const opts = {
            key: adKey,
            format,
            height,
            width,
            params: {},
            containerId,
          };

          const configScript = document.createElement("script");
          configScript.type = "text/javascript";
          configScript.text = `atOptions = ${JSON.stringify(opts)};`;

          const invokeScript = document.createElement("script");
          invokeScript.src = `${cdn.replace(/\/$/, "")}/${adKey}/invoke.js`;
          invokeScript.async = false;
          invokeScript.setAttribute("data-cfasync", "false");
          invokeScript.setAttribute("data-ad-slot", containerId);

          const done = () => resolve();
          invokeScript.onload = done;
          invokeScript.onerror = done;

          container.after(configScript);
          configScript.after(invokeScript);
        })
    );
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
