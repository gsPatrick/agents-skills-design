"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Membership.module.css";

/**
 * Membership — "Your membership includes so much more."
 *
 * Camadas:   uma
 * Driver:    IntersectionObserver na PRIMEIRA linha
 * Estados:   armado → revelado (linha a linha)
 *
 * Do CSS original:
 *   .sp2-membership        padding 5rem 7.25rem, gap 2rem, centro, texto
 *                          centralizado, letter-spacing −.005625rem
 *   .sp2-membership__intro max-width 44.25rem
 *   .sp2-membership__list  width 40rem
 *   .sp2-membership__row   gap 3.5rem, radius .25rem
 *                          padding .5625rem .75rem .5rem
 *                          transition opacity .6s, transform .6s
 *   .row--alt              background #fafafa      ← zebra
 *   .__label               width 13.125rem, 1.125rem
 *   .__desc                flex 1, cor secundária, 1.125rem
 *
 * O `is-armed` é adicionado PELO JS, não vem no HTML. Sem JavaScript as
 * linhas ficam visíveis — a animação é enfeite, não requisito. É progressive
 * enhancement de verdade: o CSS só esconde depois que o script confirma que
 * vai conseguir revelar.
 *
 * O original força um reflow (`void section.offsetHeight`) entre adicionar
 * a classe e disparar a revelação — sem isso o navegador agruparia as duas
 * mudanças num único frame e a transição não aconteceria.
 *
 * O escalonamento é por `setTimeout(i * 100)`, não por `transition-delay`.
 * A diferença importa: com timeout cada linha só começa a existir quando
 * chega a vez dela, então interromper a rolagem no meio deixa o resto
 * congelado — o que combina com uma lista que se preenche.
 *
 * A ZEBRA alterna por índice par, e algumas linhas não têm descrição. O
 * label tem largura FIXA (13.125rem), então as duas colunas alinham mesmo
 * quando a segunda está vazia.
 */
const LINHAS = [
  ["100+ biomarker test", "Detect early signs of 1,000+ conditions"],
  ["Health data upload", "Upload external bloodwork reports"],
  ["Biological age", null],
  ["Personalized protocol", "Diet, lifestyle and supplements"],
  ["Wearable connection", "Link Apple Health, Whoop, OURA, etc."],
  ["Advanced AI chat", "With context on your health"],
  ["24/7 access to care team", "Ask questions anytime"],
  ["Access add-on tests", "Gut, toxins, Grail Galleri cancer screen"],
  ["Access peptides", null],
  ["Access best supplements", null],
  ["Access prescriptions", null],
];

export default function Membership() {
  const listRef = useRef(null);
  /* `armado` só liga quando o JS roda — sem ele as linhas nascem visíveis. */
  const [armado, setArmado] = useState(false);
  const [visiveis, setVisiveis] = useState(() => new Set());

  useEffect(() => {
    setArmado(true);
  }, []);

  useEffect(() => {
    if (!armado) return;
    const primeira = listRef.current?.firstElementChild;
    if (!primeira) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisiveis(new Set(LINHAS.map((_, i) => i)));
      return;
    }

    const timers = [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          LINHAS.forEach((_, i) => {
            timers.push(
              setTimeout(() => {
                setVisiveis((s) => new Set(s).add(i));
              }, i * 100)
            );
          });
          io.disconnect();
        });
      },
      { threshold: 0.15 }
    );
    io.observe(primeira);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [armado]);

  return (
    <section className={`${styles.section} ${armado ? styles.armado : ""}`}>
      <div className={styles.intro}>
        <p className={styles.introText}>
          Your membership includes so much more.
        </p>
      </div>

      <h3 className={styles.heading}>
        <span>What could cost $10,000</span>
        <br />
        <span>is now $199</span>
      </h3>

      <div ref={listRef} className={styles.list}>
        {LINHAS.map(([label, desc], i) => (
          <div
            key={label}
            className={`${styles.row} ${i % 2 === 0 ? styles.rowAlt : ""} ${
              visiveis.has(i) ? styles.visivel : ""
            }`}
          >
            <div className={styles.label}>{label}</div>
            {desc && <div className={styles.desc}>{desc}</div>}
          </div>
        ))}
      </div>

      <a href="/checkout" className={styles.cta}>
        Become a member
      </a>
    </section>
  );
}
