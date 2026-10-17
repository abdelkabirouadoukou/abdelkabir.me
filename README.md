# Abdelkabir Ouadoukou — "The Hailstone"

Built on **@thexjs** (Bun + React islands) with **Lenis**, **GSAP + ScrollTrigger**, and React Bits–style effects written from scratch.

**Concept:** the whole site is the Collatz orbit of n = 27. Each section is a step (27 → 82 → 41 → 124 → 62 → 31 → 94 … → 1).
A live spine on the right shows the current number as you scroll, peaks at 9,232, and lands on 1 in the footer.

## Run
```bash
bun install        # IMPORTANT: installs tailwindcss + @tailwindcss/cli, see below
bun run dev        # http://localhost:3000
bun run build && bun run start
```

## How styling works in x (this is what was broken in v1)
`x dev` / `x build` compile `src/styles/globals.css` → `public/styles.css` by running `bunx tailwindcss`,
and x only adds the `<link>` to `/styles.css` if that file exists. v1 had no Tailwind packages in
`package.json`, so the compile failed and the page shipped with no CSS.
Fixed by:
1. `tailwindcss` + `@tailwindcss/cli` (^4.3.3, same as the scaffolder) are now in `dependencies`.
2. `public/styles.css` is committed as a fallback copy, so the site is styled even if the compile step fails.
   (A successful compile overwrites it. Edit `src/styles/globals.css`, never the public copy.)
`globals.css` is plain CSS on purpose; it does not import Tailwind's preflight.

## Other x specifics handled
- `<title>`: x's HTML shell has a fixed `<title>x app</title>` and no page-level head API, so the title and
  meta description are set at runtime in `Choreo.tsx`. (Idea for x: a page-level `title`/`head` export.)
- Fonts: x's default CSP blocks Google Fonts, so `x.config.ts` replaces the CSP. Remove the
  googleapis/gstatic entries if you self-host fonts later.
- `<Island>` renders a plain block `<div data-island>` and hydration passes NO props, so every island
  works with defaults. All islands on a route share one hydrate bundle.
- Not using `mode = "static"`: static output goes through `renderToStaticMarkup`, which strips markers hydration relies on.
- `data-no-nav` is set on in-page and external links so x's client navigation leaves them alone.
- `.mcp.json`, `.cursor/mcp.json`, `AGENTS.md`, `CLAUDE.md` come from the real scaffolder, so Claude Code/Cursor use `@thexjs/mcp`.

## Structure
```
x.config.ts            CSP for Google Fonts
design-system/abdelkabir/MASTER.md   design system (UI UX Pro Max workflow)
public/styles.css      fallback copy of globals.css
src/styles/globals.css all styling
src/layouts/main.tsx   fonts + skip link
src/pages/index.tsx    all sections
src/lib/collatz.ts     orbit + section↔step mapping
src/components/
  Choreo.tsx        Lenis, GSAP, spine, cursor, reveals, pinned rail, marquee, clock, title
  HeroName.tsx      variable-font proximity name (auto-fits)
  DotField.tsx      pointer-reactive dot grid
  ProjectIndex.tsx  project list + generative hover previews
  CollatzLab.tsx    interactive orbit plotter
```

## Verified vs not
Verified (SSR + hydrate in Chromium, real `<Island>` wrapper markup, desktop 1440 and mobile 390): no JS or hydration errors,
no horizontal overflow, hero fits the viewport, spine matches each section and ends at n = 1.
NOT verified: an actual `x dev`/`x build` run, the Tailwind compile, and real Google Fonts (sandbox has no network).
Stats (82 repos, 148 followers) are hand-written; update them.
