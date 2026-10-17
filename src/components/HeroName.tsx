import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Variable-font proximity (React Bits idea, rewritten from scratch).
 * Every letter's weight + width reacts to how close the pointer is.
 * A fit pass measures the WIDEST possible state and scales the font so the
 * name can never overflow, whatever font actually loaded.
 */
const REST = { w: 400, wd: 78 };
const MAX = { w: 800, wd: 100 };
const RADIUS = 240;

export function HeroName({ lines = ["Abdelkabir", "Ouadoukou"] }: { lines?: string[] }) {
  const root = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const h1 = root.current;
    if (!h1) return;
    const chars = Array.from(h1.querySelectorAll<HTMLElement>(".ch"));
    const rows = Array.from(h1.querySelectorAll<HTMLElement>(".ln"));
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

    const set = (el: HTMLElement, w: number, wd: number) =>
      (el.style.fontVariationSettings = `"wght" ${w.toFixed(0)}, "wdth" ${wd.toFixed(0)}`);

    /* ---- fit: size the font so the widest state fits the column ---- */
    let lastW = -1;
    const fit = (force = true) => {
      const avail = h1.clientWidth - 2;
      if (!force && Math.abs(avail - lastW) < 1) return; // height-only resize: ignore
      lastW = avail;
      h1.style.fontSize = ""; // back to the CSS clamp()
      chars.forEach((c) => set(c, MAX.w, MAX.wd));
      rows.forEach((r) => (r.style.width = "max-content"));
      const widest = Math.max(...rows.map((r) => r.scrollWidth));
      const current = parseFloat(getComputedStyle(h1).fontSize);
      if (widest > avail) h1.style.fontSize = `${(current * avail) / widest}px`;
      rows.forEach((r) => (r.style.width = ""));
      chars.forEach((c) => set(c, REST.w, REST.wd));
    };

    const ro = new ResizeObserver(() => fit(false));
    ro.observe(h1);
    document.fonts?.ready.then(() => fit(true));
    fit(true);

    if (reduce || !fine) {
      chars.forEach((c) => set(c, 640, 90));
      return () => ro.disconnect();
    }

    /* ---- proximity loop ---- */
    let px = -9999, py = -9999, raf = 0, active = false;
    const cur = chars.map(() => 0); // eased 0..1 per letter

    const tick = () => {
      let moving = false;
      chars.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
        const target = Math.max(0, 1 - d / RADIUS) ** 1.6;
        cur[i] += (target - cur[i]) * 0.14;
        if (Math.abs(target - cur[i]) > 0.004) moving = true;
        set(c, REST.w + (MAX.w - REST.w) * cur[i], REST.wd + (MAX.wd - REST.wd) * cur[i]);
      });
      raf = moving || active ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const move = (e: PointerEvent) => { px = e.clientX; py = e.clientY; active = true; kick(); };
    const leave = () => { px = py = -9999; active = false; kick(); };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  let c = 0;
  return (
    <h1 className="name" ref={root} aria-label={lines.join(" ")}>
      {lines.map((line) => (
        <span className="ln" key={line} aria-hidden="true">
          {Array.from(line).map((ch, i) => (
            <span className="ch" key={i} style={{ ["--c" as string]: c++ } as CSSProperties}>
              {ch}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
export default HeroName;
