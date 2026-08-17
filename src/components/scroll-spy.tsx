"use client";

import { useEffect } from "react";

export default function ScrollSpy() {
  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-spy]"));
    if (links.length === 0) return;

    const sections = links
      .map((link) => {
        const href = link.getAttribute("href");
        return href?.startsWith("#") ? document.getElementById(href.slice(1)) : null;
      })
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const setActive = (id: string | null) => {
      for (const link of links) {
        const target = link.getAttribute("href")?.slice(1) ?? null;
        const active = target === id;
        link.toggleAttribute("data-active", active);
        if (active) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      }
    };

    let ticking = false;
    const update = () => {
      const marker = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      }
      setActive(current);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}