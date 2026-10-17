import { useEffect, useRef } from "react";

/**
 * Project index. Every row is a real link with its full text (works on touch,
 * keyboard and with JS off). On hover-capable devices a floating "specimen"
 * follows the pointer: a tiny generative drawing that is different for each
 * project — instead of a screenshot you'd have to host.
 */

type Project = { name: string; href: string; badge?: string; desc: string; tags: string; lang: string };

const PROJECTS: Project[] = [
  { name: "xymathprepa.com", href: "https://www.xymathprepa.com/", badge: "client project", lang: "TypeScript",
    desc: "Online math-training platform for CPGE students I built for a client: video lessons, corrected exercises, and progress tracking that syncs with WhatsApp.",
    tags: "Next.js · Tailwind CSS · Supabase · shadcn/ui" },
  { name: "x", href: "https://github.com/abdelkabirouadoukou/x", badge: "pinned", lang: "TypeScript",
    desc: "A full-stack React framework. Astro-style static-first frontend with islands, Next.js-style backend (file-based API/server routes, SSR), running on Bun. Bun.serve() and Bun's own bundler are the dev server and build tool, no separate bundler stack.",
    tags: "#astro · #build-tool · #bun · #cli" },
  { name: "LiveGaffer", href: "https://github.com/abdelkabirouadoukou/LiveGaffer", badge: "pinned", lang: "Python",
    desc: "Real-time AI soccer tactical analyst computing match momentum, team shapes, and live LLM insights.",
    tags: "#ai-analyst · #data-science · #fastapi · #football-analytics" },
  { name: "NanoBrainAI", href: "https://github.com/abdelkabirouadoukou/NanoBrainAI", badge: "pinned", lang: "Python",
    desc: "A lightweight neural network built from scratch in Python. No libraries, just pure math (linear algebra & calculus).",
    tags: "#ai · #machine-learning · #neural · #neural-network" },
  { name: "CVE-2026-31431 Analysis and Fix", href: "https://github.com/abdelkabirouadoukou/CVE-2026-31431-Analysis-and-Fix", lang: "write-up",
    desc: "Technical deep dive, root cause analysis, and LKML patch workflow for CVE-2026-31431 (Linux kernel local privilege escalation in algif_aead).",
    tags: "#crypto-api-pci · #cve-2026-31431 · #kernel-exploitation · #linux-kernel" },
  { name: "nth-roots-visualizer", href: "https://github.com/abdelkabirouadoukou/nth-roots-visualizer", lang: "TypeScript",
    desc: "Visualize n-th roots of unity and modular multiplication patterns on the unit circle. Built with Next.js & TypeScript. Math meets art!",
    tags: "#katex · #mathematics · #nextjs · #nth-root" },
  { name: "20-beginner-py-projects", href: "https://github.com/abdelkabirouadoukou/20-beginner-py-projects", lang: "Python",
    desc: "A collection of 20 beginner-friendly Python projects to learn programming through hands-on practice. From basic calculators to web scrapers, perfect for new developers.",
    tags: "#beginner-friendly · #coding-bootcamp · #coding-practice · #educational" },
];

/* ---------- specimens ---------- */
type Col = { ink: string; blue: string; saffron: string; paper: string };
type Draw = (g: CanvasRenderingContext2D, w: number, h: number, t: number, c: Col) => void;
const TAU = Math.PI * 2;
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const rr = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
};

