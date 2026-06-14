"use client";

import { useEffect, useRef } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { Button } from "@/components/ui/Button";

interface InlinePlayerSectionProps {
  embedUrl: string;
  fallbackUrls?: string[];
  title: string;
  subtitle?: string;
  onClose?: () => void;
}

/**
 * In-page embedded player — stays in the normal document flow so the rest
 * of the site (navbar, DevTools, scrolling) remains fully usable.
 */
export function InlinePlayerSection({
  embedUrl,
  fallbackUrls,
  title,
  subtitle,
  onClose,
}: InlinePlayerSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [embedUrl]);

  return (
    <section
      ref={sectionRef}
      id="video-player"
      className="mt-8 rounded-2xl border border-white/10 bg-surface overflow-hidden shadow-2xl"
      aria-label={`Now playing: ${title}`}
    >
      <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-3 border-b border-white/10 bg-surface-light/50">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted truncate">{subtitle}</p>
          )}
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Hide player"
            className="flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Hide
          </Button>
        )}
      </div>

      <div className="p-4 md:p-6">
        <VideoPlayer
          embedUrl={embedUrl}
          fallbackUrls={fallbackUrls}
          title={title}
        />
        <p className="mt-3 text-center text-xs text-muted">
          Streaming via third-party embed. NexusStream does not host any video content.
        </p>
      </div>
    </section>
  );
}
