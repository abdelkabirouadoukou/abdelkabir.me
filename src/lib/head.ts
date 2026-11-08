import { escapeHtml } from "@thexjs/core";
import { SITE, absolute, pageFor } from "./site";

/**
 * x's HTML shell has a fixed <title>x app</title> and no per-page head API, so
 * crawlers (which don't run our JS) would only ever see "x app". The route
 * middleware in pages/_middleware.ts uses this to rewrite <head> on the server.
 */

const e = (s: string) => escapeHtml(s);
const meta = (attr: "name" | "property", key: string, content: string) =>
  `<meta ${attr}="${key}" content="${e(content)}" />`;

/** JSON.stringify that is safe inside a <script> element. */
const jsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");

export function structuredData(pathname = "/") {
  const personId = `${SITE.url}/#person`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: SITE.name,
        url: `${SITE.url}/`,
        image: absolute(SITE.ogImage),
        jobTitle: SITE.jobTitle,
        description: SITE.description,
        email: `mailto:${SITE.email}`,
        address: { "@type": "PostalAddress", addressLocality: SITE.city, addressCountry: SITE.country },
        sameAs: [SITE.github, SITE.xRepo],
        knowsAbout: SITE.knowsAbout,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: `${SITE.url}/`,
        name: SITE.name,
        description: SITE.description,
        inLanguage: "en",
        author: { "@id": personId },
        publisher: { "@id": personId },
      },
      ...(pageFor(pathname)
        ? [
            {
              "@type": "TechArticle",
              "@id": `${absolute(pathname)}#article`,
              url: absolute(pathname),
              headline: pageFor(pathname)!.title,
              description: pageFor(pathname)!.description,
              inLanguage: "en",
              author: { "@id": personId },
              publisher: { "@id": personId },
              isPartOf: { "@id": `${SITE.url}/#website` },
            },
          ]
        : []),
    ],
  };
}

/** Everything that goes into <head> except <title>, as one HTML string. */
export function headTags(pathname: string): string {
  const canonical = absolute(pathname === "/" ? "/" : pathname.replace(/\/+$/, ""));
  const image = absolute(SITE.ogImage);
  const page = pageFor(pathname);
  const title = page?.title ?? SITE.title;
  const description = page?.description ?? SITE.description;

  return [
    meta("name", "description", description),
    meta("name", "author", SITE.name),
    meta("name", "robots", "index, follow, max-image-preview:large"),
    meta("name", "theme-color", page?.themeColor ?? SITE.themeColor),
    `<link rel="canonical" href="${e(canonical)}" />`,
    `<link rel="me" href="${e(SITE.github)}" />`,

    // icons
    `<link rel="icon" href="/favicon.ico" sizes="48x48" />`,
    `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />`,
    `<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`,
    `<link rel="manifest" href="/site.webmanifest" />`,

    // Open Graph
    meta("property", "og:type", page ? "article" : "website"),
    meta("property", "og:site_name", SITE.name),
    meta("property", "og:locale", SITE.locale),
    meta("property", "og:title", title),
    meta("property", "og:description", description),
    meta("property", "og:url", canonical),
    meta("property", "og:image", image),
    meta("property", "og:image:type", "image/png"),
    meta("property", "og:image:width", "1200"),
    meta("property", "og:image:height", "630"),
    meta("property", "og:image:alt", SITE.ogImageAlt),

    // Twitter / X
    meta("name", "twitter:card", "summary_large_image"),
    meta("name", "twitter:title", title),
    meta("name", "twitter:description", description),
    meta("name", "twitter:image", image),
    meta("name", "twitter:image:alt", SITE.ogImageAlt),

    `<script type="application/ld+json">${jsonLd(structuredData(pathname))}</script>`,
  ]
    .map((t) => `    ${t}`)
    .join("\n");
}
