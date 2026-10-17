/**
 * Single source of truth for everything that describes the site to the outside
 * world: <head> metadata, JSON-LD, sitemap.xml, robots.txt, security.txt and the
 * contact section. Change a value here and every one of those follows.
 */
export const SITE = {
  /** Canonical origin, no trailing slash. Must match the host the site is actually served from. */
  url: "https://www.abdelkabir.me",
  name: "Abdelkabir Ouadoukou",
  title: "Abdelkabir Ouadoukou — Developer & creator of @thexjs",
  description:
    "Full-stack developer in Marrakesh. I built @thexjs, a Bun + React framework, ship client platforms, and write up Linux kernel CVEs.",
  jobTitle: "Full-stack developer",
  locale: "en_US",
  themeColor: "#eee6d3",

  email: "abdelkabir.ouadoukou@gmail.com",
  github: "https://github.com/abdelkabirouadoukou",
  xRepo: "https://github.com/abdelkabirouadoukou/x",

  city: "Marrakesh",
  country: "MA",
  timeZone: "Africa/Casablanca",

  /** 1200×630 share image, lives in /public. */
  ogImage: "/og.png",
  ogImageAlt: "Abdelkabir Ouadoukou, “Searching for logic in a world of syntax errors”, next to the Collatz orbit of 27.",
  knowsAbout: ["TypeScript", "React", "Bun", "Python", "Linux security", "Collatz conjecture"],
} as const;

export const absolute = (path: string) => `${SITE.url}${path}`;
