# Game Backlog

A personal game backlog tracker, built as a learning project for TypeScript, Tailwind CSS, and Next.js.

Track what you're playing, what's done, and what's still waiting in the backlog — with autocomplete cover art, achievements based on your own library, a way to compare libraries with friends via share codes, and no account or server required.

## Features

- **Library** — add, edit, and delete games with a status of Backlog, Playing, Completed, or Dropped. Search, filter, and sort.
- **Cover art autocomplete** — start typing a title and pick a match from [RAWG](https://rawg.io/apidocs); the cover image fills in automatically.
- **Achievements** — milestones unlocked based on your own library and profile (e.g. completing your first game, reaching 50 games).
- **Profile** — a username and profile picture, plus a breakdown of your library by status.
- **Friends** — share a one-time code containing a snapshot of your library, achievements, and profile so a friend can view them on their own Friends page. Not a live sync — re-share a code any time to update.
- **Support page** — a QR code for ETH donations and a link to this repo.
- **Light/dark theme**, with the choice remembered across visits.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) components, built on [Base UI](https://base-ui.com/) (not Radix)
- [RAWG API](https://rawg.io/apidocs) for game search and cover art
- Data is stored entirely in the browser's `localStorage` — there's no backend or database.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- A free [RAWG API key](https://rawg.io/apidocs) for the cover art search feature

### Setup

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/Brage1025/game-backlog.git
   cd game-backlog
   npm install
   ```

2. Create a `.env.local` file in the project root:

   ```
   RAWG_API_KEY=your_rawg_api_key_here
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

   On Windows, if you hit a Turbopack/native-bindings error (commonly caused by Smart App Control blocking an unsigned file), use the Webpack fallback instead:

   ```bash
   npm run dev -- --webpack
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Notes

- All data (games, profile, friends, theme) lives in your browser's `localStorage`. Clearing site data or switching browsers/devices starts you over.
- Friend sharing is a manual, one-way snapshot — not a live connection. See the in-app Friends page for details.
- Profile pictures are resized and compressed client-side before being stored, to stay well within `localStorage`'s size limits.

## License

Licensed under the [GNU General Public License v3.0](./LICENSE).
