import { adsConfig } from "@/lib/ads-config";

const SESSION_KEY = "nexusstream_movie_popunder";

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

/** Load popunder script on first movie link click per session. */
export function triggerMoviePopunder(): void {
  if (!shouldTriggerPopunder()) return;

  sessionStorage.setItem(SESSION_KEY, "1");

  const script = document.createElement("script");
  script.src = adsConfig.moviePopunderScript;
  script.async = true;
  script.setAttribute("data-cfasync", "false");
  document.body.appendChild(script);
}

interface MovieLinkRouter {
  push: (href: string) => void;
}

/**
 * On movie links: prevent the ad script from swallowing navigation, load popunder,
 * then route to the intended page in this tab.
 */
export function handleMovieLinkClick(
  e: React.MouseEvent,
  href: string,
  router: MovieLinkRouter
): void {
  if (!isMovieHref(href)) return;

  if (!shouldTriggerPopunder()) return;

  e.preventDefault();
  triggerMoviePopunder();
  router.push(href);
}
