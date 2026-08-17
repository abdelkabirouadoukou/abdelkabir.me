import { CLIENT_PROJECT, projects } from "../../data/portfolio";
import type { GitHubData } from "../../lib/github";
import SectionHeading from "./SectionHeading";

interface ProjectCard {
  name: string;
  description: string;
  language: string | null;
  topics: string[];
  href: string;
  isPinned: boolean;
  isClient: boolean;
}

const LANG_COLORS: Record<string, string> = {
  Python: "#3572a5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00add8",
  Rust: "#dea584",
  Shell: "#89e051",
};

function langColor(lang: string | null): string {
  return (lang && LANG_COLORS[lang]) || "#767676";
}

export default function Projects({ github }: { github: GitHubData | null }) {
  const repos = github?.repos ?? [];

  const cards: ProjectCard[] = [
    {
      name: CLIENT_PROJECT.name,
      description: CLIENT_PROJECT.description,
      language: CLIENT_PROJECT.language,
      topics: CLIENT_PROJECT.stack,
      href: CLIENT_PROJECT.href,
      isPinned: false,
      isClient: true,
    },
    ...(repos.length > 0
      ? repos.map((r) => ({
          name: r.name,
          description: r.description ?? "No description yet.",
          language: r.language,
          topics: r.topics.slice(0, 4),
          href: r.htmlUrl,
          isPinned: r.isPinned,
          isClient: false,
        }))
      : projects.map((p) => ({
          name: p.name,
          description: p.description,
          language: p.stack[0] ?? null,
          topics: p.stack.slice(1),
          href: p.href,
          isPinned: false,
          isClient: false,
        }))),
  ];

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="border-t border-border py-20"
    >
      <SectionHeading id="projects-heading" index="03" title="Featured Projects" />

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((project) => (
          <a
            key={project.name}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex flex-col border border-border p-5 transition-colors hover:border-accent/50${
              project.isClient ? " sm:col-span-2" : ""
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <h3 className="min-w-0 font-mono text-[15px] font-semibold text-foreground [overflow-wrap:anywhere]">
                {project.name}
                {project.isClient && (
                  <span className="ml-2 align-middle rounded-sm border border-accent/40 bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                    client project
                  </span>
                )}
                {project.isPinned && (
                  <span className="ml-2 align-middle font-mono text-[10px] uppercase tracking-wider text-accent">
                    pinned
                  </span>
                )}
              </h3>
              <span
                aria-hidden="true"
                className="font-mono text-sm text-faint transition-colors group-hover:text-accent"
              >
                ↗
              </span>
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: langColor(project.language) }}
                />
                {project.language ?? "no language"}
              </span>
              {project.topics.map((topic) => (
                <span
                  key={topic}
                  className="border border-border px-1.5 py-0.5 font-mono text-[10px] text-faint"
                >
                  #{topic}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}