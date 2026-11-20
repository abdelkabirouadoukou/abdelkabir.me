import type { ReactNode } from "react";
import { Logo } from "../../components/Logo";
import { Abs, BmC, Delta, Eq, I, V } from "../../components/Eq";
import { AblationArms, Architecture, Calibration, FdrLevels, SeedGains } from "../../components/SiFigs";
import { SITE } from "../../lib/site";

/**
 * Case study: SI-Loop. Server-rendered, no islands, no scroll choreography.
 * Same design system as the home page — sand ground, alternating ink / cobalt /
 * saffron blocks, hairline rules, mono micro-labels (see design-system/MASTER.md).
 * Every figure comes from the repo: kernel/, results/study2|study3, study4/README.md,
 * or from running the suite (`python -m pytest -q tests` → 155 passed).
 * Links use data-no-nav on purpose: the home page owns scroll (Choreo) and must be
 * loaded fresh, not swapped in by x's client router. In-page anchors rely on the
 * browser's native smooth scrolling (see `scroll-behavior` in globals.css).
 */

const REPO = `${SITE.github}/si-loop`;
const paper = (f: string) => `${REPO}/blob/main/${f}`;
const PAPER1 = paper("paper.pdf");
const PAPER2 = paper("paper_study2.pdf");
const PAPER3 = paper("paper_study3.pdf");
const PAPER4 = paper("paper_study4.pdf");
const DEVIATIONS = `${REPO}/blob/main/results/study3/DEVIATIONS.md`;
const TERMINAL_RSI = "https://arxiv.org/pdf/2610.22192";
const REPROBRIDGE = "https://deeplearn.org/arxiv/865124/reprobridge:-building-reproducibility-into-ml-research-artifacts";

/* ------------------------------------------------------------------ references (Study 1 paper) */
const REFS: { n: number; text: string; arxiv?: string }[] = [
  { n: 1, text: "Bernard J. Baars. A Cognitive Theory of Consciousness. Cambridge University Press, 1988." },
  { n: 2, text: "Rujikorn Charakorn, Edoardo Cetin, Yujin Tang, and Robert Tjarko Lange. Text-to-LoRA: Instant transformer adaption. In Proceedings of the 42nd International Conference on Machine Learning (ICML), volume 267 of PMLR, 2025.", arxiv: "2506.06105" },
  { n: 3, text: "Mingguang Chen, Licheng Wang, and Bo Qu. Recursive self-improvement in AI: From bounded self-refinement to autonomous research loops. arXiv preprint, 2026.", arxiv: "2607.07663" },
  { n: 4, text: "Thomas Coste, Usman Anwar, Robert Kirk, and David Krueger. Reward model ensembles help mitigate overoptimization. In International Conference on Learning Representations (ICLR), 2024.", arxiv: "2310.02743" },
  { n: 5, text: "Cynthia Dwork, Vitaly Feldman, Moritz Hardt, Toniann Pitassi, Omer Reingold, and Aaron Roth. The reusable holdout: Preserving validity in adaptive data analysis. Science, 349(6248):636–638, 2015." },
  { n: 6, text: "Leo Gao, John Schulman, and Jacob Hilton. Scaling laws for reward model overoptimization. In Proceedings of the 40th International Conference on Machine Learning (ICML), 2023.", arxiv: "2210.10760" },
  { n: 7, text: "Bochen Han and Songmao Zhang. Exploring advanced LLM multi-agent systems based on blackboard architecture. arXiv preprint, 2025.", arxiv: "2507.01701" },
  { n: 8, text: "Prannay Hebbar, Yogendra Manawat, Samuel Verboomen, Alesia Ivanova, Selvam Palanimalai, Kunal Bhatia, and Vignesh Baskaran. SIA: Self improving AI with harness & weight updates. arXiv preprint, 2026.", arxiv: "2605.27276" },
  { n: 9, text: "Zhiyuan Liang, Dongwen Tang, Yuhao Zhou, Xuanlei Zhao, Mingjia Shi, Wangbo Zhao, Zekai Li, Peihao Wang, Konstantin Schürholt, Damian Borth, Michael M. Bronstein, Yang You, Zhangyang Wang, and Kai Wang. Drag-and-drop LLMs: Zero-shot prompt-to-weights. arXiv preprint, 2025.", arxiv: "2506.16406" },
  { n: 10, text: "Wenlong Shang. “Theater of mind” for LLMs: A cognitive architecture based on global workspace theory. arXiv preprint, 2026.", arxiv: "2604.08206" },
  { n: 11, text: "Lloyd S. Shapley. A value for n-person games. In Harold W. Kuhn and Albert W. Tucker, editors, Contributions to the Theory of Games, Volume II, pages 307–317. Princeton University Press, 1953." },
  { n: 12, text: "Jenny Zhang, Shengran Hu, Cong Lu, Robert Lange, and Jeff Clune. Darwin Gödel machine: Open-ended evolution of self-improving agents. arXiv preprint, 2025.", arxiv: "2505.22954" },
  { n: 13, text: "Jenny Zhang, Bingchen Zhao, Wannan Yang, Jakob Foerster, Jeff Clune, Minqi Jiang, Sam Devlin, and Tatiana Shavrina. Hyperagents. arXiv preprint, 2026.", arxiv: "2603.19461" },
  { n: 14, text: "Andrew Zhao, Yiran Wu, Yang Yue, Tong Wu, Quentin Xu, Matthieu Lin, Shenzhi Wang, Qingyun Wu, Zilong Zheng, and Gao Huang. Absolute zero: Reinforced self-play reasoning with zero data. arXiv preprint, 2025.", arxiv: "2505.03335" },
  { n: 15, text: "Chenyu Zhou. More convincing, not more correct: Self-play reward hacking of reference-free LLM judges. arXiv preprint, 2026.", arxiv: "2607.05904" },
  { n: 16, text: "Adam Zweiger, Jyothish Pari, Han Guo, Ekin Akyürek, Yoon Kim, and Pulkit Agrawal. Self-adapting language models. In Advances in Neural Information Processing Systems (NeurIPS), 2025.", arxiv: "2506.10943" },
];

