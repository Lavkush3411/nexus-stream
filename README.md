# NexusStream

A premium, responsive streaming platform for movies and TV series built with **Next.js (App Router)**, **Tailwind CSS**, and **TypeScript**. Metadata comes from the [TMDB API](https://www.themoviedb.org/); playback uses [VidSrc](https://vidsrc.to/) embeds — zero video hosting on our end.

## Features

- **Home Dashboard** — Hero banner, Trending, Top Rated, Latest TV, and Continue Watching carousels
- **Search** — Debounced real-time TMDB search
- **Browse & Filter** — Filter by genre, release year, and media type (Movie / TV)
- **Detail Pages** — Rich movie/TV layouts with cast, crew, and recommendations
- **TV Episodes** — Season tabs with episode list and quick-play
- **Cinema Player** — Sandboxed VidSrc iframe with popup/redirect protection
- **LocalStorage** — Watchlist, viewing history, and continue-watching progress

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure TMDB API key

Copy the example env file and add your key from [TMDB Settings](https://www.themoviedb.org/settings/api):

```bash
cp .env.local.example .env.local
```

```env
TMDB_API_KEY=your_tmdb_api_key_here
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/tmdb/[...path]/ # TMDB proxy (keeps API key server-side)
│   ├── browse/             # Filter & discover page
│   ├── movie/[id]/         # Movie detail page
│   ├── search/             # Search page
│   ├── tv/[id]/            # TV detail + episode selector
│   └── watchlist/          # Saved titles
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── player/             # VideoPlayer, CinemaMode
│   └── ui/                 # Cards, carousels, skeletons, etc.
├── context/                # LocalStorage-backed user data
├── lib/                    # API client, TMDB utils, VidSrc URLs
└── types/                  # Shared TypeScript interfaces
```

## Architecture Notes

- **API Proxy** — All TMDB requests flow through `/api/tmdb/*` so the API key never reaches the browser.
- **VidSrc Embeds** — Uses current official domains (`vidsrcme.su`, `vidsrc.me`, etc.). Movies: `/embed/movie?imdb={id}` or `/embed/movie/{id}`. TV: `/embed/tv/{id}/{season}/{episode}`.
- **No iframe sandbox** — VidSrc's `sbx.js` detects sandboxed iframes and shows "media unavailable." Player loads only after explicit user click.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Swiper (carousels)
- TypeScript

## Disclaimer

This project is for demonstration purposes. Video playback relies on third-party embed services. NexusStream does not host, store, or distribute any video content.
