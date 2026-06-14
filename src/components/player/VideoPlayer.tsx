"use client";

/**
 * VidSrc iframe player with alternate-source fallback.
 *
 * IMPORTANT: VidSrc intentionally blocks sandboxed iframes via sbx.js — it
 * detects frameElement.sandbox and redirects to /sbx.html which displays
 * "This media is unavailable at the moment." We therefore cannot use the
 * sandbox attribute here. Security is handled by loading the iframe only
 * after an explicit user "Play" click rather than on page load.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

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
  const currentUrl = allUrls[sourceIndex] ?? embedUrl;
  const hasMoreSources = sourceIndex < allUrls.length - 1;

  return (
    <div className={cn("relative w-full", className)}>
      <iframe
        key={currentUrl}
        src={currentUrl}
        title={title}
        className="w-full aspect-video border-0 rounded-lg shadow-2xl bg-black"
        allowFullScreen
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
      />

      {showFallbackControls && allUrls.length > 1 && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <p>
            Source {sourceIndex + 1} of {allUrls.length}
          </p>
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
      )}
    </div>
  );
}