const SPECIMENS: Draw[] = [
  /* 0 · lessons with synced progress */
  (g, w, h, t, c) => {
    for (let i = 0; i < 5; i++) {
      const y = 40 + i * 38, bw = w - 96, p = 0.25 + 0.75 * ((Math.sin(t / 900 + i * 1.7) + 1) / 2);
      g.globalAlpha = 0.14; g.fillStyle = c.ink; rr(g, 58, y, bw, 16, 8); g.fill();
      g.globalAlpha = 1; g.fillStyle = c.blue; rr(g, 58, y, bw * p, 16, 8); g.fill();
      g.fillStyle = c.ink; g.beginPath(); g.moveTo(26, y + 1); g.lineTo(26, y + 15); g.lineTo(40, y + 8); g.fill();
    }
    g.fillStyle = c.saffron; g.beginPath(); g.arc(w - 26, 26, 6 + 3 * Math.sin(t / 300), 0, TAU); g.fill();
  },
  /* 1 · islands hydrating in a static sea */
  (g, w, h, t, c) => {
    const cols = 17, rows = 10, gx = w / (cols + 1), gy = (h - 20) / (rows + 1);
    const hubs = [[4, 3], [12, 6], [8, 8]];
    const R = 2.5 * (0.65 + 0.35 * Math.sin(t / 600));
    for (let j = 1; j <= rows; j++) for (let i = 1; i <= cols; i++) {
      const d = Math.min(...hubs.map(([a, b]) => Math.hypot(i - a, j - b)));
      const on = d < R;
      g.globalAlpha = on ? 1 : 0.3; g.fillStyle = on ? c.blue : c.ink;
      g.beginPath(); g.arc(i * gx, 14 + j * gy, on ? 4.2 : 1.7, 0, TAU); g.fill();
    }
    g.globalAlpha = 1;
  },
  /* 2 · pitch + momentum */
  (g, w, h, t, c) => {
    g.strokeStyle = c.ink; g.globalAlpha = 0.55; g.lineWidth = 1.4;
    const px = 14, py = 30, pw = w - 28, ph = h - 96;
    g.strokeRect(px, py, pw, ph);
    g.beginPath(); g.moveTo(px + pw / 2, py); g.lineTo(px + pw / 2, py + ph); g.stroke();
    g.beginPath(); g.arc(px + pw / 2, py + ph / 2, 22, 0, TAU); g.stroke();
    g.strokeRect(px, py + ph / 2 - 30, 34, 60); g.strokeRect(px + pw - 34, py + ph / 2 - 30, 34, 60);
    g.globalAlpha = 1;
    for (let i = 0; i < 10; i++) {
      const bx = px + 20 + hash(i) * (pw - 40), by = py + 12 + hash(i + 9) * (ph - 24);
      g.fillStyle = i < 5 ? c.blue : c.ink;
      g.beginPath(); g.arc(bx + Math.sin(t / 700 + i) * 7, by + Math.cos(t / 800 + i * 2) * 5, 4.5, 0, TAU); g.fill();
    }
    g.fillStyle = c.saffron; g.strokeStyle = c.ink; g.lineWidth = 1.5;
    g.beginPath(); g.arc(px + pw / 2 + Math.sin(t / 500) * pw * 0.32, py + ph / 2 + Math.sin(t / 330) * ph * 0.3, 5.5, 0, TAU); g.fill(); g.stroke();
    g.strokeStyle = c.blue; g.lineWidth = 2.2; g.beginPath();
    for (let x = 0; x <= w - 28; x += 4) {
      const y = h - 34 + Math.sin(x / 26 + t / 600) * 12 + Math.sin(x / 9 - t / 400) * 4;
      x ? g.lineTo(14 + x, y) : g.moveTo(14 + x, y);
    }
    g.stroke();
  },
  /* 3 · tiny neural net, signal travelling */
  (g, w, h, t, c) => {
    const L = [3, 5, 5, 2];
    const pts = L.map((n, li) => Array.from({ length: n }, (_, i) => [w * (0.13 + 0.74 * (li / 3)), h * (0.5 + (i - (n - 1) / 2) * 0.16)]));
    g.strokeStyle = c.ink; g.lineWidth = 1; g.globalAlpha = 0.16;
    for (let l = 0; l < 3; l++) for (const a of pts[l]) for (const b of pts[l + 1]) { g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    pts.forEach((layer, li) => {
      const glow = (Math.sin(t / 420 - li * 1.3) + 1) / 2;
      layer.forEach(([x, y], i) => {
        g.globalAlpha = 1; g.fillStyle = c.ink; g.beginPath(); g.arc(x, y, 8, 0, TAU); g.fill();
        g.globalAlpha = 0.25 + glow * 0.75; g.fillStyle = li === 3 ? c.saffron : c.blue; g.beginPath(); g.arc(x, y, 5.2 + glow * 2 + (i % 2) * 0, 0, TAU); g.fill();
      });
    });
    g.globalAlpha = 1;
  },
  /* 4 · hex dump with one flipped byte */
  (g, w, h, t, c) => {
    g.font = "500 12px ui-monospace, Menlo, monospace"; g.textBaseline = "middle";
    const rows = 8, cols = 8, cw = (w - 32) / cols, ch = (h - 36) / rows;
    const flip = { r: 4, c: 3 };
    for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
      const v = Math.floor(hash(r * 9 + k) * 255), isF = r === flip.r && k === flip.c;
      const x = 16 + k * cw, y = 28 + r * ch;
      if (isF) { g.fillStyle = Math.floor(t / 450) % 2 ? c.saffron : c.ink; g.fillRect(x - 3, y - ch / 2 + 2, cw - 2, ch - 3); }
      g.fillStyle = isF && Math.floor(t / 450) % 2 === 0 ? c.paper : c.ink;
      g.globalAlpha = isF ? 1 : 0.62;
      g.fillText((isF ? v ^ 0x80 : v).toString(16).padStart(2, "0"), x, y);
    }
    g.globalAlpha = 0.16; g.fillStyle = c.blue;
    g.fillRect(0, ((t / 12) % (h + 40)) - 20, w, 20);
    g.globalAlpha = 1;
  },
  /* 5 · times table on the unit circle: k → m·k mod n */
  (g, w, h, t, c) => {
    const n = 72, m = 2 + (Math.floor(t / 2200) % 9), cx = w / 2, cy = h / 2 + 4, R = Math.min(w, h) * 0.41;
    const at = (k: number) => [cx + Math.cos((k / n) * TAU - Math.PI / 2) * R, cy + Math.sin((k / n) * TAU - Math.PI / 2) * R];
    g.strokeStyle = c.blue; g.lineWidth = 1; g.globalAlpha = 0.55;
    for (let k = 0; k < n; k++) { const a = at(k), b = at((k * m) % n); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    g.globalAlpha = 1; g.fillStyle = c.ink;
    for (let k = 0; k < n; k++) { const a = at(k); g.beginPath(); g.arc(a[0], a[1], 2, 0, TAU); g.fill(); }
    g.font = "500 12px ui-monospace, Menlo, monospace"; g.fillStyle = c.ink; g.fillText(`k → ${m}k mod ${n}`, 14, h - 14);
  },
  /* 6 · twenty little projects ticking off */
  (g, w, h, t, c) => {
    const cols = 5, rows = 4, gap = 10, cw = (w - 40 - gap * (cols - 1)) / cols, ch = (h - 56 - gap * (rows - 1)) / rows;
    const idx = Math.floor(t / 170) % 26;
    for (let i = 0; i < 20; i++) {
      const x = 20 + (i % cols) * (cw + gap), y = 30 + Math.floor(i / cols) * (ch + gap);
      const done = i < idx, cur = i === idx;
      g.fillStyle = cur ? c.saffron : done ? c.blue : c.ink; g.globalAlpha = cur || done ? 1 : 0.12;
      rr(g, x, y, cw, ch, 8); g.fill();
      if (done) { g.globalAlpha = 1; g.strokeStyle = c.paper; g.lineWidth = 2.2; g.beginPath(); g.moveTo(x + cw / 2 - 7, y + ch / 2); g.lineTo(x + cw / 2 - 2, y + ch / 2 + 5); g.lineTo(x + cw / 2 + 8, y + ch / 2 - 6); g.stroke(); }
    }
    g.globalAlpha = 1;
  },
];

export function ProjectIndex() {
  const list = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const label = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = box.current!, canvas = cv.current!, g = canvas.getContext("2d")!;
    const css = getComputedStyle(document.documentElement);
    const col: Col = {
      ink: css.getPropertyValue("--ink").trim() || "#12100d",
      blue: css.getPropertyValue("--blue").trim() || "#2a39e6",
      saffron: css.getPropertyValue("--saffron").trim() || "#ffb300",
      paper: css.getPropertyValue("--paper").trim() || "#f6f0e1",
    };
    const W = 340, H = 232, dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr; canvas.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);

    let idx = -1, x = 0, y = 0, tx = 0, ty = 0, raf = 0, hide = 0;
    const paint = (t: number) => {
      g.clearRect(0, 0, W, H); g.fillStyle = col.paper; g.fillRect(0, 0, W, H);
      SPECIMENS[idx]?.(g, W, H, reduce ? 1200 : t, col);
    };
    const frame = (t: number) => {
      x += (tx - x) * 0.17; y += (ty - y) * 0.17;
      el.style.transform = `translate3d(${x}px,${y}px,0) rotate(${Math.max(-6, Math.min(6, (tx - x) * -0.05))}deg)`;
      if (idx >= 0) paint(t);
      raf = requestAnimationFrame(frame);
    };
    const start = () => { clearTimeout(hide); if (!raf) raf = requestAnimationFrame(frame); };
    const stop = () => { hide = window.setTimeout(() => { cancelAnimationFrame(raf); raf = 0; }, 320); };

    const rows = Array.from(list.current!.querySelectorAll<HTMLElement>(".prow"));
    const enters = rows.map((r, i) => {
      const enter = () => { idx = i; if (label.current) label.current.textContent = PROJECTS[i].name; el.classList.add("is-on"); start(); };
      const leave = () => { el.classList.remove("is-on"); stop(); };
      r.addEventListener("pointerenter", enter); r.addEventListener("pointerleave", leave);
      r.addEventListener("focus", enter); r.addEventListener("blur", leave);
      return () => { r.removeEventListener("pointerenter", enter); r.removeEventListener("pointerleave", leave); r.removeEventListener("focus", enter); r.removeEventListener("blur", leave); };
    });
    const move = (e: PointerEvent) => {
      tx = e.clientX + 36; ty = e.clientY - H / 2;
      if (tx + W > innerWidth - 16) tx = e.clientX - W - 36;
      ty = Math.max(12, Math.min(innerHeight - H - 12, ty));
      if (!raf) { x = tx; y = ty; }
    };
    list.current!.addEventListener("pointermove", move, { passive: true });
    const L = list.current!;
    return () => { enters.forEach((d) => d()); L.removeEventListener("pointermove", move); cancelAnimationFrame(raf); clearTimeout(hide); };
  }, []);

  return (
    <div className="pidx" ref={list}>
      {PROJECTS.map((p, i) => (
        <a className="prow" key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" data-cursor="open ↗" data-no-nav data-reveal>
          <span className="i">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <span className="pname">{p.name}</span>
            {p.badge && <span className="badge">{p.badge}</span>}
          </div>
          <div className="pdesc">
            {p.desc}
            <span className="ptags">{p.tags}</span>
          </div>
          <div className="pmeta">
            <span>{p.lang}</span>
            <span className="arrow" aria-hidden="true">↗</span>
          </div>
        </a>
      ))}
      <div className="preview" ref={box} aria-hidden="true">
        <b ref={label} />
        <canvas ref={cv} />
      </div>
    </div>
  );
}
export default ProjectIndex;
