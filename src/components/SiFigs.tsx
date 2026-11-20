/**
 * Figures for the SI-Loop case study. Inline SVG, server-rendered, no library and
 * no island: the page ships zero JS and the charts stay crisp at any zoom.
 *
 * Every number below is copied from the repo's own result files:
 *   results/study2/calibration.json      → Calibration
 *   results/study2/ablation_summary.json → AblationArms
 *   results/study3/seed_summary.json     → SeedGains
 *   study4/README.md (pilot FDR table)   → FdrLevels
 *
 * Colours come from two tokens (--viz-1 cobalt, --viz-2 deep saffron) that are
 * checked for colour-vision separation and contrast against the sand/paper
 * grounds; marks carry a <title> so every value is reachable without hover CSS.
 */

const fmt = (v: number, d = 3) => (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(d);

/* ------------------------------------------------------------------ 1 · gate calibration */
const TAUS = ["0.80", "0.90", "0.95", "0.975", "0.99"];
const SINGLE = [17.75, 8.8, 4.35, 2.15, 0.8];
const TWOSTAGE = [3.15, 1.6, 0.9, 0.4, 0.15];

export function Calibration() {
  const x0 = 58, x1 = 688, y0 = 28, y1 = 244, max = 18;
  const px = (i: number) => x0 + (i * (x1 - x0)) / (TAUS.length - 1);
  const py = (v: number) => y1 - (v / max) * (y1 - y0);
  const path = (d: number[]) => d.map((v, i) => `${i ? "L" : "M"}${px(i)} ${py(v)}`).join(" ");

  return (
    <div>
      <p className="viz-legend" aria-hidden="true">
        <span><i className="k1" />single stage</span>
        <span><i className="k2" />two stage (default)</span>
      </p>
      <svg viewBox="0 0 720 286" role="img"
        aria-label="Line chart: false-accept rate on null patches against the posterior threshold tau. Single stage falls from 17.75% at 0.80 to 0.8% at 0.99 and crosses the 5% target between 0.90 and 0.95. The two-stage gate starts at 3.15% and is already under the target at every threshold, reaching 0.9% at the default 0.95.">
        {[0, 5, 10, 15].map((g) => (
          <g key={g}>
            <line className="viz-grid" x1={x0} x2={x1} y1={py(g)} y2={py(g)} />
            <text className="viz-label" x={x0 - 10} y={py(g) + 4} textAnchor="end">{g}%</text>
          </g>
        ))}
        <line className="viz-rule" x1={x0} x2={x1} y1={py(5)} y2={py(5)} />
        <text className="viz-label" x={x1} y={py(5) - 9} textAnchor="end">5% target</text>

        <path className="viz-line-1" d={path(SINGLE)} />
        <path className="viz-line-2" d={path(TWOSTAGE)} />

        {SINGLE.map((v, i) => (
          <circle key={i} className="viz-1" cx={px(i)} cy={py(v)} r={5}>
            <title>{`single stage, τ = ${TAUS[i]}: ${v}% false accept`}</title>
          </circle>
        ))}
        {TWOSTAGE.map((v, i) => (
          <rect key={i} className="viz-2" x={px(i) - 4.5} y={py(v) - 4.5} width={9} height={9} rx={2}>
            <title>{`two stage, τ = ${TAUS[i]}: ${v}% false accept`}</title>
          </rect>
        ))}

        {/* the default threshold is the story: label that pair only */}
        <text className="viz-value" x={px(2)} y={py(SINGLE[2]) - 14} textAnchor="middle">4.35%</text>
        <text className="viz-value" x={px(2)} y={py(TWOSTAGE[2]) + 22} textAnchor="middle">0.9%</text>

        <line className="viz-axis" x1={x0} x2={x1} y1={y1} y2={y1} />
        {TAUS.map((t, i) => (
          <text key={t} className="viz-label" x={px(i)} y={y1 + 22} textAnchor="middle">{t}</text>
        ))}
        <text className="viz-title" x={x0} y={276}>τ · p_improve_min</text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ 2 · synthetic ablation arms */
const ARM_ROWS: [string, number, string][] = [
  ["A0", 0.178, "frozen improver, solver only"],
  ["A1", 0.302, "full recursive loop"],
  ["A2", -0.017, "random-patch control"],
  ["A3", 0.242, "compute-matched best-of-N"],
];

export function AblationArms() {
  const x0 = 58, x1 = 688, y0 = 26, y1 = 212, lo = -0.06, hi = 0.34;
  const py = (v: number) => y1 - ((v - lo) / (hi - lo)) * (y1 - y0);
  const zero = py(0);
  const band = (x1 - x0) / ARM_ROWS.length;
  const bw = Math.min(96, band * 0.5);

  return (
    <svg viewBox="0 0 720 268" role="img"
      aria-label="Bar chart of mean selection gain per pre-registered arm over eight seeds: A0 frozen improver plus 0.178, A1 full recursive loop plus 0.302, A2 random-patch control minus 0.017, A3 compute-matched best-of-N plus 0.242.">
      {[0, 0.1, 0.2, 0.3].map((g) => (
        <g key={g}>
          <line className="viz-grid" x1={x0} x2={x1} y1={py(g)} y2={py(g)} />
          <text className="viz-label" x={x0 - 10} y={py(g) + 4} textAnchor="end">{g.toFixed(1)}</text>
        </g>
      ))}
      {ARM_ROWS.map(([arm, v, desc], i) => {
        const cx = x0 + band * i + band / 2;
        const top = v >= 0 ? py(v) : zero;
        const h = Math.abs(py(v) - zero);
        return (
          <g key={arm}>
            <rect className="viz-1" x={cx - bw / 2} y={top} width={bw} height={Math.max(h, 2)} rx={4}>
              <title>{`${arm} (${desc}): mean selection gain ${fmt(v)}`}</title>
            </rect>
            <text className="viz-value" x={cx} y={v >= 0 ? top - 11 : top + h + 20} textAnchor="middle">{fmt(v)}</text>
            <text className="viz-label" x={cx} y={y1 + 24} textAnchor="middle">{arm}</text>
          </g>
        );
      })}
      <line className="viz-axis" x1={x0} x2={x1} y1={zero} y2={zero} />
      <text className="viz-title" x={x0} y={258}>mean final selection gain · 8 paired seeds</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ 3 · Study 3 replicate gains */
const SEEDS: [string, number, number][] = [
  ["seed 4", 0.225, 0], ["seed 5", 0.35, 0], ["seed 6", 0.083, 0],
  ["seed 7", 0.133, 0], ["seed 8", 0.35, 0], ["seed 9", 0.325, 0.384],
];

export function SeedGains() {
  const x0 = 58, x1 = 688, y0 = 30, y1 = 220, max = 0.4;
  const py = (v: number) => y1 - (v / max) * (y1 - y0);
  const band = (x1 - x0) / SEEDS.length;
  const bw = Math.min(34, band * 0.3);

  return (
    <div>
      <p className="viz-legend" aria-hidden="true">
        <span><i className="k1" />selection families</span>
        <span><i className="k2" />held-out family</span>
      </p>
      <svg viewBox="0 0 720 282" role="img"
        aria-label="Grouped bar chart of the six pre-registered Study 3 replicates. Selection-family pass-rate gain: seed 4 plus 0.225, seed 5 plus 0.350, seed 6 plus 0.083, seed 7 plus 0.133, seed 8 plus 0.350, seed 9 plus 0.325. Held-out gain is zero in five of the six replicates and plus 0.384 in seed 9.">
        {[0, 0.1, 0.2, 0.3, 0.4].map((g) => (
          <g key={g}>
            <line className="viz-grid" x1={x0} x2={x1} y1={py(g)} y2={py(g)} />
            <text className="viz-label" x={x0 - 10} y={py(g) + 4} textAnchor="end">{g.toFixed(1)}</text>
          </g>
        ))}
        {SEEDS.map(([name, sel, held], i) => {
          const cx = x0 + band * i + band / 2;
          const lx = cx - bw / 2 - 2, rx = cx + 2;
          return (
            <g key={name}>
              <rect className="viz-1" x={lx} y={py(sel)} width={bw} height={y1 - py(sel)} rx={4}>
                <title>{`${name}: selection gain ${fmt(sel)}`}</title>
              </rect>
              <text className="viz-value" x={lx + bw / 2} y={py(sel) - 10} textAnchor="middle">{sel.toFixed(2)}</text>
              {held > 0 ? (
                <>
                  <rect className="viz-2" x={rx} y={py(held)} width={bw} height={y1 - py(held)} rx={4}>
                    <title>{`${name}: held-out gain ${fmt(held)}`}</title>
                  </rect>
                  <text className="viz-value" x={rx + bw / 2} y={py(held) - 10} textAnchor="middle">{held.toFixed(2)}</text>
                </>
              ) : (
                /* an empty slot would read as missing data: draw the zero explicitly */
                <>
                  <rect className="viz-2" x={rx} y={y1 - 2} width={bw} height={2} rx={1}>
                    <title>{`${name}: held-out gain 0.000`}</title>
                  </rect>
                  <text className="viz-label" x={rx + bw / 2} y={y1 - 8} textAnchor="middle">0</text>
                </>
              )}
              <text className="viz-label" x={cx} y={y1 + 24} textAnchor="middle">{name.replace("seed ", "s")}</text>
            </g>
          );
        })}
        <line className="viz-axis" x1={x0} x2={x1} y1={y1} y2={y1} />
        <text className="viz-title" x={x0} y={272}>pass-rate gain over the frozen cycle-0 anchor</text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ 4 · Study 4 e-LOND budget */
const FDR: [number, number, number][] = [
  /* test, p_better, required level */
  [1, 0.9688, 0.0304], [2, 0.9688, 0.0304], [3, 0.9922, 0.0076], [4, 0.9961, 0.0034],
  [5, 0.9688, 0.0012], [6, 0.9922, 0.00084], [7, 0.9999, 0.00062],
];

export function FdrLevels() {
  const x0 = 72, x1 = 640, y0 = 34, y1 = 212;
  const lg = (v: number) => Math.log10(v);
  const hi = lg(0.1), lo = lg(0.0004);
  const py = (v: number) => y0 + ((hi - lg(v)) / (hi - lo)) * (y1 - y0);
  const px = (i: number) => x0 + (i * (x1 - x0)) / (FDR.length - 1);
  const path = FDR.map(([, , l], i) => `${i ? "L" : "M"}${px(i)} ${py(l)}`).join(" ");

  return (
    <svg viewBox="0 0 720 272" role="img"
      aria-label="Line chart on a logarithmic scale of the level the enforced e-LOND monitor required at each of the seven correctness-path tests in the Study 4 pilot: 0.0304, 0.0304, 0.0076, 0.0034, 0.0012, 0.00084 and 0.00062. No test cleared its level, so none of the seven was accepted.">
      {[0.1, 0.01, 0.001].map((g) => (
        <g key={g}>
          <line className="viz-grid" x1={x0} x2={x1} y1={py(g)} y2={py(g)} />
          <text className="viz-label" x={x0 - 10} y={py(g) + 4} textAnchor="end">{g}</text>
        </g>
      ))}
      <path className="viz-line-1" d={path} />
      {FDR.map(([t, p, l], i) => (
        <g key={t}>
          <circle className="viz-1" cx={px(i)} cy={py(l)} r={5}>
            <title>{`test ${t}: p_better ${p}, required level ${l}, not a discovery`}</title>
          </circle>
          <text className="viz-label" x={px(i)} y={y1 + 22} textAnchor="middle">{t}</text>
        </g>
      ))}
      <text className="viz-value" x={px(0) + 12} y={py(0.0304) - 12}>0.0304</text>
      <text className="viz-value" x={px(6)} y={py(0.00062) + 24} textAnchor="middle">0.00062</text>
      <g>
        <line className="viz-rule" x1={px(6)} x2={px(6) + 46} y1={py(0.00062)} y2={py(0.0024)} />
        <text className="viz-value" x={px(6) + 52} y={py(0.0024) - 4}>p_better = 0.9999</text>
        <text className="viz-label" x={px(6) + 52} y={py(0.0024) + 13}>still rejected</text>
      </g>
      <line className="viz-axis" x1={x0} x2={x1} y1={y1} y2={y1} />
      <text className="viz-title" x={x0} y={262}>correctness-path test · required level (log)</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ 5 · trust boundaries */
export function Architecture() {
  return (
    <div className="arch">
      <svg viewBox="0 0 980 420" role="img"
        aria-label="Diagram of the three trust zones. An immutable kernel, hash-checked every cycle, wraps the whole loop. The agent worktree is the only writable subtree and sends a JSON patch proposal to the kernel; it never writes directly. The sealed verifier holds the hidden tests, the oracles and the held-out family, runs candidate code in a sandbox, and returns aggregate results only. Feedback to the agent is a verdict and an error type, never counts or per-family numbers.">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--sand)" />
          </marker>
        </defs>

        {/* kernel frame */}
        <rect className="zone-kernel" x="6" y="6" width="968" height="408" rx="18" />
        <text className="zk" x="28" y="36">Immutable kernel · kernel/*.py · sha-256 checked every cycle</text>
        <text className="zs" x="28" y="56">orchestrator · two-stage judge · gate · anchor · ledger · breakers</text>

        {/* agent worktree */}
        <rect className="zone" x="28" y="86" width="372" height="196" rx="14" />
        <text className="zt" x="52" y="118">Agent worktree</text>
        <text className="zs" x="52" y="140">agent/** — the only writable subtree</text>
        <text className="zs" x="52" y="160">lib.py · tests/ · meta/policy.py</text>
        <text className="zs" x="52" y="190">The meta-agent reads it and</text>
        <text className="zs" x="52" y="208">returns JSON. It never writes:</text>
        <text className="zs" x="52" y="226">a dirty worktree is a rejection.</text>
        <text className="zk" x="52" y="256">git worktree · atomic rollback</text>

        {/* sealed verifier */}
        <rect className="zone-sealed" x="580" y="86" width="372" height="196" rx="14" />
        <text className="zt" x="604" y="118">Sealed verifier</text>
        <text className="zs" x="604" y="140">hidden pytest · oracles · HMAC ids</text>
        <text className="zs" x="604" y="160">held-out family, never in selection</text>
        <rect className="zone" x="604" y="180" width="324" height="78" rx="10" />
        <text className="zs" x="624" y="204">Sandbox process</text>
        <text className="zs" x="624" y="224">candidate code · rlimits · no network</text>
        <text className="zs" x="624" y="244">tripwires · per-call timeout</text>

        {/* flows */}
        <path className="flow" d="M400 150 L576 150" />
        <text className="fl" x="488" y="138" textAnchor="middle">inputs only</text>
        <path className="flow" d="M576 232 L404 232" />
        <text className="fl" x="488" y="222" textAnchor="middle">EvalResult: aggregates, flags</text>

        {/* patch path */}
        <rect className="zone" x="280" y="312" width="420" height="78" rx="14" />
        <text className="zt" x="304" y="340">PatchProposal (JSON, strict parse)</text>
        <text className="zs" x="304" y="362">7 layers: parse · path policy · AST scan · test ratchet</text>
        <text className="zs" x="304" y="380">· atomic apply · diff audit · sandbox</text>
        <path className="flow" d="M214 286 L214 351 L276 351" />
        <path className="flow-no" d="M704 351 L766 351 L766 286" />
        <text className="fl" x="716" y="338">verdict + error type only</text>

        <text className="zk" x="28" y="404">The agent never sees: hidden tests · oracles · pass counts · per-family numbers · audits · held-out results</text>
      </svg>
    </div>
  );
}
