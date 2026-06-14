/**
 * TMDB API proxy — catch-all route.
 *
 * Architecture choice: a single dynamic route instead of dozens of
 * endpoint-specific handlers. Client code calls `/api/tmdb/movie/550`
 * and we forward to `https://api.themoviedb.org/3/movie/550` with the
 * server-side API key injected. This keeps secrets off the client and
 * gives us a single place to add caching, rate-limiting, or logging.
 */

import { NextRequest, NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const endpoint = `/${path.join("/")}`;
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);

  try {
    const data = await tmdbFetch(endpoint, { params: searchParams });
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("not configured") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
