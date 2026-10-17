import type { ReactNode } from "react";

/**
 * x renders <head> itself (fixed <title>, plus a <link> to /styles.css when
 * public/styles.css exists). Page-level title/meta are set at runtime in
 * Choreo.tsx. Fonts are a stylesheet <link>, which is valid inside <body>.
 * x.config.ts widens the CSP so fonts.googleapis.com / fonts.gstatic.com load.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@400;500&display=swap"
      />
      <a className="skip" href="#about" data-no-nav>Skip to content</a>
      {children}
    </>
  );
}
