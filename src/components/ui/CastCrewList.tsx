"use client";

import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/tmdb";
import type { TMDBCastMember, TMDBCrewMember } from "@/types/tmdb";

interface CastCrewListProps {
  cast: TMDBCastMember[];
  crew?: TMDBCrewMember[];
}

export function CastCrewList({ cast, crew }: CastCrewListProps) {
  const directors = crew?.filter((c) => c.job === "Director").slice(0, 5) ?? [];

  return (
    <section className="py-8">
      <h2 className="text-xl md:text-2xl font-bold mb-6 px-4 md:px-8">Cast & Crew</h2>

      {directors.length > 0 && (
        <div className="px-4 md:px-8 mb-6">
          <p className="text-sm text-muted mb-2">Directed by</p>
          <p className="text-foreground font-medium">
            {directors.map((d) => d.name).join(", ")}
          </p>
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto px-4 md:px-8 pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide">
        {cast.slice(0, 20).map((member) => (
          <div
            key={member.id}
            className="flex-shrink-0 w-28 snap-start text-center group"
          >
            <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden bg-surface-light ring-2 ring-white/5 group-hover:ring-crimson/50 transition-all">
              <Image
                src={getImageUrl(member.profile_path, "w185")}
                alt={member.name}
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
            <p className="mt-2 text-sm font-medium text-foreground line-clamp-1">
              {member.name}
            </p>
            <p className="text-xs text-muted line-clamp-1">{member.character}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

interface SimilarGridProps {
  title: string;
  items: { id: number; title?: string; name?: string; poster_path: string | null; vote_average: number }[];
  mediaType: "movie" | "tv";
}

export function SimilarGrid({ title, items, mediaType }: SimilarGridProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-8 px-4 md:px-8">
      <h2 className="text-xl md:text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.slice(0, 12).map((item) => {
          const name = item.title ?? item.name ?? "Untitled";
          const href = mediaType === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
          return (
            <Link key={item.id} href={href} className="group">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-surface-light">
                <Image
                  src={getImageUrl(item.poster_path, "w342")}
                  alt={name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, 200px"
                />
                <div className="absolute top-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-xs text-neon-blue">
                  ★ {item.vote_average.toFixed(1)}
                </div>
              </div>
              <p className="mt-2 text-sm font-medium line-clamp-1 group-hover:text-crimson transition-colors">
                {name}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
