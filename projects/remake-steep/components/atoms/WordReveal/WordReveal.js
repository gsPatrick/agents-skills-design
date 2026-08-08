"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WordReveal.module.css";

/**
 * Revelação por palavra — recipe: recipes/reveal-word-blur
 *
 * Aceita segmentos em vez de string pura, porque os títulos do original
 * misturam trechos em itálico e quebras de linha duras:
 *
 *   [{ text: "AI analytics for faster" }, { br: true },
 *    { text: "insights and" }, { text: "zero chaos", italic: true }]
 *
 * As quebras não são decorativas — vários títulos dependem do <br/> para a
 * composição em duas linhas, e sem ele o texto reflui errado.
 *
 * Os valores (blur 5px, translateY 10px, stagger 60ms, threshold 0.25,
 * rootMargin -10%) vêm da recipe — não os ajuste sem ler o RECIPE.md.
 */
export default function WordReveal({
  segments,
  as: Tag = "span",
  className = "",
  delay = 0,
  stagger = 60,
  animateOnMount = false,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (animateOnMount) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [animateOnMount]);

  // Achata os segmentos numa lista única, para o stagger correr contínuo
  // entre eles em vez de reiniciar a cada segmento.
  const items = [];
  segments.forEach((seg) => {
    if (seg.br) {
      items.push({ br: true });
      return;
    }
    seg.text
      .split(" ")
      .filter(Boolean)
      .forEach((w) => items.push({ w, italic: seg.italic }));
  });

  return (
    <Tag ref={ref} className={`${styles.reveal} ${className}`}>
      {items.map((item, i) => {
        if (item.br) return <br key={`br-${i}`} />;

        // NBSP, não espaço normal: um espaço no fim de um inline-block é
        // descartado no processamento de white-space e as palavras colam
        // ("Anewkindof"). O   sobrevive.
        // Só antes de outra palavra — antes de um <br/> ele viraria recuo
        // fantasma no começo da linha seguinte.
        const next = items[i + 1];
        const space = next && !next.br ? " " : "";

        return (
          <span
            key={`${item.w}-${i}`}
            className={`${styles.word} ${item.italic ? styles.italic : ""}`}
            style={{
              transitionDelay: visible ? `${delay + i * stagger}ms` : "0ms",
              opacity: visible ? 1 : 0,
              filter: visible ? "blur(0)" : "blur(5px)",
              transform: visible ? "translateY(0)" : "translateY(10px)",
            }}
          >
            {item.w}
            {space}
          </span>
        );
      })}
    </Tag>
  );
}
