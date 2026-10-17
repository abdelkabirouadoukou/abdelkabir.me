import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { fmt, orbit } from "../lib/collatz";

/**
 * Collatz lab. Throw any start number at the rule and watch the hailstone
 * rise and fall (log scale). Canvas, no chart library.
 */
const PRESETS = [27, 97, 871, 6171, 837799];
const MAX = 999_999;

const compact = (v: number) => (v >= 1e9 ? `${v / 1e9}B` : v >= 1e6 ? `${v / 1e6}M` : v >= 1e3 ? `${v / 1e3}k` : String(v));

export function CollatzLab() {
  const [n, setN] = useState(27);
  const [text, setText] = useState("27");
  const [msg, setMsg] = useState("");
  const [run, setRun] = useState(0);
  const cv = useRef<HTMLCanvasElement>(null);

  const path = useMemo(() => orbit(n), [n]);
  const steps = path.length - 1;
  const peak = useMemo(() => Math.max(...path), [path]);
  const ups = useMemo(() => path.slice(0, -1).filter((v) => v % 2 === 1).length, [path]);

  const go = (v: number) => { setN(v); setText(String(v)); setMsg(""); setRun((r) => r + 1); };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = Number(text.replace(/[,\s]/g, ""));
    if (!Number.isInteger(v) || v < 1 || v > MAX) return setMsg(`Pick a whole number from 1 to ${fmt(MAX)}.`);
    go(v);
  };

  useEffect(() => {
    const canvas = cv.current!;
    const g = canvas.getContext("2d")!;
    const css = getComputedStyle(document.documentElement);
    const ink = css.getPropertyValue("--ink").trim() || "#12100d";
    const blue = css.getPropertyValue("--blue").trim() || "#2a39e6";
    const saffron = css.getPropertyValue("--saffron").trim() || "#ffb300";
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0, t0 = 0, prog = reduce ? 1 : 0, w = 0, h = 0;

    const draw = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      if (r.width !== w || r.height !== h) { w = r.width; h = r.height; canvas.width = w * dpr; canvas.height = h * dpr; }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);

      const L = 52, R = 22, T = 26, B = 30;
      const yMax = Math.max(1, Math.log10(peak) * 1.06);
      const X = (i: number) => L + (i / Math.max(1, steps)) * (w - L - R);
      const Yv = (v: number) => h - B - (Math.log10(v) / yMax) * (h - T - B);

      // grid: decades
      g.font = "500 10px ui-monospace, Menlo, monospace"; g.textBaseline = "middle"; g.textAlign = "right";
      for (let d = 0; d <= Math.floor(yMax); d++) {
        const y = Yv(10 ** d);
        g.strokeStyle = ink; g.globalAlpha = 0.14; g.lineWidth = 1;
        g.beginPath(); g.moveTo(L, y); g.lineTo(w - R, y); g.stroke();
        g.globalAlpha = 0.7; g.fillStyle = ink; g.fillText(compact(10 ** d), L - 8, y);
      }
      g.globalAlpha = 1;

      const head = prog * steps, hi = Math.floor(head);
      const pts: Array<[number, number]> = [];
      for (let i = 0; i <= hi; i++) pts.push([X(i), Yv(path[i])]);
      if (hi < steps) { const f = head - hi; pts.push([X(head), Yv(Math.exp(Math.log(path[hi]) + (Math.log(path[hi + 1]) - Math.log(path[hi])) * f))]); }

      // area + line
      g.beginPath(); g.moveTo(pts[0][0], h - B);
      pts.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(pts[pts.length - 1][0], h - B); g.closePath();
      g.globalAlpha = 0.12; g.fillStyle = blue; g.fill(); g.globalAlpha = 1;
      g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
      g.strokeStyle = blue; g.lineWidth = 2.4; g.lineJoin = "round"; g.stroke();

      // peak marker once passed
      const pk = path.indexOf(peak);
      if (head >= pk) {
        const px = X(pk), py = Yv(peak);
        g.strokeStyle = ink; g.globalAlpha = 0.4; g.setLineDash([3, 4]);
        g.beginPath(); g.moveTo(px, py); g.lineTo(px, h - B); g.stroke(); g.setLineDash([]); g.globalAlpha = 1;
        g.fillStyle = saffron; g.strokeStyle = ink; g.lineWidth = 1.6;
        g.beginPath(); g.arc(px, py, 6, 0, 6.2832); g.fill(); g.stroke();
        g.fillStyle = ink; g.textAlign = px > w * 0.7 ? "right" : "left";
        g.fillText(`peak ${fmt(peak)}`, px + (px > w * 0.7 ? -12 : 12), py - 4);
      }
      // head
      const [hx, hy] = pts[pts.length - 1];
      g.fillStyle = ink; g.beginPath(); g.arc(hx, hy, 5, 0, 6.2832); g.fill();
      if (prog >= 1) { g.textAlign = "right"; g.fillStyle = ink; g.fillText("1", hx - 10, hy - 10); }
      // x axis
      g.textAlign = "center"; g.globalAlpha = 0.7; g.fillStyle = ink;
      g.fillText("0", L, h - 10); g.fillText(`${steps} steps`, w - R - 24, h - 10); g.globalAlpha = 1;
    };

    const frame = (now: number) => {
      if (!t0) t0 = now;
      const dur = Math.min(2600, 900 + steps * 5);
      const k = Math.min(1, (now - t0) / dur);
      prog = 1 - (1 - k) ** 3;
      draw();
      if (k < 1) raf = requestAnimationFrame(frame);
    };
    if (reduce) draw(); else raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(() => { w = 0; draw(); });
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [path, peak, steps, run]);

  return (
    <div className="lab">
      <div className="lab-top">
        <p>
          Even <b>n</b> becomes <b>n ÷ 2</b>. Odd <b>n</b> becomes <b>3n + 1</b>. The conjecture says every positive
          start eventually reaches 1. Nobody has proved it. Pick a number and watch it fall (log scale).
        </p>
        <form className="lab-form" onSubmit={submit} noValidate>
          <label htmlFor="lab-n">start n</label>
          <input id="lab-n" inputMode="numeric" autoComplete="off" value={text} onChange={(e) => setText(e.target.value)} aria-describedby="lab-msg" />
          <button className="btn pri" type="submit">Throw it</button>
          <button className="btn" type="button" onClick={() => go(2 + Math.floor(Math.random() * 99_998))}>Surprise me</button>
          <div className="presets" role="group" aria-label="Example starts">
            {PRESETS.map((p) => (
              <button type="button" key={p} aria-pressed={p === n} onClick={() => go(p)}>{fmt(p)}</button>
            ))}
          </div>
        </form>
      </div>
      <p className="lab-msg" id="lab-msg" role="status" aria-live="polite">{msg}</p>
      <div className="lab-read">
        <div><b>{fmt(n)}</b><span>start</span></div>
        <div><b>{steps}</b><span>steps to 1</span></div>
        <div><b>{fmt(peak)}</b><span>highest value</span></div>
        <div><b>{ups}</b><span>↑ odd (3n+1)</span></div>
        <div><b>{steps - ups}</b><span>↓ even (÷2)</span></div>
      </div>
      <div className="lab-plot"><canvas ref={cv} role="img" aria-label={`Collatz orbit of ${n}: ${steps} steps, peak ${peak}`} /></div>
    </div>
  );
}
export default CollatzLab;
