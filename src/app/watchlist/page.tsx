"use client";

import Link from "next/link";
import { MediaCard } from "@/components/ui/MediaCard";
import { Button } from "@/components/ui/Button";
import { SiteBannerSlot } from "@/components/ads/SiteAds";
import { useUserData } from "@/context/UserDataContext";
import type { TMDBMediaItem } from "@/types/tmdb";

export default function WatchlistPage() {
  const { watchlist, isHydrated, removeFromWatchlist } = useUserData();

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
        <div className="h-8 w-48 bg-surface-light rounded animate-shimmer" />
      </div>
    );
  }

  const items: TMDBMediaItem[] = watchlist.map((item) => ({
    id: item.id,
    ...(item.mediaType === "movie"
      ? { title: item.title }
      : { name: item.title }),
    overview: "",
    poster_path: item.posterPath,
    backdrop_path: null,
    vote_average: 0,
    media_type: item.mediaType,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">My Watchlist</h1>
      <p className="text-muted mb-8">
        {watchlist.length} title{watchlist.length !== 1 ? "s" : ""} saved
      </p>

      <SiteBannerSlot slotId="watchlist-top" className="mb-8" />

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted mb-4">Your watchlist is empty.</p>
          <Link href="/browse">
            <Button>Browse Content</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {watchlist.map((item) => (
            <div key={`${item.mediaType}-${item.id}`} className="relative group">
              <MediaCard
                item={{
                  id: item.id,
                  ...(item.mediaType === "movie"
                    ? { title: item.title }
                    : { name: item.title }),
                  overview: "",
                  poster_path: item.posterPath,
                  backdrop_path: null,
                  vote_average: 0,
                  media_type: item.mediaType,
                }}
                className="!w-full"
              />
              <button
                onClick={() => removeFromWatchlist(item.id, item.mediaType)}
                className="absolute top-2 left-2 z-10 rounded-full bg-black/70 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-crimson"
                aria-label="Remove from watchlist"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <SiteBannerSlot slotId="watchlist-after-grid" className="mt-8" />
    </div>
  );
}
