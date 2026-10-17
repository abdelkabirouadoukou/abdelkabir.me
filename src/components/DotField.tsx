import { useEffect, useRef } from "react";

/**
 * Interactive dot grid (React Bits "Dot Grid" idea, rewritten).
 * Dots are pushed away from the pointer by a spring and pick up the cobalt
 * accent as they move. Idle: a slow travelling wave so it never feels dead.
 */
const GAP = 30;

export function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(document.documentElement);
    const ink = css.getPropertyValue("--ink").trim() || "#12100d";
    const blue = css.getPropertyValue("--blue").trim() || "#2a39e6";

    let w = 0, h = 0, cols = 0, rows = 0, dpr = 1;
    let ox: Float32Array, oy: Float32Array, vx: Float32Array, vy: Float32Array;
    let px = -9999, py = -9999, pvx = 0, pvy = 0, lastX = 0, lastY = 0;
    let raf = 0, visible = true;

    const size = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width; h = r.height;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / GAP) + 1; rows = Math.ceil(h / GAP) + 1;
      const n = cols * rows;
      ox = new Float32Array(n); oy = new Float32Array(n); vx = new Float32Array(n); vy = new Float32Array(n);
      if (reduce) draw(0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i;
          const bx = i * GAP, by = j * GAP;
          let x = bx + ox[k], y = by + oy[k];

          if (!reduce) {
            const dx = x - px, dy = y - py;
            const d2 = dx * dx + dy * dy;
            const R = 150;
            if (d2 < R * R) {
              const d = Math.sqrt(d2) || 1, f = (1 - d / R) ** 2;
              vx[k] += (dx / d) * f * 5 + pvx * f * 0.06;
              vy[k] += (dy / d) * f * 5 + pvy * f * 0.06;
            }
            vx[k] += -ox[k] * 0.07; vy[k] += -oy[k] * 0.07;
            vx[k] *= 0.84; vy[k] *= 0.84;
            ox[k] += vx[k]; oy[k] += vy[k];
            x = bx + ox[k]; y = by + oy[k];
          }

          const wave = reduce ? 0.5 : 0.5 + 0.5 * Math.sin(t * 0.0009 + i * 0.35 + j * 0.22);
          const disp = Math.min(1, Math.hypot(ox[k], oy[k]) / 26);
          const r = 1.1 + wave * 0.9 + disp * 2.6;
          ctx.globalAlpha = 0.16 + wave * 0.12 + disp * 0.7;
          ctx.fillStyle = disp > 0.12 ? blue : ink;
          ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      pvx *= 0.8; pvy *= 0.8;
    };

    const loop = (t: number) => { if (visible) draw(t); raf = requestAnimationFrame(loop); };

    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      px = e.clientX - r.left; py = e.clientY - r.top;
      pvx = px - lastX; pvy = py - lastY; lastX = px; lastY = py;
    };
    const leave = () => { px = py = -9999; };

    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(cv);
    if (!reduce) {
      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerleave", leave);
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" />;
}
export default DotField;
