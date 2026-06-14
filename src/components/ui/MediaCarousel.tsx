"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { MediaCard } from "./MediaCard";
import type { TMDBMediaItem } from "@/types/tmdb";
import type { ContinueWatchingItem } from "@/types/tmdb";

interface MediaCarouselProps {
  title: string;
  items: TMDBMediaItem[];
  /** Map of id → progress for continue-watching row */
  progressMap?: Map<string, number>;
  id?: string;
}

function progressKey(id: number, mediaType: string) {
  return `${mediaType}-${id}`;
}

export function MediaCarousel({
  title,
  items,
  progressMap,
  id,
}: MediaCarouselProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-6" id={id}>
      <div className="flex items-center justify-between px-4 md:px-8 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
          {title}
        </h2>
      </div>

      <div className="relative group/carousel">
        <Swiper
          modules={[Navigation, FreeMode]}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode={{ enabled: true, sticky: false }}
          navigation
          className="!px-4 md:!px-8 media-carousel"
        >
          {items.map((item) => {
            const mediaType = item.media_type ?? (item.title ? "movie" : "tv");
            const progress = progressMap?.get(
              progressKey(item.id, mediaType)
            );
            return (
              <SwiperSlide key={`${mediaType}-${item.id}`} className="!w-auto">
                <MediaCard item={item} progress={progress} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}

/** Build a progress map from continue-watching localStorage items */
export function buildProgressMap(
  items: ContinueWatchingItem[]
): Map<string, number> {
  const map = new Map<string, number>();
  items.forEach((item) => {
    map.set(progressKey(item.id, item.mediaType), item.progress);
  });
  return map;
}

/** Convert continue-watching items to pseudo TMDB items for the carousel */
export function continueWatchingToMedia(
  items: ContinueWatchingItem[]
): TMDBMediaItem[] {
  return items.map((item) => ({
    id: item.id,
    ...(item.mediaType === "movie"
      ? { title: item.title, release_date: "" }
      : { name: item.title, first_air_date: "" }),
    overview: item.season
      ? `S${item.season} E${item.episode} — Continue watching`
      : "Continue watching",
    poster_path: item.posterPath,
    backdrop_path: item.backdropPath,
    vote_average: 0,
    media_type: item.mediaType,
  }));
}
