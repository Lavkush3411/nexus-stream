"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface InvokeContainerAdProps {
  adKey: string;
  cdn: string;
  className?: string;
  minHeight?: number;
}

/**
 * Adsterra / EffectiveCPM format: invoke.js + div#container-{key}
 * Example:
 *   src="https://pl….effectivecpmnetwork.com/{key}/invoke.js"
 *   div id="container-{key}"
 */
export function InvokeContainerAd({
  adKey,
  cdn,
  className,
  minHeight = 90,
}: InvokeContainerAdProps) {
  const containerId = `container-${adKey}`;
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !adKey || !cdn) return;
    loaded.current = true;

    const script = document.createElement("script");
    script.src = `${cdn.replace(/\/$/, "")}/${adKey}/invoke.js`;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    document.body.appendChild(script);
  }, [adKey, cdn]);

  return (
    <div
      className={cn("flex items-center justify-center overflow-hidden", className)}
      aria-hidden="true"
    >
      <div id={containerId} style={{ minHeight }} className="w-full" />
    </div>
  );
}
