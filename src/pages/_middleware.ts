import type { MiddlewareFn } from "@thexjs/core";
import { escapeHtml } from "@thexjs/core";
import { SITE } from "../lib/site";
import { headTags } from "../lib/head";

/**
 * Server-side <head> for every HTML page.
 *
 * x ships a fixed `<title>x app</title>` and has no page-level head API, which is
 * what search engines and link-preview bots (they don't run JS) were seeing. This
 * swaps in the real title and injects description, canonical, Open Graph, Twitter
 * cards, icons and JSON-LD before the response leaves the server.
 */
export const middleware: MiddlewareFn = async (ctx, next) => {
  const res = await next();
  if (res.status !== 200 || !(res.headers.get("content-type") ?? "").includes("text/html")) return res;

  const html = await res.text();
  if (!html.includes("</head>")) return new Response(html, res);

  const { pathname } = new URL(ctx.request.url);
  const out = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(SITE.title)}</title>`)
    .replace("</head>", `${headTags(pathname)}\n  </head>`);

  const headers = new Headers(res.headers);
  headers.delete("content-length");
  return new Response(out, { status: res.status, statusText: res.statusText, headers });
};
