/**
 * Server-side TMDB client.
 * Only imported in API routes / Server Components — never on the client.
 * Keeps the API key isolated from the browser bundle.
 */

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const imageSizes = {
  poster: { sm: "w185", md: "w342", lg: "w500", xl: "w780" },
  backdrop: { sm: "w780", md: "w1280", lg: "original" },
  profile: { sm: "w45", md: "w185", lg: "h632" },
  still: { sm: "w300", md: "w780", lg: "original" },
} as const;

export function getImageUrl(
  path: string | null | undefined,
  size: string = "w500"
): string {
  if (!path) return "/placeholder-poster.svg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getMediaTitle(item: {
  title?: string;
  name?: string;
}): string {
  return item.title ?? item.name ?? "Untitled";
}

interface FetchOptions {
  params?: Record<string, string | number | boolean | undefined>;
  /** Next.js fetch revalidation in seconds */
  revalidate?: number;
}

/**
 * Core fetch wrapper — all TMDB traffic flows through here on the server.
 */
export async function tmdbFetch<T>(
  endpoint: string,
  { params = {}, revalidate = 3600 }: FetchOptions = {}
): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not configured");
  }

  const searchParams = new URLSearchParams({ api_key: apiKey });
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const url = `${TMDB_BASE}${endpoint}?${searchParams.toString()}`;
  const res = await fetch(url, { next: { revalidate } });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`TMDB ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}
