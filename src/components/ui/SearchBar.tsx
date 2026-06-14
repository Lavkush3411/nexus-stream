"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

/**
 * Single global search input — lives in the navbar only.
 * Syncs with /search?q=… so results update without a second search field.
 */
export function SearchBar({
  placeholder = "Search movies & TV shows…",
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = pathname === "/search" ? (searchParams.get("q") ?? "") : "";

  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  const debouncedNavigate = useCallback(
    debounce((value: string, path: string) => {
      const trimmed = value.trim();
      if (trimmed) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      } else if (path === "/search") {
        router.replace("/search");
      }
    }, 400),
    [router]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedNavigate(value, pathname);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else if (pathname === "/search") {
      router.replace("/search");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-xl bg-surface-light border border-white/10 pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-crimson/50 focus:border-crimson/50 transition-all"
        aria-label="Search movies and TV shows"
      />
    </form>
  );
}
