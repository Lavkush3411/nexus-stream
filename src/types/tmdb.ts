/** TMDB API response types — shared across server and client layers. */

export type MediaType = "movie" | "tv";

export interface TMDBMediaItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  media_type?: MediaType;
  popularity?: number;
}

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  runtime: number | null;
  genres: TMDBGenre[];
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
}

export interface TMDBTVDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  last_air_date?: string;
  number_of_seasons: number;
  number_of_episodes: number;
  genres: TMDBGenre[];
  tagline?: string;
  status?: string;
  episode_run_time?: number[];
  seasons: TMDBSeason[];
}

export interface TMDBSeason {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date?: string;
}

export interface TMDBEpisode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  air_date?: string;
  runtime?: number;
  vote_average: number;
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TMDBCredits {
  cast: TMDBCastMember[];
  crew: TMDBCrewMember[];
}

export interface TMDBGenreList {
  genres: TMDBGenre[];
}

/** LocalStorage-backed user data shapes */
export interface WatchlistItem {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  addedAt: number;
}

export interface HistoryItem {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  watchedAt: number;
}

export interface ContinueWatchingItem {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  /** 0–100 playback progress percentage */
  progress: number;
  /** TV-only: last watched season */
  season?: number;
  /** TV-only: last watched episode */
  episode?: number;
  updatedAt: number;
}
