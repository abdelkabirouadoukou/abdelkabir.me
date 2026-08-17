# abdelkabir.me

Personal portfolio of [Abdelkabir Ouadoukou](https://github.com/abdelkabirouadoukou), solo developer and student in Marrakesh, Morocco. Dark-only, terminal-inspired single-page site, built with [@thexjs](https://github.com/abdelkabirouadoukou/thexjs), the author's own meta-fullstack framework for Bun.

## Sections

- 01 About
- 02 Currently Building
- 03 Featured Projects (client work + repos fetched live from GitHub)
- 04 Skills & Tech Stack
- 05 Math & Research
- 06 Linux & Security

## Tech stack

- [@thexjs](https://github.com/abdelkabirouadoukou/thexjs) (core + CLI) with React 19 server rendering
- Tailwind CSS v4 (dark-only theme, monospace-first)
- TypeScript
- Deployed to Vercel via `@thexjs/adapter-vercel`

## Getting started

Requires [Bun](https://bun.sh).

```sh
bun install
bun run dev          # x dev, serves on http://localhost:3000
bun run build        # x build (static/server bundle)
bun run start        # run the production bundle locally
bun run vercel-build # x build --adapter vercel, emits .vercel/output
```

## How the live data works

The page runs in `server` mode (`src/pages/index.tsx`). A `loader()` fetches from the GitHub REST API at request time:

- hero stats (public repo + follower counts)
- pinned repos (parsed from the profile page, since the API has no unauthenticated pinned endpoint), with a static fallback
- each repo's language and top topics

Results are cached in memory for 20 minutes, so API usage stays low. If a fetch fails, the site falls back to static content from `src/data/portfolio.ts`.

## Structure

```
src/
  pages/index.tsx               single page, server mode + loader
  layouts/main.tsx              header nav, footer, meta bootstrap
  components/sections/          one component per page section
  components/scroll-spy.tsx     active-section highlighting (island)
  lib/github.ts                 GitHub fetch + cache + pinned parsing
  data/portfolio.ts             static content (nav, tech stack, client project, fallback)
  styles/globals.css            theme tokens + hero glow / cursor animations
```

## Deploy

```sh
vercel --prod
```

`vercel-build` runs `x build --adapter vercel`, which bundles the server render function into `.vercel/output`. See `vercel.json` and the [adapter docs](https://github.com/abdelkabirouadoukou/thexjs).

## License

[MIT](LICENSE)
