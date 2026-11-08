import type { ReactNode } from "react";
import { Logo } from "../../components/Logo";
import { Abs, BmC, Delta, Eq, I, V } from "../../components/Eq";
import { SITE } from "../../lib/site";

/**
 * Case study: SI-Loop. Server-rendered, no islands, no scroll choreography.
 * Every figure comes from the repo (kernel/, README, results/) or from running
 * `example_patch.py` / `kernel.orchestrator calibrate` on it.
 * Links use data-no-nav on purpose: the home page owns scroll (Choreo) and must be
 * loaded fresh, not swapped in by x's client router. In-page anchors rely on the
 * browser's native smooth scrolling (see `scroll-behavior` in globals.css).
 */

const REPO = `${SITE.github}/si-loop`;
const PAPER1 = `${REPO}/blob/study-1/paper.pdf`;
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

/* ------------------------------------------------------------------ data */
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
  ["accept", "L ≥ −ε, δ̂ > 0 and p_better ≥ τ", "Promoted by fast-forward merge to main."],
  ["accept (efficiency)", "non-inferior, δ̂ ≥ 0, and ≥ 5% smaller or ≥ 10% fewer tokens", "Cheaper at equal correctness."],
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
  ["Degrading patch (retries capped at 0)", "b = 0, c = 65, n = 200, δ̂ = −0.325, L = −0.379", "rejected: not non-inferior"],
];

const ARMS: string[][] = [
  ["full", "1.048 ± 0.190", "0.872 ± 0.148", "0.267"],
  ["no_ws", "1.038 ± 0.189", "0.872 ± 0.166", "0.275"],
  ["random_ws", "1.022 ± 0.162", "0.848 ± 0.154", "0.275"],
  ["no_judge", "0.962 ± 0.146", "0.755 ± 0.092", "1.000"],
];

const DELTAS: string[][] = [
  ["no_ws", "−0.010", "[−0.050, +0.026]", "[−0.060, +0.034]", "0.068", "no detectable difference"],
  ["random_ws", "−0.027", "[−0.062, +0.007]", "[−0.071, +0.015]", "0.061", "no detectable difference"],
  ["no_judge", "−0.086", "[−0.151, −0.025]", "[−0.168, −0.014]", "0.111", "full clearly worse"],
];

