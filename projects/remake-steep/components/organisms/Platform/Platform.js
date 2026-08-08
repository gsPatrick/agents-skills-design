"use client";

import { useRef, useState } from "react";
import WordReveal from "@/components/atoms/WordReveal/WordReveal";
import styles from "./Platform.module.css";

/* Cada card carrega seu próprio par de cores para o estado ativo. Os valores
   são específicos desta seção — não são os tokens semânticos globais. */
const CARDS = [
  {
    icon: "/icons/usp-1.svg",
    title: "Built on metrics",
    text: "No more dashboards. With Steep, data teams ship governed metrics that power all your analysis and reporting.",
    tone: "tonePeach", // #FBE1D1 / #5D2A1A
  },
  {
    icon: "/icons/usp-2.svg",
    title: "Powered by AI",
    text: "With AI-powered workflows in Steep, anyone can do deep analysis and generate reports. All using trusted metrics.",
    tone: "toneBlue", // #D3E3FC / #194168
  },
  {
    icon: "/icons/usp-3.svg",
    title: "Designed for engagement",
    text: "Data teams work smarter. Users move faster. And your whole company builds a stronger data culture.",
    tone: "toneGreen", // #D8EFDF / #1F4720
  },
];

/**
 * "A new kind of analytics platform" — baralho de 3 cards.
 *
 * Camadas:   uma
 * Driver:    HOVER (onMouseEnter por card) em desktop; scroll-snap em mobile
 * Estados:   3 discretos, índice 0 ativo por padrão
 * Pista:     nenhuma
 *
 * O card ativo é o ÚNICO peach da página. Ele não é fixo — migra com o
 * ponteiro. É por isso que o sistema pode ter três cards sem diluir o
 * destaque: só um é cromático por vez.
 *
 * Medidas (1440px): row 1200 wide translateX(3%), gap 24, card 384×480
 * (aspect 4/5). Ativo scale(1.1), inativo scale(.9) translateX(2%), ambos
 * com transform-origin: bottom.
 */
export default function Platform() {
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);
  const [page, setPage] = useState(0);

  const scrollTo = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i];
    if (!card) return;
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2,
      behavior: "smooth",
    });
    setPage(i);
  };

  const onTrackScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let dist = Infinity;
    Array.from(track.children).forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    setPage(best);
  };

  return (
    <section className={styles.section} id="platform">
      <header className={styles.head}>
        <WordReveal
          as="h2"
          className={`display ${styles.heading}`}
          segments={[
            { text: "A new kind of" },
            { br: true },
            { text: "analytics platform" },
          ]}
        />
      </header>

      {/* --- Desktop: baralho com hover ----------------------------------- */}
      <div className={styles.row}>
        {CARDS.map((c, i) => (
          <div
            key={c.title}
            className={styles.slot}
            onMouseEnter={() => setActive(i)}
          >
            <div
              className={`${styles.card} ${styles[c.tone]} ${
                i === active ? styles.cardActive : styles.cardIdle
              }`}
            >
              <span className={styles.cardTitle}>{c.title}</span>

              <div className={styles.iconWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.icon} alt="" className={styles.icon} />
              </div>

              <p className={styles.cardText}>{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- Mobile: carrossel com snap ----------------------------------- */}
      <div className={styles.carousel}>
        <div
          ref={trackRef}
          className={styles.track}
          onScroll={onTrackScroll}
        >
          {CARDS.map((c, i) => (
            <div key={c.title} className={styles.slide}>
              <div
                className={`${styles.mCard} ${styles[c.tone]} ${
                  i === page ? styles.mActive : styles.mIdle
                }`}
              >
                <span className={styles.mTitle}>{c.title}</span>
                <div className={styles.mIconWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.icon} alt="" className={styles.mIcon} />
                </div>
                <p className={styles.mText}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.nav}>
          <button
            type="button"
            aria-label="Previous"
            className={styles.navBtn}
            disabled={page === 0}
            onClick={() => scrollTo(Math.max(0, page - 1))}
          >
            <Arrow dir="left" />
          </button>
          <button
            type="button"
            aria-label="Next"
            className={styles.navBtn}
            disabled={page === CARDS.length - 1}
            onClick={() => scrollTo(Math.min(CARDS.length - 1, page + 1))}
          >
            <Arrow dir="right" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Arrow({ dir }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="18" height="18" aria-hidden="true">
      <path
        d={dir === "left" ? "M12 4 6 10l6 6" : "M8 4l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