/** Superscript citation, e.g. <C n={[6, 4]} /> → [6, 4], each number links to its entry. */
function C({ n }: { n: number[] }) {
  return (
    <sup className="cite">
      [
      {n.map((k, i) => (
        <span key={k}>
          {i > 0 && ", "}
          <a href={`#ref-${k}`} data-no-nav aria-label={`Reference ${k}`}>{k}</a>
        </span>
      ))}
      ]
    </sup>
  );
}

/* ------------------------------------------------------------------ data (all from the repo) */
const SPECS = [
  { n: "4", l: "pre-registered studies" },
  { n: "155", l: "kernel tests, all passing" },
  { n: "5,430", l: "lines of kernel" },
  { n: "0.9%", l: "A/A false accept, two-stage" },
];

const ZONES: string[][] = [
  ["Kernel", "nobody at run time", "KernelGuard hashes kernel/*.py (SHA-256) every cycle; any change aborts the run"],
  ["agent/**", "the meta-agent, through validated proposals only", "Path policy, AST scan, test ratchet, diff audit"],
  ["Sealed verifier", "the experimenter", "Never shares a process with the candidate; returns aggregates, never content"],
  ["Held-out family", "nobody during selection", "Audited, logged to the ledger, never shown to the agent"],
];

const LAYERS: [string, string][] = [
  ["1 · Strict parse", "JSON schema with key whitelists. At most 8 hunks, bounded characters, tag regex. Unknown keys are an error, not ignored."],
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
  ["accept", "L ≥ −ε, δ̂ > 0 and p_better ≥ τ, confirmed on batch B", "Promoted by fast-forward merge to main."],
  ["accept (utility)", "non-inferior and ≥ 5% smaller, paid for from the margin budget", "Only a new high-water mark of proven gain refills that budget."],
  ["stepping_stone", "non-inferior and behaviourally novel", "Archived, not promoted."],
  ["reject", "anything else", "Branch discarded, worktree removed."],
];

const CALIB: string[][] = [
  ["0.80", "17.8%", "3.2%"],
  ["0.90", "8.8%", "1.6%"],
  ["0.95 (default)", "4.4%", "0.9%"],
  ["0.975", "2.2%", "0.4%"],
  ["0.99", "0.8%", "0.2%"],
];

const DEFENCES: [string, string, string][] = [
  ["Creeping degradation", "Frozen cycle-0 anchor, finite margin budget refilled only by new proven gain, anchor and peak audits with rollback", "kernel/anchor.py"],
  ["Adaptive overfitting", "Two-stage judge (screen on A, confirm on B), SPRT and e-value early stopping, e-LOND FDR, coarse-only feedback, sealed held-out family", "kernel/pipeline.py, stats.py"],
  ["Is the improver improving?", "Yield test against a frozen reference policy, clade-based parent selection, operator bandit", "kernel/yield_test.py, clade.py, bandit.py"],
  ["Weak verification", "Sealed families, three test tiers, honeypots, mutation kill rate", "kernel/verifier.py, mutation.py"],
  ["Long-term autonomy", "Hash-chained ledger, circuit breakers, worktree GC, model fingerprint, watchdog", "kernel/ledger.py, breakers.py, hygiene.py"],
];

const ARMS: string[][] = [
  ["A0", "frozen improver, solver patches only", "+0.178", "1.5", "12,534"],
  ["A1", "full recursive loop, improver yield-tested", "+0.302", "1.8", "29,098"],
  ["A2", "random-patch control, same gate", "−0.017", "2.6", "11,776"],
  ["A3", "compute-matched best-of-N from the anchor", "+0.242", "1.0", "12,429"],
];

const HYPOTHESES: string[][] = [
  ["H1", "A1 − A0 > 0 (evolving the improver adds gain)", "+0.124", "0.3047", "not supported"],
  ["H2", "A0 − A2 > 0 (informed search beats random patches)", "+0.195", "0.0117", "supported"],
  ["H3", "A0 − A3 > 0 (accumulating beats compute-matched sampling)", "−0.064", "0.8438", "not supported"],
  ["H4", "A1 − A0 ≥ −0.02 on the held-out family", "+0.000", "—", "holds"],
];

const REJECTS: string[][] = [
  ["fdr", "7", "Blocked by the enforced online false-discovery monitor"],
  ["no_gain", "2", "Ordinary two-stage rejection: no pass-rate improvement"],
  ["unconfirmed", "2", "Screened well on batch A, did not hold up on independent batch B"],
  ["selftest", "2", "An environment bug, fixed mid-pilot — not a judge outcome"],
];

const STACK: [string, string][] = [
  ["Language", "Python ≥ 3.10. The kernel is standard library only; torch is needed for Study 1 alone"],
  ["Version control", "Git CLI (≥ 2.30) driven through subprocess: worktrees, fast-forward merges, tags, refs"],
  ["Static analysis", "Python ast: symbol-span replacement, deny-list scan, test-id collection"],
  ["Statistics", "Paired proportions, exact binomial tail, SPRT, e-values, e-LOND online FDR, Monte Carlo A/A calibration, exact and sampled Shapley"],
  ["Model access", "Stdlib HTTP only, no SDK. Any OpenAI-compatible endpoint; Studies 3 and 4 ran openai/gpt-oss-120b via Groq"],
  ["Persistence", "Hash-chained, fsynced append-only JSONL ledger, JSON archive, SQLite workspace"],
  ["Runtime", "Local rlimit sandbox (POSIX) or docker/podman container mode"],
  ["Testing", "155 pytest tests, including a fake OpenAI-compatible server — no test calls a real API"],
];

