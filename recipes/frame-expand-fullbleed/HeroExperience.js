"use client";

import { useEffect, useState } from "react";
import BgVideo from "@/components/atoms/BgVideo/BgVideo";
import ArrowButton from "@/components/atoms/ArrowButton/ArrowButton";
import WhatWeDo from "@/components/organisms/WhatWeDo/WhatWeDo";
import styles from "./HeroExperience.module.css";

/**
 * Hero + "What we do" share one pinned video backdrop, exactly like the
 * original: the framed video (inset + rounded) snaps open to a full-bleed,
 * edge-to-edge canvas on the very first scroll — in sync with the header logo
 * turning white — then keeps playing behind the scroll-driven statements.
 */
export default function HeroExperience() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => setExpanded(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className={styles.experience} id="top">
      <div className={styles.videoBg}>
        <div className={`${styles.frame} ${expanded ? styles.expanded : ""}`}>
          <div className={styles.canvas}>
            <BgVideo src="/media/hero-loop.mp4" className={styles.video} />
          </div>
        </div>
      </div>

      <div className={styles.overlay}>
        <div className={`container ${styles.heroInner}`}>
          <h1 className={styles.heading}>
            Engineering the future
            <br />
            of aging medicine.
          </h1>

          <div className={styles.bottom}>
            <h2 className={styles.text}>
              We unravel complex biology with optogenetics, chemistry, and AI
              for small molecule therapeutic discovery.
            </h2>
            <ArrowButton label="Discover our platform" />
          </div>
        </div>

        <WhatWeDo />
      </div>
    </section>
  );
}
