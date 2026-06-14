"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getImageUrl } from "@/lib/tmdb";
import { formatRating, getDisplayTitle, truncate } from "@/lib/utils";
import type { TMDBMediaItem } from "@/types/tmdb";

interface HeroBannerProps {
  item: TMDBMediaItem;
  onPlay: () => void;
}

export function HeroBanner({ item, onPlay }: HeroBannerProps) {
  const title = getDisplayTitle(item);
  const mediaType = item.media_type ?? (item.title ? "movie" : "tv");
  const href = mediaType === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;

  return (
    <section className="relative h-[60vh] min-h-[420px] max-h-[700px] w-full overflow-hidden">
      {/* Backdrop */}
      <Image
        src={getImageUrl(item.backdrop_path, "w1280")}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Gradient overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8 pb-12 md:pb-16">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center rounded-full bg-crimson/20 px-3 py-1 text-xs font-semibold text-crimson uppercase tracking-wider">
                Trending
              </span>
              <span className="text-sm text-neon-blue font-medium">
                ★ {formatRating(item.vote_average)}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              {title}
            </h1>

            <p className="mt-4 text-base md:text-lg text-white/70 leading-relaxed line-clamp-3">
              {truncate(item.overview, 220)}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" onClick={onPlay} className="gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Now
              </Button>
              <Link href={href}>
                <Button variant="secondary" size="lg">
                  More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
