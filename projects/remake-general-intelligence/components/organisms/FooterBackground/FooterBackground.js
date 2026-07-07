"use client";

import useNYCTime from "@/hooks/useNYCTime";
import styles from "./FooterBackground.module.css";

export default function FooterBackground() {
  const { footerSrc } = useNYCTime();

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.inner}>
        <div className={styles.gradient} />
        <img src={footerSrc} alt="" className={styles.image} />
        <div className={styles.bar}>
          <span>© The General Intelligence Company of New York 2026</span>
          <a
            href="https://altalogy.com/?ref=gic-website"
            target="_blank"
            rel="noopener noreferrer"
          >
            Design by Altalogy
          </a>
        </div>
      </div>
    </div>
  );
}
