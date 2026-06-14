import { adsConfig } from "@/lib/ads-config";

const SESSION_KEY = "nexusstream_movie_popunder_v2";

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

function injectPopunderScript(): void {
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
 * First movie click per session: load popunder, then navigate.
 * Delay navigation briefly so the ad script can attach to the click.
 */
export function handleMovieLinkClick(
  e: React.MouseEvent,
  href: string,
  router: MovieLinkRouter
): void {
  if (!isMovieHref(href)) return;
  if (!shouldTriggerPopunder()) return;

  e.preventDefault();
  sessionStorage.setItem(SESSION_KEY, "1");
  injectPopunderScript();

  // Let popunder script run before route change unloads the page
  window.setTimeout(() => {
    router.push(href);
  }, 120);
}
