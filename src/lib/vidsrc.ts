/**
 * VidSrc embed URL builder.
 *
 * OFFICIAL DOMAIN STATUS (June 2026):
 * - vidsrc.to / vidsrc.in — deprecated, frequently timeout or dead
 * - Current domains per vidsrcme.ru/api: vidsrc-embed.ru, vidsrc-embed.su,
 *   vidsrcme.su, vsrc.su (post-DMCA migration to .ru/.su TLDs)
 * - Latest-movies JSON feed on vidsrcme.su uses vidsrc.me with ?imdb= / ?tmdb=
 * - vidsrc-embed.ru redirects to vsembed.ru
 *
 * SANDBOX WARNING: VidSrc loads sbx.js which checks frameElement.sandbox and
 * redirects to /sbx.html showing "This media is unavailable at the moment."
 * The iframe MUST NOT use the sandbox attribute for VidSrc to work.
 */

export type EmbedMediaType = "movie" | "tv";

export interface EmbedOptions {
  tmdbId: number | string;
  imdbId?: string | null;
  season?: number;
  episode?: number;
}

/** Current official VidSrc embed bases (best-first). */
const OFFICIAL_BASES = [
  process.env.NEXT_PUBLIC_VIDSRC_BASE,
  "https://vsembed.ru",
  "https://vidsrc.me",
  "https://vidsrc-embed.ru",
  "https://vidsrc-embed.su",
  "https://vidsrcme.su",
  "https://vsrc.su",
].filter(Boolean) as string[];

function supportsQueryEmbed(base: string): boolean {
  return /vidsrc\.me|vidsrc-embed|vsembed|vsrc\.su/i.test(base);
}

function uniqueUrls(urls: string[]): string[] {
  return [...new Set(urls.filter(Boolean))];
}

/** Path format: /embed/movie/{id} or /embed/tv/{id}/{season}/{episode} */
function pathEmbed(
  base: string,
  type: EmbedMediaType,
  id: string,
  season?: number,
  episode?: number
): string {
  if (type === "tv" && season !== undefined && episode !== undefined) {
    // vidsrc-embed.ru also accepts dash format /tv/{id}/{season}-{episode}
    return `${base}/embed/tv/${id}/${season}/${episode}`;
  }
  return `${base}/embed/movie/${id}`;
}

/** Query format used by vidsrc.me and vidsrc-embed.ru */
function queryEmbed(
  base: string,
  type: EmbedMediaType,
  tmdbId: number | string,
  imdbId?: string | null,
  season?: number,
  episode?: number
): string {
  if (type === "tv" && season !== undefined && episode !== undefined) {
    const params = new URLSearchParams({
      season: String(season),
      episode: String(episode),
    });
    if (imdbId) params.set("imdb", imdbId);
    else params.set("tmdb", String(tmdbId));
    return `${base}/embed/tv?${params.toString()}`;
  }

  if (imdbId) {
    return `${base}/embed/movie?imdb=${imdbId}`;
  }
  return `${base}/embed/movie?tmdb=${tmdbId}`;
}

/** All candidate embed URLs, best-first. */
export function getEmbedFallbackUrls(options: EmbedOptions): string[] {
  const { tmdbId, imdbId, season, episode } = options;
  const type: EmbedMediaType =
    season !== undefined && episode !== undefined ? "tv" : "movie";
  const urls: string[] = [];
  const ids = imdbId ? [imdbId, String(tmdbId)] : [String(tmdbId)];

  for (const base of OFFICIAL_BASES) {
    // Query format (?imdb= / ?tmdb=) — preferred on most current mirrors
    if (supportsQueryEmbed(base)) {
      urls.push(queryEmbed(base, type, tmdbId, imdbId, season, episode));
    }
    // Path format (/embed/movie/{id}) — fallback
    for (const id of ids) {
      urls.push(pathEmbed(base, type, id, season, episode));
    }
  }

  return uniqueUrls(urls);
}

export function getPrimaryEmbedUrl(options: EmbedOptions): string {
  return getEmbedFallbackUrls(options)[0];
}

export function getMovieEmbedUrl(
  tmdbId: number | string,
  imdbId?: string | null
): string {
  return getPrimaryEmbedUrl({ tmdbId, imdbId });
}

export function getTvEmbedUrl(
  tmdbId: number | string,
  season: number,
  episode: number,
  imdbId?: string | null
): string {
  return getPrimaryEmbedUrl({ tmdbId, imdbId, season, episode });
}