const PIVOT: string[][] = [
  ["The LCB judge accepted 26.7% of rounds, so about 73% were rejected, and the unjudged arm finished lower.", "Accept on non-inferiority (L ≥ −ε), so a patch that does not regress is not discarded for failing to prove a gain."],
  ["Improvement and safety were one test, with a hand-set threshold and no known error rate.", "Two separate conditions: non-inferiority for safety, posterior p_better ≥ τ for gain, with τ A/A-calibrated to a 5% target."],
  ["Seed-to-seed SD of 0.15–0.19 on final_hard; the smallest detectable difference was 0.06–0.11.", "Paired evaluation on identical problems (the gate raises otherwise) and a hard floor of 20 pairs, so noise is cancelled per problem."],
  ["no_judge accepted every round, so it measures the cost of over-rejection, not the value of having no gate.", "The gate stays; what changes is that its false-accept rate is measured before it is trusted."],
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

const LIMITS: ReactNode[] = [
  "The sealed Verifier and the LLM MetaAgent are abstract interfaces. The repo ships no problem families and no model client, and example_patch.py uses a simulated verifier. The demo exercises the kernel; it is not evidence of self-improvement.",
  "The AST scan is a first filter, not a security boundary. It has known blind spots and rejects some benign code. Untrusted runs need container mode.",
  <>Adaptive overfitting to the sealed distribution is still possible over many cycles <C n={[5]} />. The mitigation is a rarely-read audit split compared against the selection split.</>,
  "The A/A noise model is an assumption. The real run-to-run noise has to be estimated from repeated evaluations of an unchanged agent before a pre-registered run.",
  <>A learned or LLM-based judge, the main reward-hacking risk in the wider literature <C n={[15, 6]} />, is out of scope.</>,
];

const NAV = [
  ["overview", "overview"],
  ["architecture", "architecture"],
  ["highlights", "highlights"],
  ["stack", "stack"],
  ["results", "results"],
  ["references", "refs"],
] as const;

/* ------------------------------------------------------------------ building blocks */
function Sec({ id, no, title, children, tone = "" }: { id: string; no: string; title: ReactNode; children: ReactNode; tone?: string }) {
  return (
    <section className={`cs-sec ${tone}`} id={id} aria-labelledby={`${id}-h`}>
      <div className="cs-wrap">
        <p className="cs-no">{no}</p>
        <h2 className="cs-h2" id={`${id}-h`}>{title}</h2>
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
          <div className="cs-wrap">
            <p className="cs-kicker"><i aria-hidden="true" />Case study · Python · research kernel</p>
            <h1 className="cs-title">SI-<em>Loop</em></h1>
            <p className="cs-sub">
              A closed-loop kernel for recursive self-improvement in autonomous software-engineering agents.
              Every self-modification is isolated, statically validated, tested and either promoted or atomically
              rolled back, on the strength of a paired statistical gate with a measured false-accept rate.
            </p>
            <dl className="cs-meta">
              <div><dt>Role</dt><dd>Author: design, kernel, tests, paper</dd></div>
              <div><dt>Status</dt><dd>Kernel implemented and tested. Verifier and LLM meta-agent are interfaces.</dd></div>
              <div>
                <dt>Evidence</dt>
                <dd>
                  <a href={PAPER1} target="_blank" rel="noopener noreferrer" data-no-nav>Study 1 paper ↗</a> (frozen ablation), plus the Study 2 kernel demo.
                </dd>
              </div>
            </dl>
            <div className="actions">
              <a className="btn pri" href={REPO} target="_blank" rel="noopener noreferrer" data-no-nav>Read the code ↗</a>
              <a className="btn" href="#architecture" data-no-nav>Architecture ↓</a>
              <a className="btn" href={PAPER1} target="_blank" rel="noopener noreferrer" data-no-nav>Study 1 paper ↗</a>
            </div>
            <div className="cs-specs">
              {SPECS.map((s) => (
                <div key={s.l}><b>{s.n}</b><span>{s.l}</span></div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ 01 overview */}
        <Sec id="overview" no="01 / overview" title={<>The judge is part of <em>the system.</em></>}>
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
                measured by simulation, not assumed. The kernel enforcing all of this is immutable to the agent
                and digest-checked every cycle.
              </p>
              <p>
                The gate itself came from a measured failure. In <a href={PAPER1} target="_blank" rel="noopener noreferrer" data-no-nav>Study 1</a> (a
                toy few-shot regression), the lower-confidence-bound judge rejected about 73% of rounds, and the
                {" "}<code>no_judge</code> arm beat the full system on the hard split (final loss 0.962 vs 1.048, lower is
                better; <a href="#results" data-no-nav>Figures 1 and 2</a>). Study 2 replaces it with a paired non-inferiority test and an explicit A/A target.
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
              control layer around self-edits: a sealed judge, a calibrated gate and hunk-level credit. Its workspace
              component draws on global-workspace and blackboard ideas <C n={[1, 7, 10]} />. These are parallels in
              method; I make no claim of comparable results.
            </p>
          </aside>
        </Sec>

        {/* ------------------------------------------------------------ 02 architecture */}
        <Sec id="architecture" no="02 / architecture & trust boundaries" title={<>Three boundaries, <em>no honour system.</em></>} tone="alt">
          <h3 className="cs-h3">Zero-trust isolation</h3>
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

          <Eq label="Exact binomial tail (closed form)">
            {pBetter()}
            <mo>=</mo>
            <mfrac>
              <mn>1</mn>
              <msup>
                <mn>2</mn>
                <mrow>
                  <mi>b</mi>
                  <mo>+</mo>
                  <mi>c</mi>
                  <mo>+</mo>
                  <mn>1</mn>
                </mrow>
              </msup>
            </mfrac>
            <munderover>
              <mo>∑</mo>
              <mrow>
                <mi>k</mi>
                <mo>=</mo>
                <mn>0</mn>
              </mrow>
              <mi>b</mi>
            </munderover>
            <mrow>
              <mo>(</mo>
              <mtable>
                <mtr>
                  <mtd>
                    <mrow>
                      <mi>b</mi>
                      <mo>+</mo>
                      <mi>c</mi>
                      <mo>+</mo>
                      <mn>1</mn>
                    </mrow>
                  </mtd>
                </mtr>
                <mtr>
                  <mtd>
                    <mi>k</mi>
                  </mtd>
                </mtr>
              </mtable>
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
            non-inferior candidates. Novelty can never rescue a regression. Drawing fresh problems every cycle limits
            the adaptive reuse of a fixed evaluation set <C n={[5]} />.
          </p>

          <h4 className="cs-h4">A/A calibration</h4>
          <p className="cs-p">
            The false-accept rate of null patches (identical true pass rate, independent run-to-run noise) is
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

          <Eq label="Calibrated threshold">
            <msup>
              <mi>τ</mi>
              <mo>∗</mo>
            </msup>
            <mo>=</mo>
            <mi>min</mi>
            <mrow>
              <mo>{"{"}</mo>
              <mi>τ</mi>
              <mo>∈</mo>
              <mi>G</mi>
              <mo>:</mo>
              <mover accent="true">
                <mi>FAR</mi>
                <mo>^</mo>
              </mover>
              <mo>(</mo>
              <mi>τ</mi>
              <mo>)</mo>
              <mo>≤</mo>
              <mi>α</mi>
              <mo>{"}"}</mo>
            </mrow>
          </Eq>

          <p className="cs-p">
            With <code>n=200, p=0.5, noise=0.1</code> and <V><mi>α</mi><mo>=</mo><mn>0.05</mn></V>, the smallest threshold that
            meets the target is the default <V><mi>τ</mi><mo>=</mo><mn>0.95</mn></V>.
          </p>
          <Table label="A/A false-accept by threshold" head={["τ (p_improve_min)", "False-accept rate"]} rows={CALIB} />

          <h4 className="cs-h4">End-to-end demo</h4>
          <Table label="Demo scenarios" head={["Scenario", "Evidence", "Outcome"]} rows={DEMO} />
          <p className="cs-p cs-quiet">
            The demo runs against a simulated verifier with scripted proposals. It checks that the kernel promotes
            the good patch exactly once, blocks the hostile one statically, rejects the regression on the gate,
            leaves no <code>cand/*</code> branches behind and does not touch the kernel.
          </p>
        </Sec>

        {/* ------------------------------------------------------------ 03 highlights */}
        <Sec id="highlights" no="03 / engineering highlights" title={<>Small kernel, <em>strict seams.</em></>}>
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
                Each edit op is one hunk, and credit is the Shapley value <C n={[11]} /> over hunks, computed on a
                separate sealed credit split (see below). The agent only ever sees hunk-level values.
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

          <Eq label="Efficiency: credit sums to the total gain">
            <munder>
              <mo>∑</mo>
              <mrow>
                <mi>i</mi>
                <mo>∈</mo>
                <mi>N</mi>
              </mrow>
            </munder>
            <msub>
              <mi>φ</mi>
              <mi>i</mi>
            </msub>
            <mo>=</mo>
            <mi>v</mi>
            <mo>(</mo>
            <mi>N</mi>
            <mo>)</mo>
            <mo>−</mo>
            <mi>v</mi>
            <mo>(</mo>
            <mo>∅</mo>
            <mo>)</mo>
          </Eq>

          <p className="cs-p">
            The sum is exact for up to 6 hunks (at most 2⁶ coalitions, each scored in its own worktree). Beyond that
            the kernel samples 24 seeded permutations. Failure to compute credit never undoes a promotion.
          </p>
        </Sec>

        {/* ------------------------------------------------------------ 04 impact & stack */}
        <Sec id="stack" no="04 / impact & stack" title={<>What it <em>shows,</em> and what it doesn’t.</>} tone="alt">
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
            {LIMITS.map((l, i) => <li key={i}>{l}</li>)}
          </ul>

          <div className="actions" style={{ marginTop: 40 }}>
            <a className="btn pri" href={REPO} target="_blank" rel="noopener noreferrer" data-no-nav>github.com/…/si-loop ↗</a>
            <a className="btn" href={PAPER1} target="_blank" rel="noopener noreferrer" data-no-nav>Study 1 paper ↗</a>
            <a className="btn" href={`mailto:${SITE.email}`} data-no-nav>Discuss the design ↗</a>
          </div>
        </Sec>

        {/* ------------------------------------------------------------ 05 results */}
        <Sec id="results" no="05 / empirical results & ablation study" title={<>The data behind <em>the pivot.</em></>} tone="alt">
          <div className="cs-cols">
            <div className="cs-prose">
              <p>
                Study 1 is a pre-registered, frozen ablation on a toy few-shot regression task: four arms
                (<code>full</code>, <code>no_ws</code>, <code>random_ws</code>, <code>no_judge</code>), ten paired seeds, twelve
                rounds, query MSE as the metric (lower is better). The primary metric is the final loss on the hard split.
              </p>
              <p>
                The full system gated every round through the judge. The ablation removed it in one arm. Both figures
                below come straight from the repo’s <code>results/</code> directory.
              </p>
            </div>
            <div className="cs-prose">
              <p>
                <b>What the judge cost.</b> The <code>full</code> arm accepted 26.7% of proposed rounds, so roughly 73% were
                rejected. The <code>no_judge</code> arm accepted all of them and ended lowest on both evaluation sets.
              </p>
              <p>
                <b>What this does not show.</b> The toy task has no adversarial pressure, so this measures the price of
                an over-conservative gate, not whether a gate is needed.
              </p>
            </div>
          </div>

          <figure className="fig">
            <div className="fig-plate">
              <img src="/results/curves.png" width={2000} height={700} loading="lazy" decoding="async"
                alt="Two line charts of query MSE over twelve rounds for the arms full, no_ws, random_ws and no_judge, on a uniform-difficulty set and on the hard set. no_judge ends lowest on both; the hard-set curve is noisier with spikes near rounds 3 and 6; shaded bands overlap heavily." />
            </div>
            <figcaption>
              <b>Figure 1.</b> Study 1 multi-seed ablation curves: per-round query MSE (mean ± s.e. over 10 seeds) on the
              uniform-difficulty set (left) and the hard set (right). <code>no_judge</code> descends fastest and ends lowest on both,
              but its hard-set trajectory is the noisiest, and the bands overlap for most of the run.
            </figcaption>
          </figure>

          <figure className="fig">
            <div className="fig-plate fig-narrow">
              <img src="/results/final_hard.png" width={1200} height={700} loading="lazy" decoding="async"
                alt="Bar chart of final hard-split query MSE per arm with standard-error bars and one dot per seed: full 1.048, no_ws 1.038, random_ws 1.022, no_judge 0.962." />
            </div>
            <figcaption>
              <b>Figure 2.</b> Final hard-split performance per arm: bars are means with standard errors, dots are individual seeds
              (query MSE, lower is better). Per-seed spread is large relative to the gap between arms.
            </figcaption>
          </figure>

          <Table label="Per-arm results" head={["Arm", "final_hard", "final_all", "accept rate"]} rows={ARMS} />
          <p className="cs-p cs-quiet">Mean ± SD over seeds 1–10. Accept rate is the share of proposed rounds the judge let through.</p>

          <h3 className="cs-h3">Pre-registered decision rule</h3>
          <p className="cs-p">
            A component counts as supported only if the Bonferroni-adjusted interval for the paired difference
            <V><mi>Δ</mi><mo>=</mo><mi>arm</mi><mo>−</mo><mi>full</mi></V> excludes zero in its favour and the mean clears the
            smallest effect of interest. Negative values mean the arm beat <code>full</code>.
          </p>
          <Table
            label="Paired differences on final_hard"
            head={["Arm − full", "Mean Δ", "95% CI", "Bonferroni 98.33% CI", "MDE (80% power)", "Verdict"]}
            rows={DELTAS}
          />
          <p className="cs-p">
            Only the <code>no_judge</code> interval excludes zero, and it excludes it in the arm’s favour: the judge
            component hurt on this task. The other two verdicts mean “no detectable difference”, not “no effect”:
            their observed gaps (0.010 and 0.027) sit below the minimum detectable effect for ten seeds.
          </p>

          <h3 className="cs-h3">From this result to the Study 2 gate</h3>
          <p className="cs-p">
            The negative result is the specification for the redesign. Each row pairs a measured weakness with the
            part of the Study 2 gate that addresses it.
          </p>
          <Table label="Study 1 finding and Study 2 response" head={["Study 1 finding", "Study 2 response"]} rows={PIVOT} />
        </Sec>

        {/* ------------------------------------------------------------ 06 references */}
        <Sec id="references" no="06 / references" title={<>Bibliography, <em>Study 1.</em></>}>
          <p className="cs-p cs-quiet">
            References cited in the <a href={PAPER1} target="_blank" rel="noopener noreferrer" data-no-nav>Study 1 paper</a>.
            Numbers in the text above point here. External related-work links in the overview are listed inline.
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

      <footer className="cs-foot">
        <div className="cs-wrap">
          <span>© 2026 · {SITE.name}</span>
          <a href="#overview" data-no-nav>↑ top</a>
          <a href="/" data-no-nav>abdelkabir.me</a>
        </div>
      </footer>
    </div>
  );
}
