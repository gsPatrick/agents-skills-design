"use client";

import { useEffect, useId, useRef, useState } from "react";
import RivePanel from "@/components/molecules/RivePanel/RivePanel";
import styles from "./TabList.module.css";

/**
 * Tabs com avanço automático — recipe nova: tab-panel-autoplay
 *
 * Driver: TEMPO, com duração por item. Não é setInterval: cada aba tem sua
 * própria duração (a do original vem do tamanho da animação Rive de cada
 * artboard — AI 15s, Explore 12s, Reports 17s, Drill down 13.16s,
 * Targets 8s, Maps 6.14s). Um intervalo fixo faria as abas curtas
 * arrastarem e as longas cortarem.
 *
 * A barra de 2px sob o rótulo ativo é o relógio visível: ela preenche
 * `width: 0 → 100%` em `duration` segundos, linear. Quando termina, avança.
 *
 * Pausa fora da viewport — sem isso o carrossel roda a página inteira em
 * segundo plano e o usuário chega numa aba aleatória.
 *
 * Clicar numa aba salta para ela e reinicia o ciclo.
 */
export default function TabList({ items, className = "", dark = false }) {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0); // força o restart da barra
  const [inView, setInView] = useState(false);
  const wrapRef = useRef(null);
  const uid = useId();

  /* Pausa quando a seção não está visível. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Avanço automático — o timer espelha a duração da barra. */
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ms = (items[active]?.duration ?? 8) * 1000;
    const t = window.setTimeout(
      () => setActive((i) => (i + 1) % items.length),
      ms
    );
    return () => window.clearTimeout(t);
  }, [active, cycle, inView, items]);

  const select = (i) => {
    setActive(i);
    setCycle((c) => c + 1);
  };

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${dark ? styles.dark : ""} ${className}`}>
      <div className={styles.list} role="tablist" aria-orientation="vertical">
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <button
              key={item.title}
              type="button"
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-selected={isActive}
              aria-controls={`${uid}-panel-${i}`}
              className={`${styles.trigger} ${isActive ? styles.active : ""}`}
              onClick={() => select(i)}
            >
              <span className={styles.triggerBody}>
                <span className={styles.triggerTitle}>{item.title}</span>
                <span className={styles.triggerText}>{item.text}</span>
              </span>

              <span className={styles.railTrack} aria-hidden="true">
                <span
                  /* A key reinicia a animação a cada troca de aba. */
                  key={`${i}-${active}-${cycle}`}
                  className={styles.railFill}
                  /* Só duração e play-state: o nome do keyframes vive no CSS
                     Module, que o hasheia — referenciá-lo aqui não resolve. */
                  style={{
                    animationDuration: `${item.duration ?? 8}s`,
                    animationPlayState: inView ? "running" : "paused",
                  }}
                />
              </span>

            </button>
          );
        })}
      </div>

      <div className={styles.panels}>
        {items.map((item, i) => (
          <div
            key={item.title}
            role="tabpanel"
            id={`${uid}-panel-${i}`}
            aria-labelledby={`${uid}-tab-${i}`}
            hidden={i !== active}
            className={`${styles.panel} ${
              i === active ? styles.panelActive : ""
            }`}
          >
            {item.artboard ? (
              <RivePanel artboard={item.artboard} active={i === active} />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className={styles.image}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
