import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-2">
              Nexus<span className="text-crimson">Stream</span>
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Your premium destination for movies and TV series. Powered by TMDB
              metadata — we never host video content.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground">Explore</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/" className="hover:text-crimson transition-colors">Home</Link></li>
              <li><Link href="/browse" className="hover:text-crimson transition-colors">Browse & Filter</Link></li>
              <li><Link href="/search" className="hover:text-crimson transition-colors">Search</Link></li>
              <li><Link href="/watchlist" className="hover:text-crimson transition-colors">Watchlist</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground">Attribution</h4>
            <p className="text-sm text-muted leading-relaxed">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm text-neon-blue hover:underline"
            >
              themoviedb.org →
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-muted">
          © {new Date().getFullYear()} NexusStream. For demonstration purposes only.
        </div>
      </div>
    </footer>
  );
}
