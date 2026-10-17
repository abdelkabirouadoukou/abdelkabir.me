import type { CSSProperties, ReactNode } from "react";
import { Island } from "@thexjs/core";
import { Choreo } from "../components/Choreo";
import { HeroName } from "../components/HeroName";
import { DotField } from "../components/DotField";
import { ProjectIndex } from "../components/ProjectIndex";
import { CollatzLab } from "../components/CollatzLab";
import { Logo } from "../components/Logo";
import { ORBIT, PEAK, SECTIONS, STEPS_TOTAL, fmt, nOf } from "../lib/collatz";
import { SITE } from "../lib/site";

export const islands = { Choreo, HeroName, DotField, ProjectIndex, CollatzLab };

const GH = SITE.github;
const X_REPO = SITE.xRepo;
const MAIL = SITE.email;
const LATEST = `${GH}/CVE-2026-31431-Analysis-and-Fix`;
const v = (i: number) => ({ "--i": i } as CSSProperties);

/** Section header: every section is a step of the n = 27 orbit. */
function Head({ id, no, title, children }: { id: (typeof SECTIONS)[number]["id"]; no: string; title: ReactNode; children?: ReactNode }) {
  const s = SECTIONS.find((x) => x.id === id)!;
  return (
    <header className="sec-head">
      <div className="stone" aria-hidden="true">{nOf(id)}</div>
      <p className="eyebrow" data-reveal>
        <span>{no} / {s.label}</span>
        <span className="calc">{s.calc}</span>
      </p>
      <h2 data-lines>{title}</h2>
      {children}
    </header>
  );
}

const PACKAGES = [
  { name: "core", desc: "Runtime: file-based routing, SSR/SSG, islands, server functions.", code: "bun add @thexjs/core" },
  { name: "cli", desc: "One CLI, three commands: dev, build, start.", code: "x dev · x build · x start" },
  { name: "auth", desc: "Credentials + OAuth2, sessions, CSRF. Passwords hashed with Argon2.", code: "bun add @thexjs/auth" },
  { name: "env", desc: "Type-safe environment validation. Server-only keys never reach the client bundle.", code: "bun add @thexjs/env" },
  { name: "hooks", desc: "SSR-safe React hooks: useDebounce, useMediaQuery, useServerAction and friends.", code: "bun add @thexjs/hooks" },
  { name: "adapter-vercel", desc: "Vercel Build Output API v3.", code: "x build --adapter vercel" },
  { name: "mcp", desc: "An MCP server that grounds AI coding agents in X's real conventions, not Next.js guesses.", code: "bunx @thexjs/mcp" },
  { name: "create-thexjs-app", desc: "Project scaffolder: tailwind, auth, content, hooks, shadcn.", code: "bun create thexjs-app@latest" },
];

const SKILLS = [
  { h: "Programming languages", c: ["Python", "TypeScript", "JavaScript", "SQL", "HTML/CSS"] },
  { h: "Frontend development", c: ["React", "Next.js", "Three.js / React Three Fiber", "Tailwind CSS"] },
  { h: "Backend development", c: ["Bun", "Node.js", "FastAPI", "@thexjs (own framework)"] },
  { h: "Database, CMS & cloud", c: ["SQLite", "Prisma", "Drizzle", "Neon", "Vercel", "Cloudinary"] },
  { h: "AI, tools & auth", c: ["Groq", "Gemini", "Pydantic", "Clerk", "Git", "Selenium"] },
  { h: "Linux & security", c: ["Shell scripting", "systemd", "Server hardening", "Network security", "Privacy tooling"] },
];

const MARQ_A = ["Python", "TypeScript", "JavaScript", "SQL", "React", "Next.js", "Three.js", "Tailwind"];
const MARQ_B = ["Bun", "Node.js", "FastAPI", "SQLite", "Prisma", "Drizzle", "Neon", "Vercel"];

