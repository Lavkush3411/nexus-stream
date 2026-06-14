"use client";

import { useCallback, useEffect, useState } from "react";
import { MediaCard } from "@/components/ui/MediaCard";
import { Button } from "@/components/ui/Button";
import { CarouselSkeleton } from "@/components/ui/Skeleton";
import { SiteBannerSlot } from "@/components/ads/SiteAds";
import { discover, getGenres } from "@/lib/api-client";
import type { MediaType, TMDBGenre, TMDBMediaItem } from "@/types/tmdb";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "release_date.desc", label: "Newest First" },
  { value: "release_date.asc", label: "Oldest First" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

export default function BrowsePage() {
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [genres, setGenres] = useState<TMDBGenre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [results, setResults] = useState<TMDBMediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGenres(mediaType)
      .then((data) => setGenres(data.genres))
      .catch(console.error);
    setSelectedGenre(null);
  }, [mediaType]);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const filters: Record<string, string | number> = {
        page,
        sort_by: sortBy,
      };
      if (selectedGenre) filters.with_genres = String(selectedGenre);
      if (selectedYear) {
        if (mediaType === "movie") {
          filters.primary_release_year = selectedYear;
        } else {
          filters.first_air_date_year = selectedYear;
        }
      }

      const data = await discover(mediaType, filters);
      setResults(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [mediaType, selectedGenre, selectedYear, sortBy, page]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const resetFilters = () => {
    setSelectedGenre(null);
    setSelectedYear(null);
    setSortBy("popularity.desc");
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Browse & Filter</h1>
      <p className="text-muted mb-8">
        Discover content by genre, release year, and media type.
      </p>

      {/* Filter panel */}
      <div className="rounded-2xl bg-surface border border-white/5 p-6 mb-8 space-y-6">
        {/* Media type toggle */}
        <div>
          <label className="text-sm font-medium text-muted mb-2 block">
            Media Type
          </label>
          <div className="flex gap-2">
            {(["movie", "tv"] as MediaType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setMediaType(type);
                  setPage(1);
                }}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  mediaType === type
                    ? "bg-crimson text-white"
                    : "bg-surface-light text-muted hover:text-foreground"
                }`}
              >
                {type === "movie" ? "Movies" : "TV Series"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Genre */}
          <div>
            <label htmlFor="genre" className="text-sm font-medium text-muted mb-2 block">
              Genre
            </label>
            <select
              id="genre"
              value={selectedGenre ?? ""}
              onChange={(e) => {
                setSelectedGenre(e.target.value ? Number(e.target.value) : null);
                setPage(1);
              }}
              className="w-full rounded-lg bg-surface-light border border-white/10 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-crimson/50"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label htmlFor="year" className="text-sm font-medium text-muted mb-2 block">
              Release Year
            </label>
            <select
              id="year"
              value={selectedYear ?? ""}
              onChange={(e) => {
                setSelectedYear(e.target.value ? Number(e.target.value) : null);
                setPage(1);
              }}
              className="w-full rounded-lg bg-surface-light border border-white/10 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-crimson/50"
            >
              <option value="">All Years</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="sort" className="text-sm font-medium text-muted mb-2 block">
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg bg-surface-light border border-white/10 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-crimson/50"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>

      <SiteBannerSlot slotId="browse-after-filters" className="mb-8" />

      {/* Results grid */}
      {loading ? (
        <CarouselSkeleton count={12} />
      ) : results.length === 0 ? (
        <p className="text-muted text-center py-12">
          No results match your filters. Try adjusting them.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((item) => (
              <MediaCard key={item.id} item={item} className="!w-full" />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted">
                Page {page} of {Math.min(totalPages, 500)}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
          <SiteBannerSlot slotId="browse-after-grid" className="mt-8" />
        </>
      )}
    </div>
  );
}
