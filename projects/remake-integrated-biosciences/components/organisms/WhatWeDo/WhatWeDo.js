"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WhatWeDo.module.css";

const STATEMENTS = [
  "Aging is an intrinsically complex systems biology challenge. Our Integrated Platform is purpose-built to unravel its intricate networks.",
  "By combining synthetic biology, chemistry, and AI, we probe disease biology with unprecedented control and precision, enabling a systematic exploration of chemical space that was previously inaccessible.",
  "Through the convergence of high-fidelity biological and chemical data with advanced AI, we unlock new therapeutic opportunities for age-related diseases.",
];

export default function WhatWeDo() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
      setProgress(scrollable > 0 ? scrolled / scrollable : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const count = STATEMENTS.length;
  const scaled = progress * count;
  const active = Math.min(count - 1, Math.floor(scaled));
  const local = scaled - active; // 0..1 within the active statement

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.sticky}>
        <div className={`container ${styles.head}`}>
          <span className={styles.label}>What we do</span>
        </div>

        <div className={styles.body}>
          <div className={styles.progress}>
            <div
              className={styles.progressBar}
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>

          <div className={`container ${styles.content}`}>
            <aside className={styles.index}>
              <span>{String(active + 1).padStart(2, "0")}</span>
              <span className={styles.indexDivider}>/</span>
              <span className={styles.indexTotal}>
                {String(count).padStart(2, "0")}
              </span>
            </aside>

            <div className={styles.main}>
              {STATEMENTS.map((statement, si) => {
                const isActive = si === active;
                const chars = statement.split("");
                const revealCount = isActive
                  ? local * chars.length
                  : si < active
                  ? chars.length
                  : 0;

                return (
                  <p
                    key={si}
                    className={styles.statement}
                    style={{ opacity: isActive ? 1 : 0 }}
                    aria-hidden={!isActive}
                  >
                    {chars.map((ch, i) => (
                      <span
                        key={i}
                        className={styles.char}
                        style={{ opacity: i < revealCount ? 1 : 0.4 }}
                      >
                        {ch}
                      </span>
                    ))}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