const LIMITS: ReactNode[] = [
  <>The synthetic world (<code>kernel/world.py</code>) makes no claim about LLM self-improvement: its “meta-agent” is a mutation engine. The live studies use a real model, but fifteen short tasks in three families.</>,
  "The AST scan is a first filter, not a security boundary. It has known blind spots and rejects some benign code. Container mode is the real isolation, and it is untested here.",
  <>Study 3's held-out result rests on one function (<code>roman_to_int</code>) in two runs out of nine seeded attempts. The paper's own conclusion is “local, repeated, measured improvement. Not generalization.”</>,
  <>Suite v2 still misses about 29% of the <code>two_sum</code> tie-break defect it was written to catch. That residual is published, not rounded away. Other docstring rules have not been audited.</>,
  "Study 4's pilot is a debugging run, not a replicate set: the code changed partway through as bugs were found. A real result needs a fresh pre-registration and no mid-sequence edits.",
  "Utility-path creep is bounded by the margin budget and the audits, not eliminated. Yield tests are expensive, and cost is counted in lines and tokens, not instructions.",
];

const HIGHLIGHTS: [string, ReactNode][] = [
  ["Immutable by construction", <>The kernel is hashed every cycle and the agent has no path to it. Both experiment-specific pieces — the sealed <code>Verifier</code> and the <code>MetaAgent</code> — are abstract interfaces, so the kernel is testable with no model and no benchmark.</>],
  ["Two-stage judging", <>A lenient screen on batch A with SPRT and e-value early stopping, then the strict gate on an independent batch B. A candidate that wins the screen by luck has to win again on problems it has never been measured against.</>],
  ["Shapley credit over hunks", <>Each edit op is one hunk, and credit is the Shapley value <C n={[11]} /> over hunks on a separate sealed split. Exact up to 6 hunks, 24 seeded permutations beyond that. The agent only ever sees hunk-level values.</>],
  ["Hash-chained ledger", <>An fsynced append-only JSONL write-ahead log records <code>begin</code> and <code>end</code> per cycle, chained so tampering shows. A <code>begin</code> with no <code>end</code> is a crash: <code>recover()</code> discards the branch and closes the cycle as rejected.</>],
  ["Quality-diversity archive", <>Non-inferior but novel candidates are kept as stepping stones, described by per-family pass profile, size and tokens. Parent selection is clade-based, so the search does not collapse into one lineage.</>],
  ["Memory treated as untrusted", <>The workspace stores patch, failure and credit entries with outcome-based Beta trust, TTL and capacity-limited broadcast. Every payload is sanitised — bidi and control characters, chat-template tokens, role labels — and marked untrusted before the agent sees it.</>],
];

const NAV = [
  ["overview", "overview"],
  ["architecture", "architecture"],
  ["gate", "the gate"],
  ["studies", "studies"],
  ["engineering", "engineering"],
  ["limits", "limits"],
  ["references", "refs"],
] as const;

/* ------------------------------------------------------------------ building blocks */
function Sec({ id, no, label, calc, stone, title, tone = "", children }:
  { id: string; no: string; label: string; calc: string; stone: string; title: ReactNode; tone?: string; children: ReactNode }) {
  return (
    <section className={`cs-sec ${tone}`} id={id} aria-labelledby={`${id}-h`}>
      <div className="cs-wrap">
        <header className="sec-head">
          <div className="stone" aria-hidden="true">{stone}</div>
          <p className="eyebrow">
            <span>{no} / {label}</span>
            <span className="calc">{calc}</span>
          </p>
          <h2 id={`${id}-h`}>{title}</h2>
        </header>
        {children}
      </div>
    </section>
  );
}

