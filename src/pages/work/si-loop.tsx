import type { ReactNode } from "react";
import { Logo } from "../../components/Logo";
import { SITE } from "../../lib/site";

/**
 * Case study: SI-Loop. Server-rendered, no islands, no scroll choreography.
 * Every figure on this page comes from the repo (kernel/, README, results/) or from
 * running `example_patch.py` / `kernel.orchestrator calibrate` on it.
 * Links use data-no-nav on purpose: the home page owns scroll (Choreo) and must be
 * loaded fresh, not swapped in by x's client router.
 */

const REPO = `${SITE.github}/si-loop`;
const TERMINAL_RSI = "https://arxiv.org/pdf/2610.22192";
const REPROBRIDGE = "https://deeplearn.org/arxiv/865124/reprobridge:-building-reproducibility-into-ml-research-artifacts";

const SPECS = [
  { n: "7", l: "validation layers per patch" },
  { n: "12", l: "kernel tests" },
  { n: "≈4%", l: "A/A false-accept at n = 200" },
  { n: "1,173", l: "lines of kernel code" },
];

const LAYERS: [string, string][] = [
  ["1 · Strict parse", "JSON schema with key whitelists. At most 8 ops, 20,000 characters, 500-character hypothesis, tag regex. Unknown keys are an error, not ignored."],
  ["2 · Path policy", "Writes only under agent/. Suffixes .py .md .txt .yaml. No traversal, no conftest.py, no dotfiles."],
  ["3 · AST scan", "Every changed .py file is parsed and walked. See the deny-list below."],
  ["4 · Test ratchet", "The set of agent self-test ids may only grow. skip, skipif, xfail, importorskip, pytest_plugins and pytestmark are rejected in tests."],
  ["5 · Atomic apply", "replace_symbol swaps exactly one same-named definition by AST span. Edits are staged in memory and written only if every op succeeds."],
  ["6 · Diff audit", "After commit, the files that changed must equal the files named in the proposal. Anything else is a violation."],
  ["7 · Sandbox", "Self-tests run with rlimits, scrubbed env, own session and process-group SIGKILL on timeout. Container mode adds --network none, read-only root, memory, cpu and pids caps."],
];

const DENY: [string, string][] = [
  ["Imports", "socket, subprocess, ctypes, multiprocessing, shutil, importlib, pickle, marshal, urllib, http, requests, signal, resource, sys, builtins, sqlite3, gc, kernel, sealed; relative imports"],
  ["Builtins", "eval, exec, compile, open, __import__, breakpoint, globals, setattr, delattr; getattr with a computed name"],
  ["os.*", "system, popen, remove, unlink, rename, kill, fork, exec*, spawn*, chmod, chown, environ, putenv, chdir, symlink (including aliases and from-os imports)"],
  ["Dunder routes", "__subclasses__, __globals__, __builtins__, __code__, __class__, __bases__, __mro__, __dict__"],
];

const VERDICTS: [string, string, string][] = [
  ["accept", "lower ≥ −ε  and  delta > 0  and  p_better ≥ p_improve_min", "Promoted by fast-forward merge to main."],
  ["accept (efficiency)", "non-inferior, delta ≥ 0, and ≥ 5% smaller or ≥ 10% fewer tokens", "Cheaper at equal correctness."],
  ["stepping_stone", "non-inferior and behaviourally novel", "Archived, not promoted."],
  ["reject", "anything else", "Branch discarded."],
];

const CALIB: [string, string][] = [
  ["0.80", "≈18%"],
  ["0.90", "≈9%"],
  ["0.95 (default)", "≈3.6–4.1%"],
  ["0.975", "≈2%"],
  ["0.99", "≤ 0.5%"],
];

const DEMO: [string, string, string][] = [
  ["Good patch (structural repair)", "b = 30, c = 1, n = 200", "accepted, promoted"],
  ["Kernel tampering attempt", "path kernel/judge.py is outside agent/", "rejected before anything runs"],
  ["Degrading patch (retries capped at 0)", "b = 0, c = 65, n = 200, delta = −0.325, lower = −0.379", "rejected: not non-inferior"],
];

const STACK: [string, string][] = [
  ["Language", "Python ≥ 3.10, standard library only for the kernel"],
  ["Version control", "Git CLI (≥ 2.30) driven through subprocess: worktrees, fast-forward merges, tags, refs"],
  ["Static analysis", "Python ast: symbol-span replacement, deny-list scan, test-id collection"],
  ["Statistics", "Paired proportions, exact binomial tail, Monte Carlo A/A calibration, exact and sampled Shapley"],
  ["Persistence", "fsynced append-only JSONL ledger, JSON archive, SQLite (Mom Center)"],
  ["Runtime", "Local rlimit sandbox (POSIX) or docker/podman container mode"],
  ["Testing", "pytest kernel suite and a 3-scenario end-to-end demo"],
];

