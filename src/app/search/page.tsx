"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MediaCard } from "@/components/ui/MediaCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { CarouselSkeleton } from "@/components/ui/Skeleton";
import { searchMulti } from "@/lib/api-client";
import type { TMDBMediaItem } from "@/types/tmdb";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [results, setResults] = useState<TMDBMediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    let cancelled = false;
    setLoading(true);

    searchMulti(query)
      .then((data) => {
        if (!cancelled) {
          const filtered = data.results.filter(
            (item) => item.media_type === "movie" || item.media_type === "tv"
          );
          setResults(filtered);
          setTotalResults(data.total_results);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Search</h1>

      <SearchBar initialQuery={query} autoFocus className="max-w-xl mb-8" />

      {!query.trim() ? (
        <p className="text-muted">
          Start typing to search movies and TV shows in real time.
        </p>
      ) : loading ? (
        <CarouselSkeleton count={8} />
      ) : results.length === 0 ? (
        <p className="text-muted">
          No results found for &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted mb-6">
            {totalResults.toLocaleString()} results for &ldquo;{query}&rdquo;
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((item) => (
              <MediaCard
                key={`${item.media_type}-${item.id}`}
                item={item}
                className="!w-full"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
          <div className="h-8 w-32 bg-surface-light rounded animate-shimmer mb-6" />
          <CarouselSkeleton count={6} />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
