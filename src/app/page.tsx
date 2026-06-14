"use client";

import { useEffect, useState } from "react";
import { HeroBanner } from "@/components/ui/HeroBanner";
import {
  MediaCarousel,
  buildProgressMap,
  continueWatchingToMedia,
} from "@/components/ui/MediaCarousel";
import {
  HeroSkeleton,
  CarouselSkeleton,
} from "@/components/ui/Skeleton";
import { InlinePlayerSection } from "@/components/player/InlinePlayerSection";
import { SiteNativeAd, SiteMidBannerAd } from "@/components/ads/SiteAds";
import { getTrending, getTopRated, getLatestTV, getMovieExternalIds } from "@/lib/api-client";
import { getEmbedFallbackUrls } from "@/lib/vidsrc";
import { getDisplayTitle } from "@/lib/utils";
import { useUserData } from "@/context/UserDataContext";
import type { TMDBMediaItem } from "@/types/tmdb";

export default function HomePage() {
  const { continueWatching, isHydrated, addToHistory, updateContinueWatching } =
    useUserData();

  const [heroItem, setHeroItem] = useState<TMDBMediaItem | null>(null);
  const [trending, setTrending] = useState<TMDBMediaItem[]>([]);
  const [topRated, setTopRated] = useState<TMDBMediaItem[]>([]);
  const [latestTV, setLatestTV] = useState<TMDBMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [embedUrls, setEmbedUrls] = useState<string[]>([]);
  const [playerTitle, setPlayerTitle] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [trendingRes, topRatedRes, latestTVRes] = await Promise.all([
          getTrending("all", "week"),
          getTopRated("movie"),
          getLatestTV(),
        ]);

        const filtered = trendingRes.results.filter(
          (item) => item.media_type === "movie" || item.media_type === "tv"
        );
        setHeroItem(filtered[0] ?? null);
        setTrending(filtered);
        setTopRated(topRatedRes.results);
        setLatestTV(latestTVRes.results);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const handleHeroPlay = () => {
    if (!heroItem) return;
    const mediaType = heroItem.media_type ?? "movie";
    if (mediaType === "movie") {
      openMoviePlayer(heroItem);
    } else {
      window.location.href = `/tv/${heroItem.id}`;
    }
  };

  const openMoviePlayer = async (item: TMDBMediaItem) => {
    const title = getDisplayTitle(item);
    let imdbId: string | null = null;
    try {
      const externalIds = await getMovieExternalIds(item.id);
      imdbId = externalIds.imdb_id;
    } catch {
      /* fall back to TMDB-only URLs */
    }
    const urls = getEmbedFallbackUrls({ tmdbId: item.id, imdbId });
    setEmbedUrls(urls);
    setPlayerTitle(title);
    setPlayerOpen(true);

    addToHistory({
      id: item.id,
      mediaType: "movie",
      title,
      posterPath: item.poster_path,
      backdropPath: item.backdrop_path,
    });
    updateContinueWatching({
      id: item.id,
      mediaType: "movie",
      title,
      posterPath: item.poster_path,
      backdropPath: item.backdrop_path,
      progress: 10,
    });
  };

  const continueItems = isHydrated ? continueWatchingToMedia(continueWatching) : [];
  const progressMap = isHydrated ? buildProgressMap(continueWatching) : undefined;

  if (loading) {
    return (
      <div>
        <HeroSkeleton />
        <div className="py-6 px-4 md:px-8">
          <div className="h-7 w-48 bg-surface-light rounded animate-shimmer mb-4" />
        </div>
        <CarouselSkeleton />
        <div className="py-6 px-4 md:px-8">
          <div className="h-7 w-48 bg-surface-light rounded animate-shimmer mb-4" />
        </div>
        <CarouselSkeleton />
      </div>
    );
  }

  return (
    <>
      {heroItem && <HeroBanner item={heroItem} onPlay={handleHeroPlay} />}

      {playerOpen && embedUrls[0] && (
        <div className="mx-auto max-w-7xl px-4 md:px-8 -mt-4 mb-2">
          <InlinePlayerSection
            embedUrl={embedUrls[0]}
            fallbackUrls={embedUrls.slice(1)}
            title={playerTitle}
            onClose={() => setPlayerOpen(false)}
          />
        </div>
      )}

      {continueItems.length > 0 && (
        <MediaCarousel
          title="Continue Watching"
          items={continueItems}
          progressMap={progressMap}
          id="continue-watching"
        />
      )}

      <MediaCarousel title="Trending Now" items={trending} />
      <SiteNativeAd />
      <MediaCarousel title="Top Rated Movies" items={topRated} />
      <SiteMidBannerAd />
      <MediaCarousel title="Latest TV Drops" items={latestTV} />
    </>
  );
}
