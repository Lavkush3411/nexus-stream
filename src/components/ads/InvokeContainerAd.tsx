"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface InvokeContainerAdProps {
  adKey: string;
  cdn: string;
  className?: string;
  minHeight?: number;
}

/**
 * Adsterra / EffectiveCPM format: invoke.js + div#container-{key}
 * Script is inserted right after the container so invoke.js can find it.
 */
export function InvokeContainerAd({
  adKey,
  cdn,
  className,
  minHeight = 90,
}: InvokeContainerAdProps) {
  const containerId = `container-${adKey}`;
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!adKey || !cdn || !containerRef.current) return;

    const src = `${cdn.replace(/\/$/, "")}/${adKey}/invoke.js`;
    const existing = document.querySelector(`script[data-ad-key="${adKey}"]`);
    if (existing) return;

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.setAttribute("data-ad-key", adKey);
    containerRef.current.after(script);

    return () => {
      script.remove();
    };
  }, [adKey, cdn]);

  return (
    <div
      className={cn("flex items-center justify-center overflow-hidden", className)}
      data-ad-slot={containerId}
      aria-hidden="true"
    >
      <div
        ref={containerRef}
        id={containerId}
        style={{ minHeight }}
        className="w-full"
      />
    </div>
  );
}