const LIMITS = [
  "The sealed Verifier and the LLM MetaAgent are abstract interfaces. The repo ships no problem families and no model client, and example_patch.py uses a simulated verifier. The demo exercises the kernel; it is not evidence of self-improvement.",
  "The AST scan is a first filter, not a security boundary. It has known blind spots and rejects some benign code. Untrusted runs need container mode.",
  "Adaptive overfitting to the sealed distribution is still possible over many cycles. The mitigation is a rarely-read audit split compared against the selection split.",
  "The A/A noise model is an assumption. The real run-to-run noise has to be estimated from repeated evaluations of an unchanged agent before a pre-registered run.",
  "A learned or LLM-based judge, the main reward-hacking risk in the wider literature, is out of scope.",
];

function Sec({ no, title, children, tone = "" }: { no: string; title: ReactNode; children: ReactNode; tone?: string }) {
  return (
    <section className={`cs-sec ${tone}`}>
      <div className="cs-wrap">
        <p className="eyebrow cs-no">{no}</p>
        <h2 className="cs-h2">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Table({ head, rows, label }: { head: string[]; rows: string[][]; label: string }) {
  return (
    <div className="cs-table" role="region" aria-label={label} tabIndex={0}>
      <table>
        <thead>
          <tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              {r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SiLoopCaseStudy() {
  return (
    <>
      <a className="skip" href="#overview" data-no-nav>Skip to content</a>

      <header className="cs-nav">
        <a className="mark" href="/" data-no-nav aria-label="Abdelkabir Ouadoukou, home"><Logo /></a>
        <nav aria-label="Case study">
          <a href="/#projects" data-no-nav>← projects</a>
          <a href={REPO} target="_blank" rel="noopener noreferrer" data-no-nav>source ↗</a>
        </nav>
      </header>

      <main>
        {/* ------------------------------------------------------------ hero */}
        <section className="cs-hero">
          <div className="cs-wrap">
            <p className="eyebrow">Case study · Python · research kernel</p>
            <h1 className="cs-title">SI-<em>Loop</em></h1>
            <p className="lead cs-sub">
              A closed-loop kernel for recursive self-improvement in autonomous software-engineering agents.
              Every self-modification is isolated, statically validated, tested and either promoted or
              atomically rolled back, on the strength of a paired statistical gate with a measured false-accept rate.
            </p>
            <dl className="cs-meta">
              <div><dt>Role</dt><dd>Author: design, kernel, tests, paper</dd></div>
              <div><dt>Status</dt><dd>Kernel implemented and tested. Verifier and LLM meta-agent are interfaces.</dd></div>
              <div><dt>Evidence</dt><dd>Study 1 ablation (frozen, with paper). Study 2 kernel demo.</dd></div>
            </dl>
            <div className="actions">
              <a className="btn pri" href={REPO} target="_blank" rel="noopener noreferrer" data-no-nav>Read the code ↗</a>
              <a className="btn" href="#architecture" data-no-nav>Architecture ↓</a>
            </div>
            <div className="cs-specs">
              {SPECS.map((s) => (
                <div key={s.l}><b>{s.n}</b><span>{s.l}</span></div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ 01 overview */}
        <Sec no="01 / overview" title={<>The judge is part of <em>the system.</em></>}>
          <div id="overview" className="cs-cols">
            <div className="cs-prose">
              <p>
                A prompt-based agent that edits its own instructions and grades its own work has no fixed point.
                Two failures follow, and both are structural rather than model-quality problems.
              </p>
              <p>
                <b>Drift.</b> Each accepted change looks plausible, but acceptance is decided on noisy evidence.
                Without a controlled error rate, noise-level “improvements” get promoted and the agent random-walks
                away from its last known-good state.
              </p>
              <p>
                <b>Reward hacking.</b> The cheapest way to raise a score is to change the measurement: skip or
                delete tests, weaken the judge, read the oracle, or corrupt the environment the judge runs in.
              </p>
            </div>
            <div className="cs-prose">
              <p>
                SI-Loop treats this as a control problem. The plant is the agent codebase, the only subtree the
                agent may change. The actuator is a structured patch proposal, never a file write. The sensor is a
                sealed verifier on freshly drawn problems. The controller is a gate whose false-accept rate is
                measured by simulation, not assumed. The kernel enforcing all of this is immutable to the agent
                and digest-checked every cycle.
              </p>
              <p>
                The gate itself came from a measured failure. In Study 1 (a toy few-shot regression), the
                lower-confidence-bound judge rejected about 73% of rounds, and the <code>no_judge</code> arm beat the full
                system on the hard split (final loss 0.962 vs 1.048, lower is better). Study 2 replaces it with a
                paired non-inferiority test and an explicit A/A target.
              </p>
            </div>
          </div>

          <div className="cs-note">
            <h3>Related work, and where it differs</h3>
            <p>
              <a href={TERMINAL_RSI} target="_blank" rel="noopener noreferrer" data-no-nav>Terminal-RSI</a> (Tencent
              Hy Frontier with NUS) alternates Recursive Self-Rewrite of verified trajectories with critic-inheriting
              Recursive Policy-Refine to train a terminal agent. Only trajectories that pass verification and
              leakage review feed back into training. SI-Loop shares that rule, that nothing the agent says about
              itself is trusted, but operates one layer up: on agent source code, with no weight updates.
            </p>
            <p>
              <a href={REPROBRIDGE} target="_blank" rel="noopener noreferrer" data-no-nav>ReproBridge</a> (Google)
              builds reproducible ML research artifacts with an agent workflow and scores it on a benchmark of 1,029
              tasks, each anchored by five human-verified reference scores. The parallel is evaluation design:
              judge against fixed external references, not self-report. It is a reproducibility system, not a
              self-improvement one. These are parallels in method, and I make no claim of comparable results.
            </p>
          </div>
        </Sec>

        {/* ------------------------------------------------------------ 02 architecture */}
        <Sec no="02 / architecture & trust boundaries" title={<>Three boundaries, <em>no honour system.</em></>} tone="on-ink">
          <div id="architecture" />

          <h3 className="cs-h3">Zero-trust isolation</h3>
          <div className="cs-cols">
            <div className="cs-prose">
              <p>
                Each cycle begins with <code>git worktree add cand/NNNNNN &lt;parent_sha&gt;</code>. The meta-agent gets
                read-only access to that worktree and returns a JSON proposal. If the worktree is dirty after
                <code> propose()</code>, the cycle is rejected: the agent is not allowed to write, only to ask.
              </p>
              <p>
                The champion lives on <code>main</code> and moves only by fast-forward. If the candidate came from a
                different lineage, it must beat the current champion again before <code>main</code> moves. The branch
                is discarded in a <code>finally</code> block unless it was promoted or archived, so there is no path
                where a failed cycle leaves state behind.
              </p>
            </div>
            <Table
              label="Trust zones"
              head={["Zone", "May write", "Enforcement"]}
              rows={[
                ["Kernel", "nobody at run time", "KernelGuard hashes kernel/*.py (SHA-256) each cycle; any change aborts the run"],
                ["agent/**", "meta-agent, via validated proposals only", "Path policy, AST scan, diff audit"],
                ["Sealed", "the experimenter", "Never mounted into agent processes; the agent sees aggregate signals only"],
              ]}
            />
          </div>

          <h3 className="cs-h3">Defence-in-depth AST sanitization</h3>
          <p className="cs-p">
            Seven layers, each assuming the one before it failed. The static scan alone would be a weak control,
            so it is one layer among several and is documented as such.
          </p>
          <Table label="Per-patch defence layers" head={["Layer", "What it enforces"]} rows={LAYERS} />
          <Table label="AST deny-list" head={["Category", "Blocked"]} rows={DENY} />
          <p className="cs-p cs-quiet">
            The scan is intentionally strict, so it can reject benign code. It is not a security boundary: real
            isolation comes from container mode, with no network and no filesystem path from agent to sealed side.
          </p>

          <h3 className="cs-h3">The non-inferiority statistical gate</h3>
          <p className="cs-p">
            Parent and candidate run on the same freshly drawn sealed problems. With <code>b</code> problems fixed
            by the patch, <code>c</code> broken by it, and <code>n</code> paired problems:
          </p>
          <pre className="cs-code" tabIndex={0} aria-label="Gate formulas">{`delta    = (b - c) / n
se       = sqrt(b + c - (b - c)^2 / n) / n          # paired-proportion standard error
lower    = delta - 1.645 * se                       # one-sided 95% bound
p_better = P(Binomial(b + c + 1, 1/2) <= b)         # = P(Beta(1+b, 1+c) > 0.5), flat prior`}</pre>
          <Table label="Gate verdicts" head={["Verdict", "Condition", "Effect"]} rows={VERDICTS} />
          <p className="cs-p">
            Three guards keep the test honest. The gate raises if parent and candidate were scored on different
            problems, and refuses to decide on fewer than 20 pairs. Cost and size can only break ties among
            non-inferior candidates. Novelty can never rescue a regression.
          </p>

          <h4 className="cs-h4">A/A calibration</h4>
          <p className="cs-p">
            The false-accept rate of null patches (identical true pass rate, independent run-to-run noise) is
            measured directly rather than argued for. Run with <code>n=200, p=0.5, noise=0.1</code> and a pre-registered
            target of 5%, the smallest <code>p_improve_min</code> that meets it is the default, 0.95.
          </p>
          <Table label="A/A false-accept by threshold" head={["p_improve_min", "False-accept rate"]} rows={CALIB} />

          <h4 className="cs-h4">End-to-end demo</h4>
          <Table label="Demo scenarios" head={["Scenario", "Evidence", "Outcome"]} rows={DEMO} />
          <p className="cs-p cs-quiet">
            The demo runs against a simulated verifier with scripted proposals. It checks that the kernel promotes
            the good patch exactly once, blocks the hostile one statically, rejects the regression on the gate,
            leaves no <code>cand/*</code> branches behind and does not touch the kernel.
          </p>
        </Sec>

        {/* ------------------------------------------------------------ 03 highlights */}
        <Sec no="03 / engineering highlights" title={<>Small kernel, <em>strict seams.</em></>}>
          <div className="cs-grid">
            <article>
              <h3>Modular design</h3>
              <p>
                <code>patching.py</code> is pure: parse, validate, apply. <code>orchestrator.py</code> composes Config,
                Budget, Sandbox, GitRepo, KernelGuard, Ledger, Gate, Archive and attribution. The two
                experiment-specific parts, the sealed <code>Verifier</code> and the <code>MetaAgent</code>, are abstract
                interfaces, so the kernel is testable without a model or a benchmark.
              </p>
            </article>
            <article>
              <h3>Shapley credit over code hunks</h3>
              <p>
                Each edit op is one hunk. Value of a coalition is pass@1 on a separate sealed credit split with only
                those ops applied; an inapplicable coalition scores 0. Exact up to 6 hunks (2⁶ coalitions), otherwise seeded
                Monte Carlo over 24 permutations. Efficiency holds, so per-hunk values sum to the total gain, and the
                agent only ever sees hunk-level values.
              </p>
            </article>
            <article>
              <h3>Quality-diversity archive</h3>
              <p>
                Non-inferior but novel candidates are kept as stepping stones, described by per-family pass profile,
                agent size and tokens. The next parent is the champion with probability <code>p_exploit</code> (0.5),
                otherwise sampled by performance × novelty ÷ visits, so the search does not collapse to one lineage.
              </p>
            </article>
            <article>
              <h3>Ledger-based crash recovery</h3>
              <p>
                An fsynced, append-only JSONL write-ahead log records <code>begin</code> and <code>end</code> per cycle.
                A <code>begin</code> with no <code>end</code> marks a crash; <code>recover()</code> discards that
                branch and closes the cycle as rejected on the next start. After 8 consecutive failed cycles a circuit
                breaker cools the loop off for 600 s.
              </p>
            </article>
            <article>
              <h3>Concurrency</h3>
              <p>
                With <code>workers &gt; 1</code>, candidates are evaluated in separate worktrees. Promotion is serialised
                by a lock plus the fast-forward or champion re-gate check, so parallel candidates cannot both win.
              </p>
            </article>
            <article>
              <h3>Memory treated as untrusted</h3>
              <p>
                The “Mom Center” workspace stores patch, failure and credit entries in SQLite, with outcome-based Beta
                trust, TTL and capacity-limited broadcast using salience plus MMR diversity. Every payload is
                sanitised and marked untrusted before it reaches the agent.
              </p>
            </article>
          </div>
        </Sec>

        {/* ------------------------------------------------------------ 04 impact & stack */}
        <Sec no="04 / impact & stack" title={<>What it <em>shows,</em> and what it doesn’t.</>} tone="on-paper">
          <div className="cs-cols">
            <div className="cs-prose">
              <p>
                The result is a kernel where any claim of “the agent improved” arrives with a pre-registered
                false-accept rate attached, and where the failure modes above are blocked structurally instead of
                by prompt. The design also carries a recorded negative result: Study 1’s judge was too conservative,
                and that finding drove the Study 2 gate.
              </p>
              <p>
                The repo documents its own limits, listed below. Closing the first one, a real sealed verifier and
                LLM meta-agent, is the next milestone.
              </p>
            </div>
            <Table label="Tech stack" head={["Layer", "Detail"]} rows={STACK} />
          </div>

          <h3 className="cs-h3">Known limitations</h3>
          <ul className="cs-list">
            {LIMITS.map((l) => <li key={l}>{l}</li>)}
          </ul>

          <div className="actions" style={{ marginTop: 40 }}>
            <a className="btn pri" href={REPO} target="_blank" rel="noopener noreferrer" data-no-nav>github.com/…/si-loop ↗</a>
            <a className="btn" href={`mailto:${SITE.email}`} data-no-nav>Discuss the design ↗</a>
            <a className="btn" href="/#projects" data-no-nav>← Back to projects</a>
          </div>
        </Sec>
      </main>

      <footer className="cs-foot">
        <div className="cs-wrap">
          <span>© 2026 · {SITE.name}</span>
          <a href="/" data-no-nav>abdelkabir.me</a>
        </div>
      </footer>
    </>
  );
}
