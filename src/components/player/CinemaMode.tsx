"use client";

import { useEffect } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { Button } from "@/components/ui/Button";

interface CinemaModeProps {
  embedUrl: string;
  fallbackUrls?: string[];
  title: string;
  subtitle?: string;
  onClose: () => void;
}

/**
 * Full-width cinema overlay that slides the player into view.
 * Locks body scroll while open and closes on Escape.
 */
export function CinemaMode({
  embedUrl,
  fallbackUrls,
  title,
  subtitle,
  onClose,
}: CinemaModeProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`Now playing: ${title}`}
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/10">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {subtitle && (
            <p className="text-sm text-white/60">{subtitle}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/10"
          aria-label="Close player"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Close
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
        <div className="w-full max-w-6xl">
          <VideoPlayer
            embedUrl={embedUrl}
            fallbackUrls={fallbackUrls}
            title={title}
          />

          <div className="mt-4 space-y-2 text-center text-xs text-white/40">
            <p>
              Streaming via third-party embed. NexusStream does not host any video content.
            </p>
            <p>
              If playback fails on one source, use &ldquo;Try alternate source&rdquo; to cycle
              through VidSrc mirror domains.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
