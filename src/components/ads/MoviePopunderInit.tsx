"use client";

import { useEffect } from "react";
import { isMoviePopunderActive, preloadMoviePopunder } from "@/lib/movie-popunder";

/** Preloads popunder script once so the first movie click can trigger it. */
export function MoviePopunderInit() {
  useEffect(() => {
    if (isMoviePopunderActive()) preloadMoviePopunder();
  }, []);

  return null;
}
