"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { CastCrewList, SimilarGrid } from "@/components/ui/CastCrewList";
import { DetailPageSkeleton } from "@/components/ui/Skeleton";
import { CinemaMode } from "@/components/player/CinemaMode";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import {
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
} from "@/lib/api-client";
import { getImageUrl } from "@/lib/tmdb";
import { getMovieEmbedUrl } from "@/lib/vidsrc";
import { formatDate, formatRating, formatRuntime } from "@/lib/utils";
import { useUserData } from "@/context/UserDataContext";
import type { TMDBMovieDetails, TMDBCredits, TMDBMediaItem } from "@/types/tmdb";

export default function MovieDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const {
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    addToHistory,
    updateContinueWatching,
  } = useUserData();

  const [movie, setMovie] = useState<TMDBMovieDetails | null>(null);
  const [credits, setCredits] = useState<TMDBCredits | null>(null);
  const [similar, setSimilar] = useState<TMDBMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cinemaOpen, setCinemaOpen] = useState(false);
  const [inlinePlayer, setInlinePlayer] = useState(false);

  useEffect(() => {
    if (!id || isNaN(id)) return;

    Promise.all([
      getMovieDetails(id),
      getMovieCredits(id),
      getSimilarMovies(id),
    ])
      .then(([details, creds, sim]) => {
        setMovie(details);
        setCredits(creds);
        setSimilar(sim.results);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <DetailPageSkeleton />;
  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted">Movie not found.</p>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(movie.id, "movie");
  const embedUrl = getMovieEmbedUrl(movie.id);

  const handlePlay = () => {
    setInlinePlayer(true);
    setCinemaOpen(true);
    addToHistory({
      id: movie.id,
      mediaType: "movie",
      title: movie.title,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
    });
    updateContinueWatching({
      id: movie.id,
      mediaType: "movie",
      title: movie.title,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      progress: 15,
    });
  };

  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id, "movie");
    } else {
      addToWatchlist({
        id: movie.id,
        mediaType: "movie",
        title: movie.title,
        posterPath: movie.poster_path,
      });
    }
  };

  return (
    <>
      {/* Backdrop hero */}
      <div className="relative h-[50vh] min-h-[360px] w-full">
        <Image
          src={getImageUrl(movie.backdrop_path, "w1280")}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
      </div>

      {/* Detail content */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 -mt-48 relative z-10 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="hidden md:block flex-shrink-0 w-64">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image
                src={getImageUrl(movie.poster_path, "w500")}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="256px"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-32">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-muted italic mt-2">{movie.tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
              <span className="text-neon-blue font-semibold">
                ★ {formatRating(movie.vote_average)}
              </span>
              <span className="text-muted">
                {formatDate(movie.release_date)}
              </span>
              {movie.runtime && (
                <span className="text-muted">{formatRuntime(movie.runtime)}</span>
              )}
              <div className="flex gap-2">
                {movie.genres.map((g) => (
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
              {movie.overview}
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Button size="lg" onClick={handlePlay} className="gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Now
              </Button>
              <Button
                variant={inWatchlist ? "outline" : "secondary"}
                size="lg"
                onClick={toggleWatchlist}
              >
                {inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
              </Button>
            </div>

            {/* Inline player section */}
            {inlinePlayer && !cinemaOpen && (
              <div className="mt-8">
                <VideoPlayer embedUrl={embedUrl} title={movie.title} />
              </div>
            )}
          </div>
        </div>

        {credits && <CastCrewList cast={credits.cast} crew={credits.crew} />}
        <SimilarGrid title="Recommended" items={similar} mediaType="movie" />
      </div>

      {cinemaOpen && (
        <CinemaMode
          embedUrl={embedUrl}
          title={movie.title}
          onClose={() => setCinemaOpen(false)}
        />
      )}
    </>
  );
}
