import type { ReactNode } from "react";
import { GITHUB, NAV, SITE_DESCRIPTION, SITE_TITLE, THEXJS_REPO } from "../data/portfolio";

const FAVICON = "/favicon.svg";

function HeadBootstrap() {
  const script = `(function () {
  var title = ${JSON.stringify(SITE_TITLE)};
  var desc = ${JSON.stringify(SITE_DESCRIPTION)};
  document.title = title;
  function meta(attrs) {
    var m = document.createElement("meta");
    for (var k in attrs) m.setAttribute(k, attrs[k]);
    return m;
  }
  var head = document.head;
  [
    meta({ name: "description", content: desc }),
    meta({ name: "theme-color", content: "#000000" }),
    meta({ property: "og:site_name", content: "abdelkabir.me" }),
    meta({ property: "og:type", content: "profile" }),
    meta({ property: "og:title", content: title }),
    meta({ property: "og:description", content: desc }),
    meta({ name: "twitter:card", content: "summary" }),
  ].forEach(function (m) { head.appendChild(m); });
  var fav = document.createElement("link");
  fav.setAttribute("rel", "icon");
  fav.setAttribute("type", "image/svg+xml");
  fav.setAttribute("href", ${JSON.stringify(FAVICON)});
  head.appendChild(fav);
})();`;
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: static site metadata bootstrap, no user input
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeadBootstrap />

      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-5">
          <a href="#top" className="font-mono text-sm text-foreground">
            <span className="text-accent">~</span>/abdelkabir
          </a>

          <nav aria-label="Sections" className="hidden items-center gap-6 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-spy
                className="font-mono text-xs text-muted transition-colors hover:text-foreground hover:underline hover:decoration-accent hover:underline-offset-8 data-[active]:text-foreground data-[active]:underline data-[active]:decoration-accent data-[active]:underline-offset-8"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden font-mono text-xs text-muted transition-colors hover:text-foreground hover:underline hover:decoration-accent hover:underline-offset-8 sm:inline-block"
          >
            github ↗
          </a>
        </div>

        <nav
          aria-label="Sections (mobile)"
          className="no-scrollbar flex gap-5 overflow-x-auto px-5 pb-3 md:hidden"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-spy
              className="shrink-0 font-mono text-xs text-muted transition-colors hover:text-foreground data-[active]:text-foreground data-[active]:underline data-[active]:decoration-accent data-[active]:underline-offset-4"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-5">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-xs text-faint">
              © 2026 · marrakesh, morocco
            </p>
            <p className="mt-1 text-sm text-foreground/85">
              Abdelkabir Ouadoukou <span className="text-faint">·</span>{" "}
              <span className="text-muted">solo developer</span>
            </p>
          </div>
          <div className="flex flex-col gap-2 font-mono text-xs sm:items-end">
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-foreground"
            >
              github ↗
            </a>
            <a
              href={THEXJS_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-accent"
            >
              built with <span className="text-foreground">@thexjs</span> ↗
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}