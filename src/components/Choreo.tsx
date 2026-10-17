import { useEffect, useRef } from "react";
import { ORBIT, PEAK, SECTIONS, STEPS_TOTAL, fmt } from "../lib/collatz";

/**
 * Choreo — the one island that owns scroll.
 *
 * Everything that needs GSAP / ScrollTrigger / Lenis lives HERE on purpose:
 * separate islands are separate bundles, and two copies of GSAP means two
 * ScrollTrigger registries that can't see each other. One island, one copy.
 *
 * It renders only the fixed chrome (spine + cursor) and decorates the
 * server-rendered page by selector:
 *   [data-reveal]  fade/slide in      [data-lines]  masked word-by-word title
 *   [data-scrub]   words light up as you scroll
 *   [data-count]   count-up           [data-magnet] magnetic buttons
 *   [data-cursor]  label cursor       .marq         scroll-velocity marquee
 *   .pk            pinned horizontal rail (≥ 900px)
 */

const TAIL_FROM = 6; // sections cover steps 0..6, the long run to 1 fills the rest
const XN = ORBIT.map((v) => Math.log(v) / Math.log(PEAK)); // 0..1 across the plot
const vx = (x: number) => 4 + x * 92; // viewBox is 0..100 wide
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Map orbit step → scroll progress (0..1), given where the sections land. */
function buildY(anchors: number[]): number[] {
  const last = anchors[TAIL_FROM];
  return ORBIT.map((_, s) =>
    s <= TAIL_FROM ? anchors[s] : lerp(last, 1, (s - TAIL_FROM) / (STEPS_TOTAL - TAIL_FROM)),
  );
}
const DEFAULT_ANCHORS = [0, 0.1, 0.22, 0.38, 0.55, 0.68, 0.8];
const trackPath = (Y: number[]) =>
  ORBIT.map((_, s) => `${s ? "L" : "M"}${vx(XN[s]).toFixed(2)} ${(Y[s] * 1000).toFixed(1)}`).join(" ");

const TICKS = [...SECTIONS.slice(0, TAIL_FROM + 1).map((s) => s.step), STEPS_TOTAL];

