import type { TMDBMediaItem } from "@/types/tmdb";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getDisplayTitle(item: TMDBMediaItem | { title?: string; name?: string }): string {
  return item.title ?? item.name ?? "Untitled";
}

export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatDate(date: string | undefined): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

/** Debounce helper for search inputs */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function getMediaHref(item: TMDBMediaItem): string {
  const type = item.media_type ?? (item.title ? "movie" : "tv");
  return type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
}
