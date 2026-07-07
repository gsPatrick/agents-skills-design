"use client";

import { useEffect } from "react";
import useNYCTime from "@/hooks/useNYCTime";
import WordReveal from "@/components/atoms/WordReveal/WordReveal";
import styles from "./Hero.module.css";

export default function Hero() {
  const { timeLabel, clockRotation, heroSrc } = useNYCTime();

  useEffect(() => {
    [1, 2, 3, 4].forEach((index) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = `/images/spring-hero-${index}.avif`;
      document.head.appendChild(link);
    });
  }, []);

  return (
    <div id="hero" data-navbar-theme="dark">
      <section id="top" className={styles.bleed}>
        <div className={styles.frame}>
          <div className={styles.media}>
            <img src={heroSrc} alt="" className={styles.image} />
          </div>

          <div className={styles.content}>
            <div className={styles.container}>
              <WordReveal
                as="h1"
                text="The General Intelligence Company Of New York"
                className={styles.title}
                animateOnMount
                stagger={50}
              />

              <div className={styles.taglineWrap}>
                <div className={styles.taglineInner}>
                  <p className={styles.tagline}>
                    Agentic companies are on the horizon, and we&apos;re building
                    them
                  </p>
                </div>
              </div>

              <div className={styles.stickyWrap}>
                <div className={styles.card}>
                  <div className={styles.cardInner}>
                    <h2 className={styles.cardTitle}>
                      AI that runs businesses autonomously
                    </h2>
                    <p className={styles.cardText}>
                      The General Intelligence Company is an applied AI lab working
                      towards automating businesses full-stack with AI.
                    </p>
                    <a className={styles.cardLink} href="#about">
                      <span className={styles.cardLinkText}>Get to know us</span>
                      <span className={styles.cardLinkArrow} aria-hidden="true">
                        <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                          <rect x="3.95" y="4.29" width="1.42" height="1.42" fill="currentColor" />
                          <rect x="1.13" y="1.47" width="1.42" height="1.42" fill="currentColor" />
                          <rect x="1.13" y="7.11" width="1.42" height="1.42" fill="currentColor" />
                          <rect x="2.53" y="2.88" width="1.42" height="1.42" fill="currentColor" />
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.clock} aria-hidden="true">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                style={{
                  transform: `rotate(${clockRotation}deg)`,
                  transformOrigin: "center center",
                  transition: "transform 1s ease-out",
                }}
              >
                <circle cx="6" cy="6" r="5.3" stroke="#FEFFFC" strokeWidth="1.2" />
                <path
                  d="M6 4.8V1"
                  stroke="#FEFFFC"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <span>{timeLabel}</span>
              <span className={styles.city}>NYC</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
