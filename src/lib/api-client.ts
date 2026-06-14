/**
 * Client-side API layer.
 * All browser requests go through our Next.js proxy — the TMDB key never
 * leaves the server.
 */

import type {
  TMDBPaginatedResponse,
  TMDBMediaItem,
  TMDBMovieDetails,
  TMDBTVDetails,
  TMDBCredits,
  TMDBGenreList,
  TMDBSeason,
  TMDBEpisode,
  MediaType,
} from "@/types/tmdb";

async function clientFetch<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.set(key, String(value));
      }
    });
  }

  const qs = searchParams.toString();
  const url = `/api/tmdb${path}${qs ? `?${qs}` : ""}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/** Trending movies & TV this week */
export function getTrending(
  mediaType: "all" | "movie" | "tv" = "all",
  timeWindow: "day" | "week" = "week"
) {
  return clientFetch<TMDBPaginatedResponse<TMDBMediaItem>>(
    `/trending/${mediaType}/${timeWindow}`
  );
}

export function getTopRated(mediaType: "movie" | "tv" = "movie") {
  return clientFetch<TMDBPaginatedResponse<TMDBMediaItem>>(
    `/${mediaType}/top_rated`
  );
}

export function getLatestTV() {
  return clientFetch<TMDBPaginatedResponse<TMDBMediaItem>>("/tv/on_the_air");
}

export function searchMulti(query: string, page = 1) {
  return clientFetch<TMDBPaginatedResponse<TMDBMediaItem>>("/search/multi", {
    query,
    page,
    include_adult: false,
  });
}

export function discover(
  mediaType: MediaType,
  filters: {
    page?: number;
    sort_by?: string;
    with_genres?: string;
    primary_release_year?: number;
    first_air_date_year?: number;
  }
) {
  return clientFetch<TMDBPaginatedResponse<TMDBMediaItem>>(
    `/discover/${mediaType}`,
    filters
  );
}

export function getMovieDetails(id: number) {
  return clientFetch<TMDBMovieDetails>(`/movie/${id}`);
}

export function getTVDetails(id: number) {
  return clientFetch<TMDBTVDetails>(`/tv/${id}`);
}

export function getMovieCredits(id: number) {
  return clientFetch<TMDBCredits>(`/movie/${id}/credits`);
}

export function getTVCredits(id: number) {
  return clientFetch<TMDBCredits>(`/tv/${id}/credits`);
}

export function getSimilarMovies(id: number) {
  return clientFetch<TMDBPaginatedResponse<TMDBMediaItem>>(
    `/movie/${id}/similar`
  );
}

export function getSimilarTV(id: number) {
  return clientFetch<TMDBPaginatedResponse<TMDBMediaItem>>(
    `/tv/${id}/similar`
  );
}

export function getGenres(mediaType: MediaType) {
  return clientFetch<TMDBGenreList>(`/genre/${mediaType}/list`);
}

export function getTVSeason(tvId: number, seasonNumber: number) {
  return clientFetch<TMDBSeason & { episodes: TMDBEpisode[] }>(
    `/tv/${tvId}/season/${seasonNumber}`
  );
}

export function getMovieExternalIds(id: number) {
  return clientFetch<{ imdb_id: string | null }>(`/movie/${id}/external_ids`);
}

export function getTVExternalIds(id: number) {
  return clientFetch<{ imdb_id: string | null }>(`/tv/${id}/external_ids`);
}