function Table({ head, rows, label, num }: { head: string[]; rows: string[][]; label: string; num?: number[] }) {
  return (
    <div className="cs-table" role="region" aria-label={label} tabIndex={0}>
      <table>
        <thead>
          <tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              {r.map((c, i) =>
                i === 0
                  ? <th key={i} scope="row">{c}</th>
                  : <td key={i} className={num?.includes(i) ? "num" : undefined}>{c}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Study({ no, status, done, meta, title, children }:
  { no: string; status: string; done?: boolean; meta: string; title: ReactNode; children: ReactNode }) {
  return (
    <article className="study">
      <div className="study-tag">
        <b>{no}</b>
        <span className={`st${done ? " done" : ""}`}>{status}</span>
        <small>{meta}</small>
      </div>
      <div className="study-body">
        <h3>{title}</h3>
        {children}
      </div>
    </article>
  );
}

const pBetter = () => (
  <msub>
    <mi>p</mi>
    <mi>better</mi>
  </msub>
);

/* ------------------------------------------------------------------ page */
export default function SiLoopCaseStudy() {
  return (
    <div className="cs">
      <a className="skip" href="#overview" data-no-nav>Skip to content</a>
      <div className="cs-progress" aria-hidden="true" />

      <header className="cs-nav">
        <a className="mark" href="/" data-no-nav aria-label="Abdelkabir Ouadoukou, home"><Logo /></a>
        <nav aria-label="On this page" className="cs-toc">
          {NAV.map(([id, label]) => <a key={id} href={`#${id}`} data-no-nav>{label}</a>)}
        </nav>
        <nav aria-label="Elsewhere" className="cs-ext">
          <a href="/#projects" data-no-nav>← projects</a>
          <a href={REPO} target="_blank" rel="noopener noreferrer" data-no-nav>source ↗</a>
        </nav>
      </header>

      <main>
        {/* ------------------------------------------------------------ hero */}
        <section className="cs-hero">
          <div className="ghost" aria-hidden="true">4</div>
          <div className="cs-wrap">
            <p className="cs-kicker"><i aria-hidden="true" />Case study · Python · research kernel</p>
            <h1 className="cs-title">SI-<em>Loop</em></h1>
            <p className="cs-sub">
              Guarded recursive self-improvement for code agents. The agent proposes patches to its own
              library; a sealed, calibrated judge decides whether each one survives. Four studies, each one
              built to expose the last one's failure mode rather than to produce a flattering number.
            </p>
            <dl className="cs-meta">
              <div><dt>Role</dt><dd>Sole author: design, kernel, experiments, four papers</dd></div>
              <div><dt>Status</dt><dd>Release november-2026. Studies 1–3 complete; Study 4's runner is built, locked and piloted</dd></div>
              <div>
                <dt>Evidence</dt>
                <dd>
                  <a href={PAPER1} target="_blank" rel="noopener noreferrer" data-no-nav>Study 1</a>,{" "}
                  <a href={PAPER2} target="_blank" rel="noopener noreferrer" data-no-nav>2</a>,{" "}
                  <a href={PAPER3} target="_blank" rel="noopener noreferrer" data-no-nav>3</a> and{" "}
                  <a href={PAPER4} target="_blank" rel="noopener noreferrer" data-no-nav>4</a>, with locked pre-registrations
                </dd>
              </div>
            </dl>
            <div className="actions">
              <a className="btn pri" href={REPO} target="_blank" rel="noopener noreferrer" data-no-nav>Read the code ↗</a>
              <a className="btn" href="#studies" data-no-nav>The four studies ↓</a>
              <a className="btn" href={PAPER4} target="_blank" rel="noopener noreferrer" data-no-nav>Latest paper ↗</a>
            </div>
            <div className="cs-specs">
              {SPECS.map((s) => (
                <div key={s.l}><b>{s.n}</b><span>{s.l}</span></div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ 01 overview */}
        <Sec id="overview" no="01" label="overview" calc="the plant is the agent; the sensor is sealed"
          stone="01" title={<>The judge is part of <em>the system.</em></>}>
          <div className="cs-cols">
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
                Judge exploitation under self-play <C n={[15]} /> and reward-model overoptimisation <C n={[6, 4]} /> are
                the same pressure in learned form.
              </p>
            </div>
            <div className="cs-prose">
              <p>
                SI-Loop treats this as a control problem. The plant is the agent codebase, the only subtree the
                agent may change. The actuator is a structured patch proposal, never a file write. The sensor is a
                sealed verifier on freshly drawn problems. The controller is a gate whose false-accept rate is
                measured by simulation before it is trusted. The kernel enforcing all of this is immutable to the
                agent and digest-checked every cycle.
              </p>
              <p>
                That design came out of a measured failure, and the pattern repeated. Every study so far has found
                a defect in the previous one — an over-cautious judge, a gate clause that was always true, a test
                suite that missed the bug it was written for, a statistical budget that silently reset on restart.
                Each is published with the residual gap left in.
              </p>
            </div>
          </div>

          <aside className="cs-note" aria-label="Related work">
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
              self-improvement one.
            </p>
            <p>
              Within the self-improving-agent literature <C n={[3, 8, 12, 13]} />, SI-Loop's narrow contribution is the
              control layer around self-edits: a sealed judge, a calibrated two-stage gate, online false-discovery
              control and hunk-level credit. Its workspace component draws on global-workspace and blackboard
              ideas <C n={[1, 7, 10]} />. These are parallels in method; I make no claim of comparable results.
            </p>
          </aside>
        </Sec>

        {/* ------------------------------------------------------------ 02 architecture */}
        <Sec id="architecture" no="02" label="architecture" calc="three zones · seven layers · no honour system"
          stone="02" tone="on-ink" title={<>Nothing the agent says <em>is trusted.</em></>}>
          <div className="cs-cols">
            <div className="cs-prose">
              <p>
                Each cycle begins with <code>git worktree add cand/NNNNNN &lt;parent_sha&gt;</code>. The meta-agent gets
                read-only access to that worktree and returns a JSON proposal. If the worktree is dirty after
                {" "}<code>propose()</code>, the cycle is rejected: the agent is not allowed to write, only to ask.
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
              rows={ZONES}
            />
          </div>

          <Architecture />

          <h3 className="cs-h3">Defence-in-depth per patch</h3>
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

          <h3 className="cs-h3">What each failure mode is answered with</h3>
          <Table label="Failure modes and defences" head={["Problem", "Defence", "Code"]} rows={DEFENCES} />
        </Sec>

        {/* ------------------------------------------------------------ 03 the gate */}
        <Sec id="gate" no="03" label="the gate" calc="measure the error rate before trusting the test"
          stone="03" tone="on-paper" title={<>A threshold you can <em>calibrate.</em></>}>
          <p className="cs-p">
            Parent and candidate run on the same freshly drawn sealed problems, so every problem yields a paired
            outcome. Let <I c="b" /> be the problems the patch fixed, <I c="c" /> the problems it broke, and <I c="n" /> the
            number of pairs. Each pair contributes a difference <V><msub><mi>d</mi><mi>i</mi></msub><mo>∈</mo><mo>{"{"}</mo><mo>−</mo><mn>1</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>{"}"}</mo></V>,
            so <V><munder><mo>∑</mo><mi>i</mi></munder><msubsup><mi>d</mi><mi>i</mi><mn>2</mn></msubsup><mo>=</mo><mi>b</mi><mo>+</mo><mi>c</mi></V>. The
            gate works on the plug-in estimate of the mean difference and its standard error.
          </p>

          <Eq label="Paired effect estimate">
            <Delta />
            <mo>=</mo>
            <mfrac>
              <BmC />
              <mi>n</mi>
            </mfrac>
          </Eq>

          <Eq label="Paired-proportion standard error">
            <mi>se</mi>
            <mo>=</mo>
            <mfrac>
              <mn>1</mn>
              <mi>n</mi>
            </mfrac>
            <msqrt>
              <mi>b</mi>
              <mo>+</mo>
              <mi>c</mi>
              <mo>−</mo>
              <mfrac>
                <msup>
                  <mrow>
                    <mo>(</mo>
                    <BmC />
                    <mo>)</mo>
                  </mrow>
                  <mn>2</mn>
                </msup>
                <mi>n</mi>
              </mfrac>
            </msqrt>
          </Eq>

          <Eq label="One-sided lower confidence bound">
            <mi>L</mi>
            <mo>=</mo>
            <Delta />
            <mo>−</mo>
            <mi>z</mi>
            <mo>⋅</mo>
            <mi>se</mi>
            <mo>,</mo>
            <mspace width="2em" />
            <mi>z</mi>
            <mo>=</mo>
            <msub>
              <mi>z</mi>
              <mn>0.95</mn>
            </msub>
            <mo>=</mo>
            <mn>1.645</mn>
          </Eq>

          <p className="cs-p">
            The improvement criterion is the exact posterior probability that the patch fixes problems more often
            than it breaks them. Using only the discordant pairs and a flat prior, it reduces to a binomial tail
            with no normal approximation:
          </p>

          <Eq label="Posterior probability of improvement">
            {pBetter()}
            <mo>=</mo>
            <mi mathvariant="normal">P</mi>
            <mrow>
              <mo>(</mo>
              <mi>Beta</mi>
              <mo>(</mo>
              <mn>1</mn>
              <mo>+</mo>
              <mi>b</mi>
              <mo>,</mo>
              <mn>1</mn>
              <mo>+</mo>
              <mi>c</mi>
              <mo>)</mo>
              <mo>{">"}</mo>
              <mfrac>
                <mn>1</mn>
                <mn>2</mn>
              </mfrac>
              <mo>)</mo>
            </mrow>
            <mo>=</mo>
            <mi mathvariant="normal">P</mi>
            <mrow>
              <mo>(</mo>
              <mi>Bin</mi>
              <mo>(</mo>
              <mi>b</mi>
              <mo>+</mo>
              <mi>c</mi>
              <mo>+</mo>
              <mn>1</mn>
              <mo>,</mo>
              <mfrac>
                <mn>1</mn>
                <mn>2</mn>
              </mfrac>
              <mo>)</mo>
              <mo>≤</mo>
              <mi>b</mi>
              <mo>)</mo>
            </mrow>
          </Eq>

          <p className="cs-p">The decision rule combines the three conditions; correctness is a hard prerequisite, not a score term:</p>

          <Eq label="Accept rule">
            <mi>accept</mi>
            <mo>⟺</mo>
            <mrow>
              <mo>(</mo>
              <mi>L</mi>
              <mo>≥</mo>
              <mo>−</mo>
              <mi>ε</mi>
              <mo>)</mo>
            </mrow>
            <mo>∧</mo>
            <mrow>
              <mo>(</mo>
              <Delta />
              <mo>{">"}</mo>
              <mn>0</mn>
              <mo>)</mo>
            </mrow>
            <mo>∧</mo>
            <mrow>
              <mo>(</mo>
              {pBetter()}
              <mo>≥</mo>
              <mi>τ</mi>
              <mo>)</mo>
            </mrow>
          </Eq>

          <div className="cs-table" role="region" aria-label="Notation" tabIndex={0}>
            <table>
              <thead>
                <tr><th scope="col">Symbol</th><th scope="col">Code</th><th scope="col">Meaning</th></tr>
              </thead>
              <tbody>
                <tr><th scope="row"><I c="b" /></th><td><code>b</code></td><td>problems the patch fixed (fail → pass)</td></tr>
                <tr><th scope="row"><I c="c" /></th><td><code>c</code></td><td>problems the patch broke (pass → fail)</td></tr>
                <tr><th scope="row"><I c="n" /></th><td><code>n</code></td><td>paired problems; the gate refuses to decide below <code>min_pairs</code> = 20</td></tr>
                <tr><th scope="row"><V><Delta /></V></th><td><code>delta</code></td><td>paired effect estimate</td></tr>
                <tr><th scope="row"><V><mi>L</mi></V></th><td><code>lower</code></td><td>one-sided lower bound, <code>z_one_sided</code> = 1.645</td></tr>
                <tr><th scope="row"><V><mi>ε</mi></V></th><td><code>eps_noninferior</code></td><td>non-inferiority margin, 0.02 pass@1</td></tr>
                <tr><th scope="row"><V><mi>τ</mi></V></th><td><code>p_improve_min</code></td><td>posterior threshold, A/A-calibrated, default 0.95</td></tr>
              </tbody>
            </table>
          </div>

          <Table label="Gate verdicts" head={["Verdict", "Condition", "Effect"]} rows={VERDICTS} />
          <p className="cs-p">
            Three guards keep the test honest. The gate raises if parent and candidate were scored on different
            problems, and refuses to decide on fewer than 20 pairs. Cost and size can only break ties among
            non-inferior candidates, and spend from a finite margin budget. Novelty can never rescue a regression.
            Drawing fresh problems every cycle limits the adaptive reuse of a fixed evaluation set <C n={[5]} />.
          </p>

          <h3 className="cs-h3">Two stages, because one invites the winner's curse</h3>
          <p className="cs-p">
            A single test on a single batch rewards a candidate that got lucky. So the gate screens leniently on
            batch A — chunked, with an e-value harm stop and an SPRT futility stop, so hopeless candidates die
            cheaply — and then confirms on an independent batch B at full strictness. Only the confirmation can
            promote. The cost is power; the benefit is measured below.
          </p>

          <h4 className="cs-h4">A/A calibration</h4>
          <p className="cs-p">
            The false-accept rate on null patches (identical true pass rate, independent run-to-run noise) is
            measured by simulating the gate on <V><mi>T</mi></V> null pairs, then the threshold is the smallest grid
            value that meets a pre-registered target <V><mi>α</mi></V>:
          </p>

          <Eq label="Empirical false-accept rate">
            <mover accent="true">
              <mi>FAR</mi>
              <mo>^</mo>
            </mover>
            <mo>(</mo>
            <mi>τ</mi>
            <mo>)</mo>
            <mo>=</mo>
            <mfrac>
              <mn>1</mn>
              <mi>T</mi>
            </mfrac>
            <mo>⋅</mo>
            <Abs>
              <mrow>
                <mo>{"{"}</mo>
                <mi>t</mi>
                <mo>≤</mo>
                <mi>T</mi>
                <mo>:</mo>
                <mtext> gate accepts null pair </mtext>
                <mi>t</mi>
                <mo>{"}"}</mo>
              </mrow>
            </Abs>
          </Eq>

          <figure className="fig">
            <div className="fig-plate">
              <Calibration />
            </div>
            <figcaption>
              <b>Figure 1.</b> A/A calibration at <code>n = 200</code>, <code>p = 0.5</code>, <code>noise = 0.1</code>, 2,000 trials.
              The single-stage test only reaches the 5% target at τ ≈ 0.95; the two-stage gate is under it at every
              threshold on the grid and sits at 0.9% at the default. From <code>results/study2/calibration.json</code>.
            </figcaption>
          </figure>

          <Table
            label="A/A false-accept by threshold"
            head={["τ (p_improve_min)", "Single stage", "Two stage"]}
            rows={CALIB}
            num={[1, 2]}
          />
          <p className="cs-p cs-quiet">
            The same simulation measures power: at a true gain of 6 pass-rate points the two-stage gate accepts
            75% of the time against the single stage's 81%. That is the price of the second batch, paid on purpose.
          </p>

          <h4 className="cs-h4">Online false-discovery control</h4>
          <p className="cs-p">
            Every cycle is another test, and the agent chooses what to test next, so the sequence is adaptive.
            e-LOND keeps the error rate valid anyway: the level allowed at test <V><mi>t</mi></V> shrinks with the
            number of tests already run and widens only when a discovery is actually made.
          </p>

          <Eq label="e-LOND level at test t">
            <msub><mi>α</mi><mi>t</mi></msub>
            <mo>=</mo>
            <mi>α</mi>
            <mo>⋅</mo>
            <msub><mi>γ</mi><mi>t</mi></msub>
            <mo>⋅</mo>
            <mrow>
              <mo>(</mo>
              <msub><mi>D</mi><mrow><mi>t</mi><mo>−</mo><mn>1</mn></mrow></msub>
              <mo>+</mo>
              <mn>1</mn>
              <mo>)</mo>
            </mrow>
            <mo>,</mo>
            <mspace width="1.4em" />
            <msub><mi>γ</mi><mi>t</mi></msub>
            <mo>=</mo>
            <mfrac>
              <mn>6</mn>
              <mrow><msup><mi>π</mi><mn>2</mn></msup><msup><mi>t</mi><mn>2</mn></msup></mrow>
            </mfrac>
          </Eq>

          <p className="cs-p cs-quiet">
            Two counters, <V><mi>t</mi></V> and <V><mi>D</mi></V>, reproduce the whole trajectory — which is exactly why
            the budget could be rebuilt from the ledger after it was found resetting on restart (Study 4, below).
          </p>
        </Sec>

        {/* ------------------------------------------------------------ 04 studies */}
        <Sec id="studies" no="04" label="four studies" calc="each one undercuts the one before it"
          stone="04" title={<>Every result <em>complicates</em> the last.</>}>
          <p className="cs-p" style={{ maxWidth: "62ch", marginBottom: "clamp(32px, 4vw, 52px)" }}>
            Four studies, each pre-registered before it ran, each with its paper and its raw data in the repo.
            The headline of every one of them is a problem with the study before it. That is the design, not an
            accident of how it went.
          </p>

          <div className="studies">
            <Study no="Study 1" status="frozen" done meta="toy few-shot regression · CPU · 4 arms × 10 seeds"
              title={<>An over-cautious judge, <em>measured.</em></>}>
              <p>
                A hypernetwork emits adapters for a worker network, a learnability-driven curriculum picks what to
                train on, and a guarded judge accepts or rolls back every round. Four arms — full system, no
                workspace, random-winner workspace, no judge — ten paired seeds, analysis plan written down first.
              </p>
              <div className="study-find">
                <b>Finding</b>
                <p>
                  The judge rejected about 73% of rounds, giving the guarded arms roughly four times fewer effective
                  updates. Removing it entirely <i>improved</i> the hard-split score by 0.086 — the opposite direction a
                  safety mechanism is meant to move things. The workspace showed no detectable effect at this power.
                </p>
              </div>
              <p className="cs-quiet">
                The toy world had no adversarial pressure at all, so this measures the price of an over-conservative
                gate, not whether a gate is needed. Files are frozen and pinned by sha-256; the tag is <code>study1-frozen</code>.
              </p>
            </Study>

            <figure className="fig">
              <div className="fig-plate">
                <img src="/results/curves.png" width={2000} height={700} loading="lazy" decoding="async"
                  alt="Two line charts of query MSE over twelve rounds for the arms full, no_ws, random_ws and no_judge, on a uniform-difficulty set and on the hard set. no_judge ends lowest on both; the hard-set curve is noisier with spikes near rounds 3 and 6; shaded bands overlap heavily." />
              </div>
              <figcaption>
                <b>Figure 2.</b> Study 1, per-round query MSE (mean ± s.e. over 10 seeds) on the uniform-difficulty set
                (left) and the hard set (right). <code>no_judge</code> descends fastest and ends lowest on both, but its
                hard-set trajectory is the noisiest and the bands overlap for most of the run. Final hard-split means:
                full 1.048, no_ws 1.038, random_ws 1.022, no_judge 0.962. Figure as published in the frozen paper.
              </figcaption>
            </figure>

            <Study no="Study 2" status="complete" done meta="code agent · sealed verifier · git worktrees"
              title={<>Throw out the toy, <em>build the kernel.</em></>}>
              <p>
                Everything since runs on this kernel unmodified: worktree isolation, the seven-layer patch defence,
                a sealed verifier with hidden tests, the two-stage gate, the frozen anchor and margin budget, the
                held-out family, the hash-chained ledger. Validated three ways — calibration, mutation testing of
                the verifier itself, and a pre-registered synthetic ablation.
              </p>
              <div className="study-find">
                <b>Finding</b>
                <p>
                  Mutation testing injected 248 mutants into the task library: 86.7% killed raw, 99.5% after
                  discounting likely-equivalent mutants, with zero false failures on reference solutions. The gate
                  cleanly separated informed patches from random ones — but the fully recursive arm never cleared
                  its own pre-registered bar.
                </p>
              </div>
            </Study>

            <figure className="fig">
              <div className="fig-plate fig-narrow">
                <AblationArms />
              </div>
              <figcaption>
                <b>Figure 3.</b> Synthetic ablation, eight paired seeds. The informed loop beats the random-patch
                control decisively, which is the result that matters for the gate. A1 over A0 is the recursive claim,
                and it did not clear the bar. From <code>results/study2/ablation_summary.json</code>.
              </figcaption>
            </figure>

            <Table
              label="Ablation arms"
              head={["Arm", "What it is", "Selection gain", "Accepts", "Tokens"]}
              rows={ARMS}
              num={[2, 3, 4]}
            />
            <Table
              label="Pre-registered hypotheses"
              head={["", "Hypothesis", "Mean Δ", "Holm p", "Verdict"]}
              rows={HYPOTHESES}
              num={[2, 3]}
            />
            <p className="cs-p cs-quiet">
              The interpretation rule was fixed in <code>prereg.json</code> before the run: a recursive-improvement claim
              needs H1 and H4 and no halted run. H1 came in at Holm p = 0.30, so the result is reported as iterative
              improvement only — the phrase the pre-registration itself specifies.
            </p>

            <Study no="Study 3" status="complete" done meta="live model · gpt-oss-120b via Groq · 6 replicates"
              title={<>A real model, <em>behind the same gate.</em></>}>
              <p>
                The kernel unchanged underneath, with a live LLM in the <code>MetaAgent</code> seat on the solver-only
                arm. It reads library source and docstrings — never hidden tests, oracles, pass counts, family names
                or held-out results — and gets back accept, reject or stepping-stone plus a short error type. Six
                independent pre-registered replicates, each with its own secret and fresh problems.
              </p>
              <div className="study-find">
                <b>Finding</b>
                <p>
                  Repeatability met, 6 of 6: every replicate produced a correctness-path accept, a positive selection
                  gain and no broken problems. Generalisation not met, 1 of 6 against a pre-declared bar of 4 — and
                  that single transfer came from one docstring fix to <code>roman_to_int</code>. The paper's own words:
                  local, repeated, measured improvement; not generalization.
                </p>
              </div>
            </Study>

            <figure className="fig">
              <div className="fig-plate">
                <SeedGains />
              </div>
              <figcaption>
                <b>Figure 4.</b> The six pre-registered replicates (seeds 4–9), pass-rate gain over the frozen cycle-0
                anchor on 120 fresh problems per family. Mean selection gain +0.244 (95% t-interval 0.122 to 0.366).
                Held-out transfer appears once, in seed 9. From <code>results/study3/seed_summary.json</code>.
              </figcaption>
            </figure>

            <aside className="cs-note" aria-label="Disclosed deviations">
              <h3>Two defects in my own judge, found and published</h3>
              <p>
                <b>D1 — a gate clause that was always true.</b> The utility path accepted a patch for being
                “cheaper”, defined as 5% fewer lines <i>or</i> 10% fewer tokens. The reference verifier reports
                <code>tokens = 0</code> for every candidate, so <code>0 ≤ 0.90 × 0</code> held every time. A cycle-0 patch
                was accepted as an efficiency gain at p_better 0.9375, below the real 0.95 bar, while the code
                actually grew from 88 to 89 lines. The token clause is gone; the pilot is kept unchanged as evidence.
              </p>
              <p>
                <b>D2 — a suite that missed the bug it was for.</b> A <code>two_sum</code> patch returned the first pair
                found rather than the pair with the smallest first index. Suite v1 caught that on about 14% of
                problems. Suite v2 uses 12 cases per problem plus targeted repeated-value cases and catches about
                71% — so roughly 29% is still missed, and that number is published rather than rounded away.
              </p>
              <p className="cs-quiet">
                Both changes were made after seeing results, so both are reported as post-hoc, with the affected
                seeds analysed separately. Full text: <a href={DEVIATIONS} target="_blank" rel="noopener noreferrer" data-no-nav>results/study3/DEVIATIONS.md</a>.
              </p>
            </aside>

            <Study no="Study 4" status="piloted, not replicated" meta="improver arm · FDR enforced · 13 cycles"
              title={<>Can the loop improve <em>its own improver?</em></>}>
              <p>
                Not “can the model improve the library” — Study 3 answered that — but whether the loop can improve
                the code that proposes and judges its own changes. Arm A1 may edit <code>agent/meta/policy.py</code>,
                judged by a yield test against a frozen reference policy, and one patch touches the solver or the
                policy, never both. It is also the first run with the false-discovery monitor set to enforce rather
                than log, which is exactly the gap Study 3 named in its own limitations.
              </p>
              <div className="study-find">
                <b>Finding</b>
                <p>
                  Three real bugs surfaced while building the runner, none of them in the protected kernel. The
                  central one: the orchestrator built a fresh e-LOND state on every construction, so a study run as
                  many separate CLI invocations was silently handing itself a fresh error budget each launch. The fix
                  replays the run's own ledger to rebuild the exact <code>(t, d)</code> state — and needed no kernel edit,
                  because the judge already took an optional pre-built monitor.
                </p>
              </div>
              <p>
                The fix was verified by prediction, not just by test: the required level for the next live cycle was
                computed from the ledger beforehand (0.0012158542…) and the live run came in at exactly that value.
              </p>
            </Study>

            <figure className="fig">
              <div className="fig-plate">
                <FdrLevels />
              </div>
              <figcaption>
                <b>Figure 5.</b> The enforced budget over the pilot's seven correctness-path tests. With no discoveries
                to replenish it, the required level falls almost fiftyfold, from 0.0304 to 0.00062. Test 7 reached
                p_better = 0.9999 — a correct, unremarkable implementation of two unfinished seed functions — and was
                still rejected. That is a cold-started anytime-valid budget behaving as specified, not a malfunction.
              </figcaption>
            </figure>

            <Table label="Pilot rejections by reason" head={["Reason", "Count", "What it was"]} rows={REJECTS} num={[1]} />
            <p className="cs-p">
              Thirteen cycles, zero accepts. Every judged cycle was solver-scope: across the whole pilot the model
              never once attempted the <code>agent/meta/policy.py</code> edit its prompt explicitly allows. With n = 13
              that is an observation, not a finding. The paper makes no claim about arm A1's capability either way —
              zero accepts under a cold-started enforced budget is an infrastructure-correctness result.
            </p>
            <p className="cs-p cs-quiet">
              This pilot is not a pre-registered replicate: the code changed partway through as those three bugs were
              found and fixed. A clean replicate set needs a fresh pre-registration and no mid-sequence edits — the
              same discipline Study 3 held after D1 and D2. That is the next milestone.
            </p>
          </div>
        </Sec>

        {/* ------------------------------------------------------------ 05 engineering */}
        <Sec id="engineering" no="05" label="engineering" calc="5,430 lines of kernel · 155 tests"
          stone="05" tone="on-blue" title={<>Small kernel, <em>strict seams.</em></>}>
          <div className="cs-grid">
            {HIGHLIGHTS.map(([h, body]) => (
              <article key={h}>
                <h3>{h}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>

          <h3 className="cs-h3">Hunk-level credit assignment</h3>
          <p className="cs-p">
            Let <V><mi>N</mi></V> be the hunks of a patch and <V><mi>v</mi><mo>(</mo><mi>S</mi><mo>)</mo></V> the pass@1 of the
            parent with only the hunks in <V><mi>S</mi></V> applied, on the credit split. A coalition whose ops cannot
            be applied scores 0.
          </p>

          <Eq label="Shapley value of hunk i">
            <msub>
              <mi>φ</mi>
              <mi>i</mi>
            </msub>
            <mo>=</mo>
            <munder>
              <mo>∑</mo>
              <mrow>
                <mi>S</mi>
                <mo>⊆</mo>
                <mi>N</mi>
                <mo>∖</mo>
                <mo>{"{"}</mo>
                <mi>i</mi>
                <mo>{"}"}</mo>
              </mrow>
            </munder>
            <mfrac>
              <mrow>
                <Abs><mi>S</mi></Abs>
                <mo>!</mo>
                <mo>(</mo>
                <Abs><mi>N</mi></Abs>
                <mo>−</mo>
                <Abs><mi>S</mi></Abs>
                <mo>−</mo>
                <mn>1</mn>
                <mo>)</mo>
                <mo>!</mo>
              </mrow>
              <mrow>
                <Abs><mi>N</mi></Abs>
                <mo>!</mo>
              </mrow>
            </mfrac>
            <mrow>
              <mo>[</mo>
              <mi>v</mi>
              <mo>(</mo>
              <mi>S</mi>
              <mo>∪</mo>
              <mo>{"{"}</mo>
              <mi>i</mi>
              <mo>{"}"}</mo>
              <mo>)</mo>
              <mo>−</mo>
              <mi>v</mi>
              <mo>(</mo>
              <mi>S</mi>
              <mo>)</mo>
              <mo>]</mo>
            </mrow>
          </Eq>

          <p className="cs-p">
            The sum is exact for up to 6 hunks (at most 2⁶ coalitions, each scored in its own worktree). Beyond that
            the kernel samples 24 seeded permutations. Failure to compute credit never undoes a promotion.
          </p>

          <h3 className="cs-h3">Running it</h3>
          <p className="cs-p">
            One command proves the pipeline without an API key: <code>python run_study2.py demo</code> drives a scripted
            proposer through the real sealed verifier, gate, audits and ledger. It is deterministic — selection pass
            rate 0.28 → 0.78, held-out flat at 0.38, cross-family alarm fires — so a change in that output is a change
            in the kernel. The suite is <code>python -m pytest -q tests</code>: 155 tests, including a fake
            OpenAI-compatible server, so no test touches a real API.
          </p>
        </Sec>

        {/* ------------------------------------------------------------ 06 limits */}
        <Sec id="limits" no="06" label="what it shows" calc="and what it doesn't"
          stone="06" tone="on-ink" title={<>The honest <em>version.</em></>}>
          <div className="cs-cols">
            <div className="cs-prose">
              <p>
                What this is: a kernel where any claim that the agent improved arrives with a pre-registered error
                rate attached, where the failure modes are blocked structurally rather than by prompt, and where
                four separate studies each disclosed a defect in their own measurement apparatus.
              </p>
              <p>
                What it is not: evidence of general self-improvement. The tasks are small, the live studies use one
                model and one provider, and the one result that looked like transfer rests on a single function.
                Those limits are listed in the repo, and they are listed here.
              </p>
            </div>
            <Table label="Tech stack" head={["Layer", "Detail"]} rows={STACK} />
          </div>

          <h3 className="cs-h3">Known limitations</h3>
          <ul className="cs-list">
            {LIMITS.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
        </Sec>

        {/* ------------------------------------------------------------ 07 references */}
        <Sec id="references" no="07" label="references" calc="bibliography, study 1"
          stone="07" tone="on-paper" title={<>What it's <em>built on.</em></>}>
          <p className="cs-p cs-quiet">
            References cited in the <a href={PAPER1} target="_blank" rel="noopener noreferrer" data-no-nav>Study 1 paper</a>.
            Numbers in the text above point here. External related-work links in the overview are listed inline, and
            the later papers carry their own bibliographies in <code>references.bib</code>.
          </p>
          <ol className="cs-refs">
            {REFS.map((r) => (
              <li key={r.n} id={`ref-${r.n}`} value={r.n}>
                <span>{r.text}</span>
                {r.arxiv && (
                  <>
                    {" "}
                    <a href={`https://arxiv.org/abs/${r.arxiv}`} target="_blank" rel="noopener noreferrer" data-no-nav>arXiv:{r.arxiv} ↗</a>
                  </>
                )}
              </li>
            ))}
          </ol>
        </Sec>
      </main>

      <footer className="cs-foot on-saffron">
        <div className="cs-wrap">
          <h2>Read the code, <em>or the papers.</em></h2>
          <div className="actions">
            <a className="btn pri" href={REPO} target="_blank" rel="noopener noreferrer" data-no-nav>github.com/…/si-loop ↗</a>
            <a className="btn" href={PAPER4} target="_blank" rel="noopener noreferrer" data-no-nav>Study 4 paper ↗</a>
            <a className="btn" href={`mailto:${SITE.email}`} data-no-nav>Discuss the design ↗</a>
          </div>
          <div className="cs-foot-row">
            <span>© 2026 · {SITE.name}</span>
            <a href="#overview" data-no-nav>↑ top</a>
            <a href="/" data-no-nav>abdelkabir.me</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
