"use client";

/**
 * VidSrc iframe player. Ad guard routes through /api/embed-proxy which injects
 * popup-blocking scripts. Falls back to direct embed if proxy is unreachable.
 */

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { toProxiedEmbedUrl } from "@/lib/embed-guard";

interface VideoPlayerProps {
  embedUrl: string;
  fallbackUrls?: string[];
  title: string;
  className?: string;
  showFallbackControls?: boolean;
}

export function VideoPlayer({
  embedUrl,
  fallbackUrls = [],
  title,
  className,
  showFallbackControls = true,
}: VideoPlayerProps) {
  const allUrls = [embedUrl, ...fallbackUrls.filter((u) => u !== embedUrl)];
  const [sourceIndex, setSourceIndex] = useState(0);
  const [useProxy, setUseProxy] = useState(true);
  const [proxyOk, setProxyOk] = useState<boolean | null>(null);
  const currentUrl = allUrls[sourceIndex] ?? embedUrl;
  const hasMoreSources = sourceIndex < allUrls.length - 1;

  const proxiedUrl = toProxiedEmbedUrl(currentUrl);
  const guardActive = useProxy && proxyOk !== false;
  const iframeSrc = guardActive ? proxiedUrl : currentUrl;

  useEffect(() => {
    if (!useProxy) {
      setProxyOk(null);
      return;
    }

    let cancelled = false;
    setProxyOk(null);

    fetch(proxiedUrl, { method: "GET", credentials: "same-origin" })
      .then((res) => {
        if (!cancelled) setProxyOk(res.ok);
      })
      .catch(() => {
        if (!cancelled) setProxyOk(false);
      });

    return () => {
      cancelled = true;
    };
  }, [proxiedUrl, useProxy, sourceIndex]);

  return (
    <div className={cn("relative w-full", className)}>
      <iframe
        key={`${iframeSrc}-${sourceIndex}`}
        src={iframeSrc}
        title={title}
        className="w-full aspect-video border-0 rounded-lg shadow-2xl bg-black"
        allowFullScreen
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <div className="flex flex-wrap items-center gap-3">
          {showFallbackControls && allUrls.length > 1 && (
            <span>
              Source {sourceIndex + 1} of {allUrls.length}
            </span>
          )}
          {useProxy && proxyOk === false && (
            <span className="text-amber-400">Ad guard unavailable — direct stream</span>
          )}
          <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useProxy}
              onChange={(e) => setUseProxy(e.target.checked)}
              className="rounded border-white/20"
            />
            Ad guard
          </label>
        </div>

        {hasMoreSources && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => setSourceIndex((i) => i + 1)}
            className="text-neon-blue hover:text-neon-blue"
          >
            Try alternate source →
          </Button>
        )}
      </div>
    </div>
  );
}
