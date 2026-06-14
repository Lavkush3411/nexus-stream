"use client";

import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/tmdb";
import { cn, formatRating, getDisplayTitle } from "@/lib/utils";
import type { TMDBMediaItem } from "@/types/tmdb";

interface MediaCardProps {
  item: TMDBMediaItem;
  href?: string;
  /** Show progress bar for continue-watching items */
  progress?: number;
  className?: string;
  priority?: boolean;
}

export function MediaCard({
  item,
  href,
  progress,
  className,
  priority = false,
}: MediaCardProps) {
  const title = getDisplayTitle(item);
  const mediaType = item.media_type ?? (item.title ? "movie" : "tv");
  const linkHref =
    href ?? (mediaType === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`);

  return (
    <Link
      href={linkHref}
      className={cn(
        "group flex-shrink-0 w-[160px] sm:w-[180px] transition-transform duration-300 hover:scale-[1.03]",
        className
      )}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface-light shadow-lg">
        <Image
          src={getImageUrl(item.poster_path, "w342")}
          alt={title}
          fill
          sizes="(max-width: 640px) 160px, 180px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating badge */}
        <div className="absolute top-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold text-neon-blue backdrop-blur-sm">
          ★ {formatRating(item.vote_average)}
        </div>

        {/* Progress bar */}
        {progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-crimson transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-xs text-white/90 line-clamp-2">{item.overview}</p>
        </div>
      </div>

      <h3 className="mt-2.5 text-sm font-medium text-foreground line-clamp-1 group-hover:text-crimson transition-colors">
        {title}
      </h3>
      <p className="text-xs text-muted capitalize">
        {mediaType === "movie"
          ? item.release_date?.slice(0, 4) ?? "Movie"
          : item.first_air_date?.slice(0, 4) ?? "TV Series"}
      </p>
    </Link>
  );
}
