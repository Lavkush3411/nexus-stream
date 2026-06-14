/**
 * Banner ad slot registry — maps each placement to a preset ad unit.
 */

import type { AdUnitName } from "./ad-units";
import { AD_UNITS, type AtOptionsUnit } from "./ad-units";

export type BannerSlotId =
  | "global-top"
  | "global-footer"
  | "home-after-hero"
  | "home-after-continue"
  | "home-after-top-rated"
  | "home-after-latest"
  | "browse-after-filters"
  | "browse-after-grid"
  | "search-top"
  | "search-after-results"
  | "movie-after-details"
  | "movie-before-similar"
  | "tv-after-details"
  | "tv-before-similar"
  | "watchlist-top"
  | "watchlist-after-grid";

export type BannerPage =
  | "all"
  | "home"
  | "browse"
  | "search"
  | "movie"
  | "tv"
  | "watchlist";

export interface BannerSlotMeta {
  id: BannerSlotId;
  page: BannerPage;
  label: string;
  unit: AdUnitName;
}

export const BANNER_SLOT_REGISTRY: BannerSlotMeta[] = [
  { id: "global-top", page: "all", label: "Below navbar", unit: "banner728" },
  { id: "global-footer", page: "all", label: "Above footer", unit: "banner468x60" },
  { id: "home-after-hero", page: "home", label: "After hero", unit: "rect300x250" },
  { id: "home-after-continue", page: "home", label: "After continue watching", unit: "banner468x60" },
  { id: "home-after-top-rated", page: "home", label: "After top rated", unit: "banner320x50" },
  { id: "home-after-latest", page: "home", label: "After latest TV", unit: "sky160x300" },
  { id: "browse-after-filters", page: "browse", label: "After filters", unit: "banner468x60" },
  { id: "browse-after-grid", page: "browse", label: "After results grid", unit: "rect300x250" },
  { id: "search-top", page: "search", label: "Below search header", unit: "banner320x50" },
  { id: "search-after-results", page: "search", label: "After results grid", unit: "banner468x60" },
  { id: "movie-after-details", page: "movie", label: "After movie details", unit: "rect300x250" },
  { id: "movie-before-similar", page: "movie", label: "Before recommended", unit: "sky160x600" },
  { id: "tv-after-details", page: "tv", label: "After show details", unit: "rect300x250" },
  { id: "tv-before-similar", page: "tv", label: "Before similar shows", unit: "sky160x600" },
  { id: "watchlist-top", page: "watchlist", label: "Below watchlist header", unit: "banner468x60" },
  { id: "watchlist-after-grid", page: "watchlist", label: "After watchlist grid", unit: "banner320x50" },
];

export function getBannerSlotUnit(slotId: BannerSlotId): AtOptionsUnit | null {
  const slot = BANNER_SLOT_REGISTRY.find((s) => s.id === slotId);
  if (!slot) return null;
  return AD_UNITS[slot.unit]();
}

export function isBannerSlotActive(slotId: BannerSlotId): boolean {
  return !!getBannerSlotUnit(slotId);
}

export function getBannerAdCounts(): {
  totalSlots: number;
  perPage: Record<BannerPage, number>;
  perPageIncludingGlobal: Record<string, number>;
} {
  const perPage: Record<BannerPage, number> = {
    all: 0,
    home: 0,
    browse: 0,
    search: 0,
    movie: 0,
    tv: 0,
    watchlist: 0,
  };

  for (const slot of BANNER_SLOT_REGISTRY) {
    perPage[slot.page] += 1;
  }

  const globalCount = perPage.all;

  return {
    totalSlots: BANNER_SLOT_REGISTRY.length,
    perPage,
    perPageIncludingGlobal: {
      home: globalCount + perPage.home,
      browse: globalCount + perPage.browse,
      search: globalCount + perPage.search,
      movie: globalCount + perPage.movie,
      tv: globalCount + perPage.tv,
      watchlist: globalCount + perPage.watchlist,
      everyPage: globalCount,
    },
  };
}

export const BANNER_AD_COUNTS = getBannerAdCounts();
