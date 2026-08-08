"use client";

import { useEffect, useRef } from "react";
import styles from "./Cursor.module.css";

export default function Cursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only on devices with a precise pointer (skip touch screens).
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;

    const el = dotRef.current;
    const root = document.documentElement;
    root.classList.add("cursorHidden");

    const move = (e) => {
      // Position is applied via transform so the CSS `transition: transform`
      // produces the smooth trailing follow, exactly like the original.
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-15%, -25%)`;
      el.style.opacity = "1";
    };

    window.addEventListener("mousemove", move, { passive: true });

    return () => {
      window.removeEventListener("mousemove", move);
      root.classList.remove("cursorHidden");
    };
  }, []);

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div ref={dotRef} className={styles.cursor} style={{ opacity: 0 }} />
    </div>
  );
}
