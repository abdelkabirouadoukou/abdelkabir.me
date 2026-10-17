/** Collatz helpers shared by the page, the spine and the lab. */

export function orbit(start: number): number[] {
  const out = [start];
  let n = start;
  while (n !== 1 && out.length < 5000) {
    n = n % 2 === 0 ? n / 2 : 3 * n + 1;
    out.push(n);
  }
  return out;
}

/** The page IS this orbit. */
export const SEED = 27;
export const ORBIT = orbit(SEED); // 112 values, 111 steps
export const STEPS_TOTAL = ORBIT.length - 1;
export const PEAK = Math.max(...ORBIT);

export const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/**
 * Each section sits on one step of the orbit. `step` is the index in ORBIT,
 * `calc` is the arithmetic that got us here from the previous section.
 */
export const SECTIONS = [
  { id: "top", label: "start", step: 0, calc: "start at 27" },
  { id: "about", label: "about", step: 1, calc: "27 × 3 + 1 = 82" },
  { id: "building", label: "building", step: 2, calc: "82 ÷ 2 = 41" },
  { id: "projects", label: "projects", step: 3, calc: "41 × 3 + 1 = 124" },
  { id: "skills", label: "skills", step: 4, calc: "124 ÷ 2 = 62" },
  { id: "math", label: "math", step: 5, calc: "62 ÷ 2 = 31" },
  { id: "security", label: "security", step: 6, calc: "31 × 3 + 1 = 94" },
  { id: "end", label: "home", step: STEPS_TOTAL, calc: "…105 steps later = 1" },
] as const;

export const nOf = (id: (typeof SECTIONS)[number]["id"]) =>
  ORBIT[SECTIONS.find((s) => s.id === id)!.step];
