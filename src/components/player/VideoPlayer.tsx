"use client";

/**
 * Sandboxed VidSrc iframe player.
 *
 * Security: the sandbox attribute deliberately omits allow-popups,
 * allow-top-navigation, and allow-modals to block ad-jacking redirects.
 * Only scripts, same-origin, and forms are permitted — enough for the
 * embed player to function while limiting malicious behavior.
 */

import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  embedUrl: string;
  title: string;
  className?: string;
}

export function VideoPlayer({ embedUrl, title, className }: VideoPlayerProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <iframe
        src={embedUrl}
        title={title}
        className="w-full aspect-video border-0 rounded-lg shadow-2xl"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}
