"use client";

/**
 * Global user-data context backed by LocalStorage.
 *
 * Three persisted collections:
 *  - watchlist: saved titles the user wants to watch later
 *  - history: recently viewed titles (deduplicated, capped at 50)
 *  - continueWatching: in-progress playback with progress % and TV episode info
 *
 * Hydration-safe: reads from localStorage only after mount to avoid SSR mismatch.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  ContinueWatchingItem,
  HistoryItem,
  MediaType,
  WatchlistItem,
} from "@/types/tmdb";

const STORAGE_KEYS = {
  watchlist: "nexusstream_watchlist",
  history: "nexusstream_history",
  continueWatching: "nexusstream_continue",
} as const;

interface UserDataContextValue {
  watchlist: WatchlistItem[];
  history: HistoryItem[];
  continueWatching: ContinueWatchingItem[];
  isHydrated: boolean;
  addToWatchlist: (item: Omit<WatchlistItem, "addedAt">) => void;
  removeFromWatchlist: (id: number, mediaType: MediaType) => void;
  isInWatchlist: (id: number, mediaType: MediaType) => boolean;
  addToHistory: (item: Omit<HistoryItem, "watchedAt">) => void;
  updateContinueWatching: (
    item: Omit<ContinueWatchingItem, "updatedAt">
  ) => void;
  removeContinueWatching: (id: number, mediaType: MediaType) => void;
  clearContinueWatching: () => void;
}

const UserDataContext = createContext<UserDataContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<
    ContinueWatchingItem[]
  >([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setWatchlist(readStorage(STORAGE_KEYS.watchlist, []));
    setHistory(readStorage(STORAGE_KEYS.history, []));
    setContinueWatching(readStorage(STORAGE_KEYS.continueWatching, []));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) writeStorage(STORAGE_KEYS.watchlist, watchlist);
  }, [watchlist, isHydrated]);

  useEffect(() => {
    if (isHydrated) writeStorage(STORAGE_KEYS.history, history);
  }, [history, isHydrated]);

  useEffect(() => {
    if (isHydrated)
      writeStorage(STORAGE_KEYS.continueWatching, continueWatching);
  }, [continueWatching, isHydrated]);

  const addToWatchlist = useCallback(
    (item: Omit<WatchlistItem, "addedAt">) => {
      setWatchlist((prev) => {
        if (
          prev.some((w) => w.id === item.id && w.mediaType === item.mediaType)
        ) {
          return prev;
        }
        return [{ ...item, addedAt: Date.now() }, ...prev];
      });
    },
    []
  );

  const removeFromWatchlist = useCallback(
    (id: number, mediaType: MediaType) => {
      setWatchlist((prev) =>
        prev.filter((w) => !(w.id === id && w.mediaType === mediaType))
      );
    },
    []
  );

  const isInWatchlist = useCallback(
    (id: number, mediaType: MediaType) =>
      watchlist.some((w) => w.id === id && w.mediaType === mediaType),
    [watchlist]
  );

  const addToHistory = useCallback(
    (item: Omit<HistoryItem, "watchedAt">) => {
      setHistory((prev) => {
        const filtered = prev.filter(
          (h) => !(h.id === item.id && h.mediaType === item.mediaType)
        );
        return [{ ...item, watchedAt: Date.now() }, ...filtered].slice(0, 50);
      });
    },
    []
  );

  const updateContinueWatching = useCallback(
    (item: Omit<ContinueWatchingItem, "updatedAt">) => {
      setContinueWatching((prev) => {
        const filtered = prev.filter(
          (c) => !(c.id === item.id && c.mediaType === item.mediaType)
        );
        return [{ ...item, updatedAt: Date.now() }, ...filtered].slice(0, 20);
      });
    },
    []
  );

  const removeContinueWatching = useCallback(
    (id: number, mediaType: MediaType) => {
      setContinueWatching((prev) =>
        prev.filter((c) => !(c.id === id && c.mediaType === mediaType))
      );
    },
    []
  );

  const clearContinueWatching = useCallback(() => {
    setContinueWatching([]);
  }, []);

  const value = useMemo(
    () => ({
      watchlist,
      history,
      continueWatching,
      isHydrated,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      addToHistory,
      updateContinueWatching,
      removeContinueWatching,
      clearContinueWatching,
    }),
    [
      watchlist,
      history,
      continueWatching,
      isHydrated,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      addToHistory,
      updateContinueWatching,
      removeContinueWatching,
      clearContinueWatching,
    ]
  );

  return (
    <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>
  );
}

export function useUserData(): UserDataContextValue {
  const ctx = useContext(UserDataContext);
  if (!ctx) {
    throw new Error("useUserData must be used within UserDataProvider");
  }
  return ctx;
}
