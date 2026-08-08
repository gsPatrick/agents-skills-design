"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Native scroll on touch devices and when reduced motion is preferred.
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    let current = window.scrollY;
    let target = window.scrollY;
    let running = false;
    let rafId = null;

    // Snappier easing so it settles quickly instead of drifting for seconds.
    const ease = 0.14;

    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const loop = () => {
      const diff = target - current;
      current += diff * ease;

      if (Math.abs(diff) < 0.5) {
        current = target;
        window.scrollTo(0, current);
        running = false;
        rafId = null;
        return;
      }

      window.scrollTo(0, current);
      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(loop);
      }
    };

    const onWheel = (e) => {
      if (e.ctrlKey) return; // let pinch-to-zoom through

      e.preventDefault();

      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16; // lines -> px
      else if (e.deltaMode === 2) delta *= window.innerHeight; // pages -> px

      target += delta;
      target = Math.min(Math.max(target, 0), maxScroll());

      // Cap how far the target can lead the current position. Trackpad
      // momentum fires a long stream of wheel events; without this cap they
      // pile up and the page keeps easing for several seconds after you stop.
      const lead = window.innerHeight;
      target = Math.min(Math.max(target, current - lead), current + lead);

      start();
    };

    // Keep our values in sync with native scrolls (scrollbar drag, keyboard,
    // anchor jumps) whenever we're not driving the animation ourselves.
    const onScroll = () => {
      if (!running) {
        current = window.scrollY;
        target = window.scrollY;
      }
    };

    const onResize = () => {
      target = Math.min(target, maxScroll());
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
