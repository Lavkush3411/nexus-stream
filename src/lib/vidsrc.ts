/**
 * VidSrc embed URL builder.
 * We never host video — these URLs point to third-party embed players.
 *
 * Format (per VidSrc spec):
 *   Movies:  https://vidsrc.to/embed/movie/{tmdb_id}
 *   TV:      https://vidsrc.to/embed/tv/{tmdb_id}/{season}/{episode}
 */

export function getMovieEmbedUrl(tmdbId: number | string): string {
  return `https://vidsrc.to/embed/movie/${tmdbId}`;
}

export function getTvEmbedUrl(
  tmdbId: number | string,
  season: number,
  episode: number
): string {
  return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
}
