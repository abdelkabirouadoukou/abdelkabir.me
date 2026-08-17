import { GITHUB, THEXJS_REPO } from "../../data/portfolio";
import type { GitHubData } from "../../lib/github";

export default function Hero({ github }: { github: GitHubData | null }) {
  const followers = github?.followers ?? 145;
  const repos = github?.publicRepos ?? 81;

  return (
    <section
      id="top"
      aria-label="Intro"
      className="relative flex min-h-[70svh] flex-col justify-center overflow-hidden py-24 sm:min-h-[72svh]"
    >
      <div className="hero-glow hidden sm:block" aria-hidden="true" />

      <div className="relative">
        <p className="font-mono text-xs text-muted sm:text-sm">
          <span className="text-accent">abdelkabir</span>@marrakesh:~$ whoami
        </p>

      <h1 className="mt-6 font-mono text-[clamp(2rem,9vw,3.75rem)] font-semibold leading-[1.12] tracking-tight">
        Abdelkabir Ouadoukou
      </h1>

      <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/90 sm:text-lg">
        Searching for logic in a world of syntax errors.
        <span
          aria-hidden="true"
          className="animate-blink ml-1 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] bg-foreground/60"
        />
      </p>

      <p className="mt-4 font-mono text-xs text-muted sm:text-sm">
        marrakesh, morocco · building{" "}
        <a
          href={THEXJS_REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent transition-opacity hover:opacity-80"
        >
          @thexjs
        </a>
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <a
          href="#projects"
          className="group bg-accent px-4 py-2 font-mono text-sm font-medium text-background transition-colors hover:bg-accent/90"
        >
          view projects{" "}
          <span className="inline-block transition-transform group-hover:translate-y-0.5">↓</span>
        </a>
        <a
          href={GITHUB}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-border px-4 py-2 font-mono text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          github ↗
        </a>
      </div>

      <p className="mt-10 max-w-2xl font-mono text-xs text-muted">
        solo developer<span className="text-faint"> · </span>framework builder
        <span className="text-faint"> · </span>
        {repos} repos, {followers} followers
      </p>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-8 right-6 hidden flex-col items-center gap-2 lg:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-border">
          <span className="animate-scroll-cue absolute left-0 top-0 h-3 w-px bg-accent/70" />
        </span>
      </div>
    </section>
  );
}