export function Choreo() {
  const nRef = useRef<HTMLElement>(null);
  const stepRef = useRef<HTMLSpanElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const tickRefs = useRef<(HTMLElement | null)[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorLabel = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const disposers: Array<() => void> = [];
    let dead = false;
    const on = <K extends keyof WindowEventMap>(t: K, fn: (e: WindowEventMap[K]) => void, o?: AddEventListenerOptions) => {
      window.addEventListener(t, fn as EventListener, o);
      disposers.push(() => window.removeEventListener(t, fn as EventListener));
    };

    /* ---------------- document metadata (x's shell has a fixed <title>) ---------------- */
    document.title = "Abdelkabir Ouadoukou — solo developer, framework builder, Marrakesh";
    if (!document.querySelector('meta[name="description"]')) {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = "Abdelkabir Ouadoukou, a solo developer and framework builder in Marrakesh. Projects, the @thexjs framework, math and security. The whole site is one Collatz orbit.";
      document.head.appendChild(m);
    }

    /* ---------------- clock (Marrakesh) ---------------- */
    const clocks = Array.from(document.querySelectorAll<HTMLElement>(".js-clock"));
    const fmtTime = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Casablanca", hour: "2-digit", minute: "2-digit" });
    const tickClock = () => clocks.forEach((c) => (c.textContent = fmtTime.format(new Date())));
    tickClock();
    const clockId = setInterval(tickClock, 15_000);
    disposers.push(() => clearInterval(clockId));

    /* ---------------- spine: live hailstone ---------------- */
    let Y = buildY(DEFAULT_ANCHORS);
    let lastK = -1;

    const placeTicks = () =>
      TICKS.forEach((s, i) => {
        const el = tickRefs.current[i];
        if (el) el.style.top = `${Y[s] * 100}%`;
      });

    const measure = () => {
      const vh = innerHeight;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const a = SECTIONS.slice(0, TAIL_FROM + 1).map((s, i) => {
        const el = document.getElementById(s.id);
        if (!el || i === 0) return 0;
        return clamp((el.getBoundingClientRect().top + scrollY - vh * 0.45) / max, 0, 0.97);
      });
      for (let i = 1; i < a.length; i++) a[i] = Math.max(a[i], a[i - 1] + 0.004);
      Y = buildY(a);
      trackRef.current?.setAttribute("d", trackPath(Y));
      placeTicks();
      lastK = -1;
      update();
    };

    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const p = clamp(scrollY / max, 0, 1);
      let k = 0;
      while (k < STEPS_TOTAL && Y[k + 1] <= p) k++;
      const k1 = Math.min(k + 1, STEPS_TOTAL);
      const t = Y[k1] > Y[k] ? clamp((p - Y[k]) / (Y[k1] - Y[k]), 0, 1) : 0;
      const x = vx(lerp(XN[k], XN[k1], t));

      if (dotRef.current) {
        dotRef.current.style.left = `${x}%`;
        dotRef.current.style.top = `${p * 100}%`;
      }
      if (drawRef.current) {
        let d = `M${vx(XN[0]).toFixed(2)} ${(Y[0] * 1000).toFixed(1)}`;
        for (let s = 1; s <= k; s++) d += ` L${vx(XN[s]).toFixed(2)} ${(Y[s] * 1000).toFixed(1)}`;
        d += ` L${x.toFixed(2)} ${(p * 1000).toFixed(1)}`;
        drawRef.current.setAttribute("d", d);
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (k !== lastK) {
        lastK = k;
        const n = fmt(ORBIT[k]);
        if (nRef.current) nRef.current.textContent = n;
        if (stepRef.current) stepRef.current.textContent = `step ${k}/${STEPS_TOTAL}`;
        if (chipRef.current) chipRef.current.textContent = `n = ${n} · step ${k}/${STEPS_TOTAL}`;
      }
    };

    let ticking = false;
    on("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; update(); });
    }, { passive: true });
    on("resize", () => measure());
    placeTicks();
    measure();

    /* ---------------- anchors (work with or without Lenis) ---------------- */
    let lenis: any = null;
    on("click", (e) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      const el = id && id !== "top" ? document.getElementById(id) : document.body;
      if (!el) return;
      e.preventDefault();
      a.closest("details")?.removeAttribute("open");
      if (lenis) lenis.scrollTo(id === "top" || !id ? 0 : el, { duration: 1.7, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
      else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      history.replaceState(null, "", id ? `#${id}` : location.pathname);
    });

    if (reduce) {
      // static experience: spine still tells the story, nothing else moves
      return () => disposers.forEach((d) => d());
    }

    /* ---------------- the motion layer ---------------- */
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);
      if (dead) return;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
      document.documentElement.classList.add("motion");

      /* Lenis ⟷ GSAP: one RAF loop for both */
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      disposers.push(() => { gsap.ticker.remove(raf); lenis.destroy(); lenis = null; });

      const mm = gsap.matchMedia();
      const ctx = gsap.context(() => {
        /* ---- pinned horizontal rail (created first: pins must precede dependants) ---- */
        mm.add("(min-width: 900px)", () => {
          const pin = document.querySelector<HTMLElement>(".pk");
          const track = pin?.querySelector<HTMLElement>(".pk-track");
          const meter = pin?.querySelector<HTMLElement>(".pk-meter i");
          if (!pin || !track) return;
          const dist = () => Math.max(0, track.scrollWidth - pin.clientWidth);
          gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: {
              trigger: pin, start: "top top", end: () => `+=${dist()}`,
              pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
              onUpdate: (s) => meter && (meter.style.transform = `scaleX(${s.progress})`),
            },
          });
        });

        /* ---- masked word-by-word titles ---- */
        const split = (el: HTMLElement, cls: string) => {
          const words: HTMLElement[] = [];
          const walk = (node: Node) => {
            Array.from(node.childNodes).forEach((ch) => {
              if (ch.nodeType === 3) {
                const frag = document.createDocumentFragment();
                (ch.textContent || "").split(/(\s+)/).forEach((tok) => {
                  if (!tok) return;
                  if (/^\s+$/.test(tok)) return void frag.appendChild(document.createTextNode(" "));
                  const o = document.createElement("span");
                  o.className = "sw"; o.setAttribute("aria-hidden", "true");
                  const i = document.createElement("span");
                  i.className = cls; i.textContent = tok;
                  o.appendChild(i); frag.appendChild(o); words.push(i);
                });
                node.replaceChild(frag, ch);
              } else if (ch.nodeType === 1 && (ch as Element).tagName !== "BR") walk(ch);
            });
          };
          el.setAttribute("aria-label", el.textContent || "");
          walk(el);
          return words;
        };

        gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((el) => {
          const words = split(el, "sl");
          gsap.set(words, { yPercent: 112, rotate: 5 });
          ScrollTrigger.create({
            trigger: el, start: "top 88%", once: true,
            onEnter: () => gsap.to(words, { yPercent: 0, rotate: 0, duration: 1.15, ease: "expo.out", stagger: 0.055 }),
          });
        });

        /* ---- scrubbed paragraph: words light up with scroll ---- */
        gsap.utils.toArray<HTMLElement>("[data-scrub]").forEach((el) => {
          const words = split(el, "w");
          gsap.to(words, {
            opacity: 1, ease: "none", stagger: 0.12,
            scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 48%", scrub: true },
          });
        });

        /* ---- generic reveals, batched ---- */
        ScrollTrigger.batch("[data-reveal]", {
          start: "top 90%", once: true,
          onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.09, overwrite: true }),
        });

        /* ---- count-ups ---- */
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const target = parseInt(el.dataset.count || el.textContent || "0", 10);
          const o = { v: 0 };
          el.textContent = "0";
          ScrollTrigger.create({
            trigger: el, start: "top 95%", once: true,
            onEnter: () => gsap.to(o, { v: target, duration: 1.6, ease: "power3.out", onUpdate: () => (el.textContent = String(Math.round(o.v))) }),
          });
        });

        /* ---- ghost numerals drift ---- */
        gsap.utils.toArray<HTMLElement>(".stone, .hero .ghost, .foot .one").forEach((el) => {
          gsap.fromTo(el, { yPercent: -10 }, {
            yPercent: 16, ease: "none",
            scrollTrigger: { trigger: el.closest("section, footer") || el, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      });
      disposers.push(() => { ctx.revert(); mm.revert(); });

      /* ---- scroll-velocity marquees (React Bits ScrollVelocity idea) ---- */
      const marqs = gsap.utils.toArray<HTMLElement>(".marq").map((el, i) => {
        const group = el.querySelector<HTMLElement>(".marq-group")!;
        return { el, gw: group.getBoundingClientRect().width, x: 0, dir: i % 2 ? 1 : -1 };
      });
      const measureMarq = () => marqs.forEach((m) => (m.gw = m.el.querySelector<HTMLElement>(".marq-group")!.getBoundingClientRect().width));
      document.fonts?.ready.then(measureMarq);
      on("resize", measureMarq);
      const marqTick = (_t: number, dt: number) => {
        const v = lenis?.velocity ?? 0;
        const boost = 1 + Math.min(Math.abs(v) * 0.4, 7);
        marqs.forEach((m) => {
          if (!m.gw) return;
          m.x += m.dir * ((70 * dt) / 1000) * boost;
          if (m.x <= -m.gw) m.x += m.gw;
          if (m.x > 0) m.x -= m.gw;
          m.el.style.transform = `translate3d(${m.x}px,0,0)`;
        });
      };
      gsap.ticker.add(marqTick);
      disposers.push(() => gsap.ticker.remove(marqTick));

      /* ---- magnetic buttons ---- */
      if (fine) {
        document.querySelectorAll<HTMLElement>("[data-magnet]").forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1,0.5)" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1,0.5)" });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.32);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
          };
          const out = () => { xTo(0); yTo(0); };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", out);
          disposers.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", out); });
        });

        /* ---- label cursor ---- */
        const ring = cursorRef.current, label = cursorLabel.current;
        if (ring && label) {
          const cx = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" });
          const cy = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" });
          on("pointermove", (e) => { ring.classList.add("is-on"); cx(e.clientX); cy(e.clientY); }, { passive: true });
          on("pointerover", (e) => {
            const t = (e.target as Element | null)?.closest?.("[data-cursor]");
            if (t) { label.textContent = t.getAttribute("data-cursor") || ""; ring.classList.add("is-label"); }
            else ring.classList.remove("is-label");
          });
          const hide = () => ring.classList.remove("is-on");
          document.addEventListener("pointerleave", hide);
          disposers.push(() => document.removeEventListener("pointerleave", hide));
        }
      }

      /* layout is final once fonts are in: re-measure the spine & triggers */
      ScrollTrigger.addEventListener("refresh", measure);
      disposers.push(() => ScrollTrigger.removeEventListener("refresh", measure));
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      requestAnimationFrame(() => { ScrollTrigger.refresh(); measure(); });
    })();

    return () => {
      dead = true;
      document.documentElement.classList.remove("motion");
      disposers.forEach((d) => d());
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef} aria-hidden="true"><span ref={cursorLabel} /></div>

      <aside className="spine" aria-hidden="true">
        <div className="spine-read">
          <small>hailstone</small>
          <b ref={nRef}>{fmt(ORBIT[0])}</b>
          <span ref={stepRef}>step 0/{STEPS_TOTAL}</span>
        </div>
        <div className="spine-plot">
          <svg viewBox="0 0 100 1000" preserveAspectRatio="none">
            <path className="spine-track" ref={trackRef} d={trackPath(buildY(DEFAULT_ANCHORS))} />
            <path className="spine-draw" ref={drawRef} d="" />
          </svg>
          {TICKS.map((s, i) => (
            <span
              className="spine-tick"
              key={s}
              ref={(el) => { tickRefs.current[i] = el; }}
              style={{ top: `${buildY(DEFAULT_ANCHORS)[s] * 100}%` }}
            >
              {fmt(ORBIT[s])}
            </span>
          ))}
          <i className="spine-dot" ref={dotRef} />
        </div>
      </aside>

      <div className="spine-bar" ref={barRef} aria-hidden="true" />
      <div className="spine-chip" ref={chipRef} aria-hidden="true">n = 27 · step 0/{STEPS_TOTAL}</div>
    </>
  );
}
export default Choreo;
