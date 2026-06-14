import { adsConfig } from "@/lib/ads-config";

const SESSION_KEY = "nexusstream_movie_popunder_v3";

export function isMoviePopunderActive(): boolean {
  return adsConfig.enabled && !!adsConfig.moviePopunderScript;
}

export function isMovieHref(href: string): boolean {
  return href.startsWith("/movie/");
}

function shouldTriggerPopunder(): boolean {
  if (!isMoviePopunderActive()) return false;
  if (typeof window === "undefined") return false;
  return !sessionStorage.getItem(SESSION_KEY);
}

/** Preload popunder script on app mount (idempotent). */
export function preloadMoviePopunder(): void {
  if (!isMoviePopunderActive() || typeof window === "undefined") return;

  const src = adsConfig.moviePopunderScript;
  if (document.querySelector(`script[data-popunder="${src}"]`)) return;

  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  script.setAttribute("data-cfasync", "false");
  script.setAttribute("data-popunder", src);
  document.head.appendChild(script);
}

interface MovieLinkRouter {
  push: (href: string) => void;
}

/**
 * First movie click per session: ensure popunder is loaded, then navigate.
 */
export function handleMovieLinkClick(
  e: React.MouseEvent,
  href: string,
  router: MovieLinkRouter
): void {
  if (!isMovieHref(href) || !isMoviePopunderActive()) return;
  if (!shouldTriggerPopunder()) return;

  e.preventDefault();
  e.stopPropagation();
  sessionStorage.setItem(SESSION_KEY, "1");

  preloadMoviePopunder();

  window.setTimeout(() => {
    router.push(href);
  }, 250);
}