export default function Home() {
  return (
    <>
      <Island name="Choreo" client="load">
        <Choreo />
      </Island>

      {/* ---------------------------------------------------------- nav */}
      <header className="nav">
        <a className="mark" href="#top" data-no-nav aria-label="Abdelkabir Ouadoukou, back to top"><Logo /></a>
        <nav className="nav-links" aria-label="Sections">
          {SECTIONS.slice(1, 7).map((s, i) => (
            <a key={s.id} href={`#${s.id}`} data-no-nav><i>0{i + 1}</i>{s.label}</a>
          ))}
          <a href="#contact" data-no-nav>contact</a>
          <a href={GH} target="_blank" rel="noopener noreferrer" data-no-nav>github ↗</a>
        </nav>
        <details className="menu">
          <summary>menu</summary>
          <nav aria-label="Sections (menu)">
            {SECTIONS.slice(1, 7).map((s, i) => (
              <a key={s.id} href={`#${s.id}`} data-no-nav><i>0{i + 1}</i>{s.label}</a>
            ))}
            <a href="#contact" data-no-nav><i>07</i>contact</a>
          </nav>
        </details>
      </header>

      <main>
        {/* ---------------------------------------------------------- hero · n = 27 */}
        <section className="hero" id="top" aria-label="Introduction">
          <div className="hero-bg" aria-hidden="true">
            <Island name="DotField" client="idle">
              <DotField />
            </Island>
          </div>
          <div className="ghost" aria-hidden="true">27</div>

          <div className="wrap hero-wrap">
            <p className="hero-meta" data-intro style={v(0)}>
              <span>Marrakesh, Morocco</span>
              <span>local <b className="js-clock">--:--</b></span>
              <a className="live" href={X_REPO} target="_blank" rel="noopener noreferrer" data-no-nav><i aria-hidden="true" />building @thexjs ↗</a>
            </p>

            <Island name="HeroName" client="load">
              <HeroName lines={["Abdelkabir", "Ouadoukou"]} />
            </Island>

            <div className="hero-row">
              <div className="hero-copy" data-intro style={v(3)}>
                <p className="tagline">
                  Searching for logic in a world of <u>syntax errors</u>.
                </p>
                <p className="role">
                  Full-stack developer and creator of <a href={X_REPO} target="_blank" rel="noopener noreferrer" data-no-nav>@thexjs</a>.
                  I ship web platforms, build tooling from scratch, and take systems apart to see how they tick.
                </p>
              </div>
              <div className="hero-side" data-intro style={v(4)}>
                <div className="actions">
                  <span className="magnet" data-magnet><a className="btn pri" href="#projects" data-no-nav>View projects ↓</a></span>
                  <span className="magnet" data-magnet><a className="btn" href={GH} target="_blank" rel="noopener noreferrer" data-no-nav>GitHub ↗</a></span>
                </div>
                <p className="hint">
                  This page is one Collatz orbit. n = 27 takes {STEPS_TOTAL} steps to reach 1 and peaks at {fmt(PEAK)}. Scroll to follow it.
                </p>
              </div>
            </div>

            <div className="specs" data-intro style={v(5)}>
              <div className="spec"><b data-count="8">8</b><span>@thexjs packages</span></div>
              <div className="spec"><b data-count="1">1</b><span>client platform live</span></div>
              <div className="spec"><b data-count="1">1</b><span>kernel CVE written up</span></div>
              <div className="spec"><b data-count={String(STEPS_TOTAL)}>{STEPS_TOTAL}</b><span>steps from 27 to 1</span></div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- about · 82 */}
        <section className="sec" id="about">
          <div className="wrap">
            <Head id="about" no="01" title={<>Hello, <em>stranger.</em></>} />
            <p className="statement" data-scrub>
              I'm a student in Marrakesh, and outside of coursework I design and ship software on my own.
            </p>
            <div className="cols">
              <p className="prose" data-reveal>
                Micro-SaaS, educational platforms, open-source tools, whatever I'm curious about that month.
              </p>
              <p className="prose" data-reveal>
                I'm drawn to privacy and network-security tooling, and to math I can actually sit with and work through
                rather than skim. I'd rather build something from scratch and understand every layer of it than stitch
                frameworks together, which is basically why{" "}
                <a href={X_REPO} target="_blank" rel="noopener noreferrer" data-no-nav>@thexjs</a> exists. It's my own
                full-stack framework, and I run it in production on my own projects.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- building · 41 */}
        <section className="sec on-ink" id="building" style={{ paddingBottom: 0 }}>
          <div className="wrap">
            <Head id="building" no="02" title={<>@thexjs, <em>from scratch.</em></>} />
            <div className="build-top">
              <p className="lead" data-reveal>
                A meta-fullstack framework, the kind you'd usually compare to Next.js or Remix rather than call a simple
                SSR wrapper. I built it myself on Bun and React SSR, shipped as a monorepo, and I run it in production
                on my own projects.
              </p>
              <div className="chips" data-reveal>
                <span className="chip">Bun</span><span className="chip">React SSR</span>
                <span className="chip">monorepo</span><span className="chip">islands</span>
              </div>
            </div>
          </div>

          <div className="pk" aria-label="@thexjs packages">
            <p className="pk-hint" aria-hidden="true">packages · keep scrolling →</p>
            <div className="pk-track">
              {PACKAGES.map((p, i) => (
                <article className="pk-card" key={p.name}>
                  <div>
                    <span className="no">{String(i + 1).padStart(2, "0")} / {String(PACKAGES.length).padStart(2, "0")}</span>
                    <h3><small>@thexjs/</small>{p.name}</h3>
                  </div>
                  <p>{p.desc}</p>
                  <code>{p.code}</code>
                </article>
              ))}
            </div>
            <div className="pk-meter" aria-hidden="true"><i /></div>
          </div>

          <div className="wrap" style={{ paddingBottom: "clamp(88px, 13vw, 200px)" }}>
            <div className="lists">
              <div>
                <h3>Recently shipped</h3>
                <ul>
                  <li data-reveal>X 1.3: islands to disk, server-mode islands, and an image proxy</li>
                  <li data-reveal>Fixed a dual-module-instance bug that was breaking island hydration</li>
                  <li data-reveal>Vercel Build Output API v3 adapter</li>
                  <li data-reveal>Security hardening: CSRF, env isolation, security headers</li>
                  <li data-reveal>A full technical audit and docs sprint: roadmap, contributing guide, changelog, deploy docs</li>
                </ul>
              </div>
              <div className="next">
                <h3>Next up</h3>
                <ul>
                  <li data-reveal>Observability</li><li data-reveal>RBAC</li>
                  <li data-reveal>Load testing</li><li data-reveal>Backup / disaster recovery</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- projects · 124 */}
        <section className="sec" id="projects">
          <div className="wrap">
            <Head id="projects" no="03" title={<>Things I've <em>shipped.</em></>} />
            <Island name="ProjectIndex" client="visible">
              <ProjectIndex />
            </Island>
            <a className="more" href={`${GH}?tab=repositories`} target="_blank" rel="noopener noreferrer" data-no-nav data-reveal>
              More on GitHub: every repository <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        {/* ---------------------------------------------------------- skills · 62 */}
        <section className="sec on-blue" id="skills" style={{ paddingBottom: "clamp(64px, 9vw, 140px)" }}>
          <div className="wrap">
            <Head id="skills" no="04" title={<>What I <em>build with.</em></>} />
          </div>
          <div className="marquees" aria-hidden="true">
            {[MARQ_A, MARQ_B].map((words, r) => (
              <div className={`marq${r ? " alt" : ""}`} key={r}>
                {[0, 1].map((g) => (
                  <div className="marq-group" key={g}>{words.map((w) => <span className="mi" key={w}>{w}</span>)}</div>
                ))}
              </div>
            ))}
          </div>
          <div className="wrap">
            <div className="sgroups">
              {SKILLS.map((g) => (
                <div key={g.h} data-reveal>
                  <h3>{g.h}</h3>
                  <div className="chips">{g.c.map((c) => <span className="chip" key={c}>{c}</span>)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- math · 31 */}
        <section className="sec on-paper" id="math">
          <div className="wrap">
            <Head id="math" no="05" title={<>Math I can <em>sit with.</em></>} />
            <div className="math-lead">
              <p className="lead" data-reveal>
                I spend time outside of coursework digging into the Collatz conjecture: ergodic theory, 2-adic dynamics,
                symbolic dynamics, analytic number theory. Also into exam-level math prep, LaTeX styling for problem
                sets, and Monte Carlo simulations for modeling how I'm tracking academically.
              </p>
            </div>
            <div data-reveal>
              <Island name="CollatzLab" client="visible">
                <CollatzLab />
              </Island>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- security · 94 */}
        <section className="sec on-ink" id="security">
          <div className="wrap">
            <Head id="security" no="06" title={<>Break it to <em>build it.</em></>} />
            <div className="sec-split">
              <p className="lead" data-reveal>
                Comfortable on Linux day to day: shell scripting, systemd, basic server hardening, that kind of thing.
                I've also been getting into network security and privacy tooling. Understanding how systems get probed
                and broken helps me build ones that don't. Nothing formal yet, just hands-on curiosity that feeds back
                into how I write and secure my own projects.
              </p>
              <pre className="klog" data-reveal aria-label="Linux and security skills as a kernel log" tabIndex={0}>
<span className="t">[    0.000000]</span> <span className="k">linux:</span>    shell-scripting  systemd  basic-server-hardening{"\n"}
<span className="t">[    0.412093]</span> <span className="k">security:</span> network-security  privacy-tooling{"\n"}
<span className="t">[    0.877120]</span> <span className="k">status:</span>   <span className="ok">ok</span> — nothing formal yet, just hands-on curiosity{"\n"}
<span className="t">[    1.204511]</span> <span className="k">open:</span>     <a href={LATEST} target="_blank" rel="noopener noreferrer" data-no-nav data-cursor="read ↗">CVE-2026-31431 analysis and fix ↗</a>{"\n"}
<span className="t">[    1.204512]</span> <span className="cur" aria-hidden="true" />
              </pre>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------- footer · 1 */}
      <footer className="foot on-saffron" id="end">
        <div className="one" aria-hidden="true">1</div>
        <div className="wrap">
          <p className="eyebrow" style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", paddingBottom: 14, marginBottom: 28, borderBottom: "1.5px solid var(--ink)" }}>
            <span>07 / home</span><span className="calc" style={{ textTransform: "none" }}>…105 steps later = 1</span>
          </p>
          <h2 data-lines>Every orbit <em>ends at 1.</em> Follow the build.</h2>
          <div className="actions">
            <span className="magnet" data-magnet><a className="btn pri" href={`mailto:${MAIL}`} data-no-nav>Say hello ↗</a></span>
            <span className="magnet" data-magnet><a className="btn" href={GH} target="_blank" rel="noopener noreferrer" data-no-nav>GitHub ↗</a></span>
            <span className="magnet" data-magnet><a className="btn" href={X_REPO} target="_blank" rel="noopener noreferrer" data-no-nav>read @thexjs ↗</a></span>
          </div>

          <div className="contact" id="contact">
            <p className="eyebrow">Contact</p>
            <div className="contact-row">
              <a className="mail" href={`mailto:${MAIL}`} data-no-nav data-cursor="write ↗">{MAIL}</a>
              <button type="button" className="copy" data-copy={MAIL} aria-label="Copy email address">copy</button>
            </div>
            <p className="contact-note">Open to client projects, collaborations and interesting problems.</p>
          </div>

          <div className="foot-grid">
            <div>
              <h3>Navigate</h3>
              <ul>
                {SECTIONS.slice(1, 7).map((s) => <li key={s.id}><a href={`#${s.id}`} data-no-nav>{s.label[0].toUpperCase() + s.label.slice(1)}</a></li>)}
                <li><a href="#contact" data-no-nav>Contact</a></li>
                <li><a href="#top" data-no-nav>↑ Back to 27</a></li>
              </ul>
            </div>
            <div>
              <h3>Work</h3>
              <ul>
                <li><a href={X_REPO} target="_blank" rel="noopener noreferrer" data-no-nav>@thexjs ↗</a></li>
                <li><a href="https://www.xymathprepa.com/" target="_blank" rel="noopener noreferrer" data-no-nav>xymathprepa.com ↗</a></li>
                <li><a href={`${GH}/LiveGaffer`} target="_blank" rel="noopener noreferrer" data-no-nav>LiveGaffer ↗</a></li>
                <li><a href={`${GH}/NanoBrainAI`} target="_blank" rel="noopener noreferrer" data-no-nav>NanoBrainAI ↗</a></li>
                <li><a href={LATEST} target="_blank" rel="noopener noreferrer" data-no-nav>CVE-2026-31431 write-up ↗</a></li>
              </ul>
            </div>
            <p className="foot-note">
              Abdelkabir Ouadoukou — building @thexjs.<br />
              Open to interesting problems.<br />
              Marrakesh, Morocco · <b className="js-clock">--:--</b>
            </p>
          </div>
          <div className="foot-row">
            <span>© 2026 · Marrakesh, Morocco</span>
            <span>Built on @thexjs · Lenis · GSAP</span>
          </div>
        </div>
      </footer>
    </>
  );
}
