"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { getImageUrl } from "@/lib/tmdb";
import { formatDate } from "@/lib/utils";
import type { TMDBEpisode } from "@/types/tmdb";

interface SeasonEpisodeSelectorProps {
  seasons: { season_number: number; name: string; episode_count: number }[];
  episodes: TMDBEpisode[];
  selectedSeason: number;
  onSeasonChange: (season: number) => void;
  onEpisodePlay: (season: number, episode: number, episodeName: string) => void;
  loadingEpisodes?: boolean;
}

export function SeasonEpisodeSelector({
  seasons,
  episodes,
  selectedSeason,
  onSeasonChange,
  onEpisodePlay,
  loadingEpisodes = false,
}: SeasonEpisodeSelectorProps) {
  const validSeasons = seasons.filter((s) => s.season_number > 0);

  return (
    <section className="py-8 px-4 md:px-8">
      <h2 className="text-xl md:text-2xl font-bold mb-6">Episodes</h2>

      {/* Season tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {validSeasons.map((season) => (
          <button
            key={season.season_number}
            onClick={() => onSeasonChange(season.season_number)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedSeason === season.season_number
                ? "bg-crimson text-white shadow-lg shadow-crimson/25"
                : "bg-surface-light text-muted hover:text-foreground hover:bg-surface-lighter"
            }`}
          >
            {season.name || `Season ${season.season_number}`}
          </button>
        ))}
      </div>

      {/* Episode list */}
      <div className="space-y-3 mt-2">
        {loadingEpisodes ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-surface-light animate-shimmer" />
          ))
        ) : episodes.length === 0 ? (
          <p className="text-muted text-sm">No episodes available for this season.</p>
        ) : (
          episodes.map((ep) => (
            <div
              key={ep.id}
              className="flex gap-4 p-3 rounded-xl bg-surface hover:bg-surface-light transition-colors group"
            >
              <div className="relative w-36 sm:w-44 aspect-video flex-shrink-0 rounded-lg overflow-hidden bg-surface-light">
                <Image
                  src={getImageUrl(ep.still_path, "w300")}
                  alt={ep.name}
                  fill
                  className="object-cover"
                  sizes="176px"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    onClick={() =>
                      onEpisodePlay(ep.season_number, ep.episode_number, ep.name)
                    }
                    className="rounded-full w-10 h-10 p-0"
                    aria-label={`Play episode ${ep.episode_number}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </Button>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted font-medium">
                      E{ep.episode_number}
                      {ep.air_date && ` · ${formatDate(ep.air_date)}`}
                      {ep.runtime && ` · ${ep.runtime}m`}
                    </p>
                    <h3 className="text-sm sm:text-base font-semibold text-foreground mt-0.5 line-clamp-1">
                      {ep.name}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100"
                    onClick={() =>
                      onEpisodePlay(ep.season_number, ep.episode_number, ep.name)
                    }
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </Button>
                </div>
                <p className="text-xs sm:text-sm text-muted mt-1 line-clamp-2">
                  {ep.overview || "No description available."}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
