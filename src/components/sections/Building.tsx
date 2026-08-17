import { THEXJS_REPO } from "../../data/portfolio";
import SectionHeading from "./SectionHeading";

const THEXJS_PACKAGES = [
  { name: "core", desc: "runtime: routing, SSR/SSG, islands, server functions" },
  { name: "cli", desc: "x dev / x build / x start" },
  { name: "auth", desc: "credentials + OAuth2, sessions, CSRF" },
  { name: "env", desc: "type-safe environment validation" },
  { name: "adapter-vercel", desc: "Vercel Build Output API v3" },
  { name: "create-thexjs-app", desc: "project scaffolder" },
];

const RECENT_WORK = [
  "Fixed a dual-module-instance bug that was breaking island hydration",
  "Vercel Build Output API v3 adapter",
  "Security hardening: CSRF, env isolation, security headers",
  "A full technical audit and docs sprint: roadmap, contributing guide, changelog, deploy docs",
];

const NEXT_UP = ["Observability", "RBAC", "Load testing", "Backup / disaster recovery"];

export default function Building() {
  return (
    <section
      id="building"
      aria-labelledby="building-heading"
      className="border-t border-border py-20"
    >
      <SectionHeading id="building-heading" index="02" title="Currently Building" />

      <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-foreground/85">
        <a
          href={THEXJS_REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          @thexjs
        </a>{" "}
        is a meta-fullstack framework, the kind you'd usually compare to Next.js or Remix rather
        than call a simple SSR wrapper. I built it myself on Bun and React SSR, shipped as a
        monorepo, and I run it in production on my own projects.
      </p>

      <ul className="divide-y divide-border border border-border">
        {THEXJS_PACKAGES.map((pkg) => (
          <li
            key={pkg.name}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3 font-mono text-xs sm:text-[13px]"
          >
            <span className="shrink-0 text-foreground">@thexjs/{pkg.name}</span>
            <span className="min-w-0 flex-1 basis-40 text-left text-muted sm:text-right">
              {pkg.desc}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            Recently shipped
          </h3>
          <ul className="mt-4 space-y-2.5">
            {RECENT_WORK.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
                <span aria-hidden="true" className="mt-1.5 h-px w-3 shrink-0 bg-accent/60" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Next up</h3>
          <ul className="mt-4 space-y-2.5">
            {NEXT_UP.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
                <span aria-hidden="true" className="mt-1.5 h-px w-3 shrink-0 bg-accent/60" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}