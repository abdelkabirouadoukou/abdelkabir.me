/**
 * Hand-authored MathML (Core) for the case-study equations.
 *
 * Why MathML and not KaTeX: x.config.ts pins a strict CSP (script-src 'self'), so a CDN
 * script would be blocked, and MathML needs no JS, no fonts to download and renders
 * identically on server and client. Every string here is a static constant written in
 * this file; nothing user-supplied is ever interpolated, so injecting it is safe.
 */

const i = (s: string) => `<mi>${s}</mi>`;
const n = (s: string) => `<mn>${s}</mn>`;
const o = (s: string) => `<mo>${s}</mo>`;
const t = (s: string) => `<mtext>${s}</mtext>`;
const sub = (b: string, s: string) => `<msub>${b}${s}</msub>`;
const sup = (b: string, s: string) => `<msup>${b}${s}</msup>`;
const row = (...c: string[]) => `<mrow>${c.join("")}</mrow>`;
const frac = (a: string, b: string) => `<mfrac>${row(a)}${row(b)}</mfrac>`;
const paren = (...c: string[]) => row(o("("), ...c, o(")"));
const Pr = i("ℙ");
const math = (inner: string, block = false) =>
  `<math${block ? ' display="block"' : ""}>${inner}</math>`;

// symbols
const b = i("b"), c = i("c"), N = i("n");
const delta = i("δ"), eps = i("ε");
const bc = row(b, o("+"), c);
const bMinusC = row(b, o("−"), c);

/** (1)  δ̂ = (b − c) / n */
export const EQ_DELTA = math(row(i("δ̂"), o("="), frac(bMinusC, N)), true);

/** (2)  SE = (1/n) · √( b + c − (b − c)² / n )   — paired-proportion standard error */
export const EQ_SE = math(
  row(
    i("SE"), o("="), frac(n("1"), N), o("⁢"),
    `<msqrt>${row(b, o("+"), c, o("−"), frac(sup(paren(bMinusC), n("2")), N))}</msqrt>`,
  ),
  true,
);

/** (3)  L = δ̂ − z · SE,  z = z_{0.95} ≈ 1.645 */
export const EQ_LOWER = math(
  row(i("L"), o("="), i("δ̂"), o("−"), sub(i("z"), row(n("0.95"))), o("⁢"), i("SE"), o(","), o("  "),
    sub(i("z"), row(n("0.95"))), o("≈"), n("1.645")),
  true,
);

/** (4)  p_better = P(Beta(1+b, 1+c) > ½) = P(Bin(b+c+1, ½) ≤ b) = 2^{-(b+c+1)} Σ_{k=0}^{b} C(b+c+1, k) */
const binomN = row(b, o("+"), c, o("+"), n("1"));
export const EQ_PBETTER = math(
  row(
    sub(i("p"), t("better")), o("="),
    Pr, paren(i("Beta"), paren(n("1"), o("+"), b, o(","), n("1"), o("+"), c), o("&gt;"), frac(n("1"), n("2"))),
    o("="),
    Pr, paren(i("Bin"), paren(binomN, o(","), frac(n("1"), n("2"))), o("≤"), b),
    o("="),
    sup(n("2"), row(o("−"), paren(binomN))), o("⁢"),
    `<munderover>${o("∑")}${row(i("k"), o("="), n("0"))}${b}</munderover>`,
    row(o("("), `<mfrac linethickness="0">${row(binomN)}${row(i("k"))}</mfrac>`, o(")")),
  ),
  true,
);

/** (5)  Non-inferiority hypotheses */
export const EQ_HYP = math(
  row(
    sub(i("H"), n("0")), o(":"), i("Δ"), o("≤"), o("−"), eps,
    o(","), o("  "),
    sub(i("H"), n("1")), o(":"), i("Δ"), o("&gt;"), o("−"), eps,
    o(","), o("  "),
    t("reject "), sub(i("H"), n("0")), t(" when "), i("L"), o("≥"), o("−"), eps,
  ),
  true,
);

/** (6)  Accept rule */
export const EQ_ACCEPT = math(
  row(
    t("accept"), o("⟺"),
    paren(i("L"), o("≥"), o("−"), eps), o("∧"),
    paren(i("δ̂"), o("&gt;"), n("0")), o("∧"),
    paren(sub(i("p"), t("better")), o("≥"), sub(i("p"), t("min"))),
  ),
  true,
);

/** (7)  A/A calibration: smallest threshold whose Monte Carlo false-accept rate meets the target */
export const EQ_CALIB = math(
  row(
    sup(i("τ"), o("*")), o("="), `<munder>${t("min")}${row(i("τ"), o("∈"), i("G"))}</munder>`,
    row(o("{"), i("τ"), o(":"), o(" "), `<mover>${i("FAR")}${o("^")}</mover>`, paren(i("τ")), o("≤"), sub(i("α"), o("*")), o("}")),
    o(","), o("  "),
    sub(i("α"), o("*")), o("="), n("0.05"),
  ),
  true,
);

/** (8)  Shapley value of hunk i over coalitions S of hunks */
export const EQ_SHAPLEY = math(
  row(
    sub(i("φ"), i("i")), o("="),
    `<munder>${o("∑")}${row(i("S"), o("⊆"), i("N"), o("∖"), row(o("{"), i("i"), o("}")))}</munder>`,
    frac(
      row(o("|"), i("S"), o("|"), o("!"), o("⁢"), paren(o("|"), i("N"), o("|"), o("−"), o("|"), i("S"), o("|"), o("−"), n("1")), o("!")),
      row(o("|"), i("N"), o("|"), o("!")),
    ),
    paren(i("v"), paren(i("S"), o("∪"), row(o("{"), i("i"), o("}"))), o("−"), i("v"), paren(i("S"))),
  ),
  true,
);

/** (9)  Efficiency */
export const EQ_EFFICIENCY = math(
  row(
    `<munder>${o("∑")}${row(i("i"), o("∈"), i("N"))}</munder>`, sub(i("φ"), i("i")), o("="),
    i("v"), paren(i("N")), o("−"), i("v"), paren(o("∅")),
  ),
  true,
);

/* ---------- inline symbols for prose ---------- */
const inline = (s: string) => math(s);
export const IM = {
  b: inline(b),
  c: inline(c),
  n: inline(N),
  delta: inline(i("δ̂")),
  L: inline(i("L")),
  eps: inline(eps),
  eps_val: inline(row(eps, o("="), n("0.02"))),
  pmin: inline(sub(i("p"), t("min"))),
  pmin_val: inline(row(sub(i("p"), t("min")), o("="), n("0.95"))),
  setup: inline(row(i("n"), o("="), n("200"), o(","), o(" "), i("p"), o("="), n("0.5"), o(","), o(" "), i("σ"), o("="), n("0.1"))),
  alpha: inline(row(sub(i("α"), o("*")), o("="), n("0.05"))),
};
