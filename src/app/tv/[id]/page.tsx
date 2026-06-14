"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { CastCrewList, SimilarGrid } from "@/components/ui/CastCrewList";
import { SeasonEpisodeSelector } from "@/components/ui/SeasonEpisodeSelector";
import { DetailPageSkeleton } from "@/components/ui/Skeleton";
import { CinemaMode } from "@/components/player/CinemaMode";
import {
  getTVDetails,
  getTVCredits,
  getSimilarTV,
  getTVSeason,
  getTVExternalIds,
} from "@/lib/api-client";
import { getImageUrl } from "@/lib/tmdb";
import { getEmbedFallbackUrls } from "@/lib/vidsrc";
import { formatDate, formatRating } from "@/lib/utils";
import { useUserData } from "@/context/UserDataContext";
import type {
  TMDBTVDetails,
  TMDBCredits,
  TMDBMediaItem,
  TMDBEpisode,
} from "@/types/tmdb";

export default function TVDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const {
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    addToHistory,
    updateContinueWatching,
  } = useUserData();

  const [show, setShow] = useState<TMDBTVDetails | null>(null);
  const [credits, setCredits] = useState<TMDBCredits | null>(null);
  const [similar, setSimilar] = useState<TMDBMediaItem[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState<TMDBEpisode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cinemaOpen, setCinemaOpen] = useState(false);
  const [embedUrls, setEmbedUrls] = useState<string[]>([]);
  const [imdbId, setImdbId] = useState<string | null>(null);
  const [playerTitle, setPlayerTitle] = useState("");
  const [playerSubtitle, setPlayerSubtitle] = useState("");

  useEffect(() => {
    if (!id || isNaN(id)) return;

    Promise.all([getTVDetails(id), getTVCredits(id), getSimilarTV(id), getTVExternalIds(id)])
      .then(([details, creds, sim, externalIds]) => {
        setShow(details);
        setCredits(creds);
        setSimilar(sim.results);
        setImdbId(externalIds.imdb_id);
        const firstSeason = details.seasons.find((s) => s.season_number > 0);
        if (firstSeason) setSelectedSeason(firstSeason.season_number);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || isNaN(id)) return;

    setLoadingEpisodes(true);
    getTVSeason(id, selectedSeason)
      .then((data) => setEpisodes(data.episodes ?? []))
      .catch(console.error)
      .finally(() => setLoadingEpisodes(false));
  }, [id, selectedSeason]);

  if (loading) return <DetailPageSkeleton />;
  if (!show) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted">TV show not found.</p>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(show.id, "tv");

  const handleEpisodePlay = (
    season: number,
    episode: number,
    episodeName: string
  ) => {
    const urls = getEmbedFallbackUrls({
      tmdbId: show.id,
      imdbId,
      season,
      episode,
    });
    setEmbedUrls(urls);
    setPlayerTitle(show.name);
    setPlayerSubtitle(`S${season} E${episode} — ${episodeName}`);
    setCinemaOpen(true);

    addToHistory({
      id: show.id,
      mediaType: "tv",
      title: show.name,
      posterPath: show.poster_path,
      backdropPath: show.backdrop_path,
    });
    updateContinueWatching({
      id: show.id,
      mediaType: "tv",
      title: show.name,
      posterPath: show.poster_path,
      backdropPath: show.backdrop_path,
      progress: 20,
      season,
      episode,
    });
  };

  const handlePlayLatest = () => {
    const firstEp = episodes[0];
    if (firstEp) {
      handleEpisodePlay(
        firstEp.season_number,
        firstEp.episode_number,
        firstEp.name
      );
    }
  };

  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(show.id, "tv");
    } else {
      addToWatchlist({
        id: show.id,
        mediaType: "tv",
        title: show.name,
        posterPath: show.poster_path,
      });
    }
  };

  return (
    <>
      <div className="relative h-[50vh] min-h-[360px] w-full">
        <Image
          src={getImageUrl(show.backdrop_path, "w1280")}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8 -mt-48 relative z-10 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block flex-shrink-0 w-64">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image
                src={getImageUrl(show.poster_path, "w500")}
                alt={show.name}
                fill
                className="object-cover"
                sizes="256px"
              />
            </div>
          </div>

          <div className="flex-1 pt-4 md:pt-32">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              {show.name}
            </h1>
            {show.tagline && (
              <p className="text-muted italic mt-2">{show.tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
              <span className="text-neon-blue font-semibold">
                ★ {formatRating(show.vote_average)}
              </span>
              <span className="text-muted">
                {formatDate(show.first_air_date)}
              </span>
              <span className="text-muted">
                {show.number_of_seasons} Season
                {show.number_of_seasons !== 1 ? "s" : ""}
              </span>
              <span className="text-muted">
                {show.number_of_episodes} Episodes
              </span>
              <div className="flex gap-2 flex-wrap">
                {show.genres.map((g) => (
                  <span
                    key={g.id}
                    className="rounded-full bg-surface-light px-3 py-0.5 text-xs text-muted"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-6 text-base leading-relaxed text-foreground/80 max-w-3xl">
              {show.overview}
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Button
                size="lg"
                onClick={handlePlayLatest}
                disabled={episodes.length === 0}
                className="gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play S{selectedSeason} E1
              </Button>
              <Button
                variant={inWatchlist ? "outline" : "secondary"}
                size="lg"
                onClick={toggleWatchlist}
              >
                {inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
              </Button>
            </div>
          </div>
        </div>

        <SeasonEpisodeSelector
          seasons={show.seasons}
          episodes={episodes}
          selectedSeason={selectedSeason}
          onSeasonChange={setSelectedSeason}
          onEpisodePlay={handleEpisodePlay}
          loadingEpisodes={loadingEpisodes}
        />

        {credits && <CastCrewList cast={credits.cast} crew={credits.crew} />}
        <SimilarGrid title="Similar Shows" items={similar} mediaType="tv" />
      </div>

      {cinemaOpen && embedUrls[0] && (
        <CinemaMode
          embedUrl={embedUrls[0]}
          fallbackUrls={embedUrls.slice(1)}
          title={playerTitle}
          subtitle={playerSubtitle}
          onClose={() => setCinemaOpen(false)}
        />
      )}
    </>
  );
}
