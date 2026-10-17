import { defineConfig } from "@thexjs/core";

export default defineConfig({
  pagesDir: "src/pages",
  layoutsDir: "src/layouts",
  port: 3000,

  /**
   * Google Fonts needs style-src + font-src. This REPLACES the default CSP, so it
   * lists everything the site needs: inline island loader scripts, canvas/blob
   * images, and the two Google Fonts hosts. If you self-host the fonts later
   * (e.g. with @fontsource), delete the two googleapis/gstatic entries and drop
   * 'unsafe-inline' from script-src if your x version no longer needs it.
   */
  security: {
    headers: {
      contentSecurityPolicy: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob:",
        "connect-src 'self'",
        "base-uri 'self'",
        "frame-ancestors 'none'",
      ].join("; "),
    },
  },
});
