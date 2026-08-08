"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MembershipStart.module.css";

/**
 * MembershipStart — "Your membership starts here"  (section_sp3-membership)
 *
 * Camadas:   carrossel infinito (esquerda) | bullets + preço + CTA (direita)
 * Driver:    autoplay de 5s, arraste, roda horizontal, clique nas barras
 * Estados:   4 slides reais × 3 cópias = 12 nós, com "snap" invisível
 *
 * Do CSS original:
 *   .section_sp3-membership  padding 0  (o respiro é das utilitárias)
 *   .page-padding            2.5rem lateral   → 1.5rem abaixo de 767
 *   .padding-section-medium  5rem vertical    → 4rem / 3rem
 *   .container-large         max-width 80rem
 *   .sp3-membership_wrapper  grid 1fr 1fr, gap 5rem, align center
 *   .sp3-membership_slider   44.625rem de altura, radius .75rem
 *   .sp3-membership_bar      .25rem, radius 99px, flex 1
 *   .is-active               flex-grow 8
 *   .sp3-membership_price    4.375rem / lh 4.625rem
 *
 * ── O LOOP ─────────────────────────────────────────────────────────────────
 * O original clona a lista inteira ANTES e DEPOIS dos slides reais e começa no
 * meio. Andar sempre avança de verdade — nunca há um salto para trás visível —
 * e 800ms depois da transição, se o índice saiu da cópia do meio, ele é
 * recolocado somando/subtraindo 4 com a transição desligada. O usuário está
 * olhando para uma imagem idêntica, então a costura não aparece.
 *
 * Reproduzo isso com 3 cópias e `semTransicao`. A alternativa "elegante"
 * (módulo 4 + reposicionar) quebra a direção: voltar do slide 1 para o 4 daria
 * um deslize para a direita de 3 telas.
 *
 * ── A LARGURA ──────────────────────────────────────────────────────────────
 * Os slides são travados em PIXELS medidos do slider, não em 100%. Precisa ser
 * assim porque o transform vai até `offsetLeft`, e offsetLeft já inclui o gap
 * de 1rem — misturar % com um gap em rem daria erro acumulado a cada slide.
 * Um ResizeObserver remede a cada mudança de viewport.
 *
 * ── A BARRA É O RELÓGIO ────────────────────────────────────────────────────
 * O original faz a conta do tempo restante na mão (Date.now, `remaining`,
 * transition de width em ms). Aqui a barra ativa roda um @keyframes de 5s e o
 * `animationend` DELA é o que vira a página. Uma fonte de verdade só: pausar é
 * `animation-play-state: paused` e o relógio para junto, sem contabilidade.
 * Por isso o keyframe `preencher` mora neste módulo — CSS Modules hasheia o
 * nome, e um @keyframes no globals aqui seria animação morta e silenciosa.
 *
 * Sob prefers-reduced-motion o autoplay não existe (a animação de 5s viraria
 * 0.01ms pela regra global e o carrossel giraria descontrolado): fica só a
 * navegação manual.
 */
/* O original manda `alt="Membership slide 1"` nas quatro (e repete o "1" duas
   vezes). Descrevo o que a foto mostra — custo zero, e o leitor de tela deixa
   de ouvir uma contagem que já está no contador ao lado. */
const SLIDES = [
  { src: "/media/mb-1.avif", alt: "Superpower score of 93 shown in the app" },
  { src: "/media/mb-2.avif", alt: "Heart health dashboard and digital twin on a tablet" },
  { src: "/media/mb-3.avif", alt: "Supplement delivery notification on a phone" },
  { src: "/media/mb-4.avif", alt: "AI companion answering a question about fatigue" },
];

const BULLETS = [
  "Annual 100+ biomarker panel",
  "Data dashboard and digital twin",
  "Upload past labs and connect wearables",
  "Personalized health protocol",
  "24/7 care team access",
  "AI companion for all health questions",
  "Marketplace with additional solutions",
];

const BADGES = [
  { icon: "/media/badge-hsa.svg", texto: "HSA/ FSA eligible", menor: false },
  { icon: "/media/badge-cancel.svg", texto: "Cancel anytime", menor: true },
  { icon: "/media/badge-results.svg", texto: "Results in a week", menor: false },
];

const REAL = SLIDES.length;
/* Três cópias: [clones][reais][clones]. O índice vive na do meio. */
const PISTA = [...SLIDES, ...SLIDES, ...SLIDES];
const TRANSICAO_MS = 750;

export default function MembershipStart() {
  const sliderRef = useRef(null);
  const arrasteRef = useRef(null);

  const [indice, setIndice] = useState(REAL);
  const [largura, setLargura] = useState(0);
  const [gap, setGap] = useState(0);
  const [semTransicao, setSemTransicao] = useState(true);
  const [arrastando, setArrastando] = useState(false);
  const [offsetArraste, setOffsetArraste] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [ciclo, setCiclo] = useState(0);
  const [semMovimento, setSemMovimento] = useState(false);

  /* Contador: `numero` é o que está na tela, `fase` conduz sai → entra. */
  const [numero, setNumero] = useState(1);
  const [direcao, setDirecao] = useState(1);
  const [fase, setFase] = useState("parado");

  const real = ((indice % REAL) + REAL) % REAL;

  /* --- medida ------------------------------------------------------------ */
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    /* Remedir desliga a transição: sem isso arrastar a janela faria o carrossel
       "deslizar" atrás da nova largura em vez de acompanhá-la. */
    const medir = () => {
      setSemTransicao(true);
      setLargura(el.clientWidth);
      setGap(parseFloat(getComputedStyle(document.documentElement).fontSize));
    };
    medir();

    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setSemMovimento(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  /* --- navegação --------------------------------------------------------- */
  const ir = useCallback((alvo, dir) => {
    setSemTransicao(false);
    setIndice(alvo);
    setCiclo((c) => c + 1);
    setDirecao(dir);
  }, []);

  /* Costura do loop: só depois da transição terminar, e só se o índice saiu da
     cópia do meio. Mexer antes deixaria o salto visível. */
  useEffect(() => {
    if (indice >= REAL && indice < REAL * 2) return;
    const t = setTimeout(() => {
      setSemTransicao(true);
      setIndice((i) => (i < REAL ? i + REAL : i - REAL));
    }, TRANSICAO_MS + 50);
    return () => clearTimeout(t);
  }, [indice]);

  /* Troca do número: sai 250ms, troca o texto, entra 250ms. */
  useEffect(() => {
    if (numero === real + 1) return;
    setFase("saindo");
    const t = setTimeout(() => {
      setNumero(real + 1);
      setFase("entrando");
    }, 250);
    return () => clearTimeout(t);
  }, [real, numero]);

  /* --- aba oculta: congela o relógio -------------------------------------- */
  useEffect(() => {
    const onVis = () => setPausado(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  /* --- arraste ------------------------------------------------------------ */
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const pegarX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

    const inicio = (e) => {
      arrasteRef.current = { x0: pegarX(e), x: pegarX(e), ativo: false };
    };

    const move = (e) => {
      const d = arrasteRef.current;
      if (!d) return;
      d.x = pegarX(e);
      /* 5px de folga antes de assumir arraste: abaixo disso ainda é um clique
         (ou uma rolagem vertical começando torta). */
      if (!d.ativo && Math.abs(d.x - d.x0) > 5) {
        d.ativo = true;
        setArrastando(true);
        setSemTransicao(true);
        setPausado(true);
      }
      if (d.ativo) {
        setOffsetArraste(d.x - d.x0);
        if (e.cancelable) e.preventDefault();
      }
    };

    const fim = () => {
      const d = arrasteRef.current;
      arrasteRef.current = null;
      if (!d || !d.ativo) return;

      const delta = d.x - d.x0;
      setArrastando(false);
      setOffsetArraste(0);
      setPausado(false);

      /* 15% da largura é o limiar de commit — abaixo disso o slide volta. */
      if (Math.abs(delta) > el.clientWidth * 0.15) {
        setIndice((i) => i + (delta < 0 ? 1 : -1));
        setCiclo((c) => c + 1);
        setDirecao(delta < 0 ? 1 : -1);
      }
      setSemTransicao(false);
    };

    el.addEventListener("mousedown", inicio);
    el.addEventListener("touchstart", inicio, { passive: true });
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("mouseup", fim);
    window.addEventListener("touchend", fim);
    el.addEventListener("dragstart", (e) => e.preventDefault());

    return () => {
      el.removeEventListener("mousedown", inicio);
      el.removeEventListener("touchstart", inicio);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", fim);
      window.removeEventListener("touchend", fim);
    };
  }, []);

  /* --- roda horizontal (trackpad) ---------------------------------------- */
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    let travado = false;

    const onWheel = (e) => {
      let dx = e.deltaX;
      if (e.shiftKey && Math.abs(e.deltaY) > Math.abs(e.deltaX)) dx = e.deltaY;
      /* Só sequestra o gesto quando ele é MAIS horizontal que vertical —
         rolar a página por cima do carrossel tem que continuar rolando. */
      if (!e.shiftKey && Math.abs(dx) < Math.abs(e.deltaY)) return;
      if (Math.abs(dx) < 10) return;
      e.preventDefault();
      if (travado) return;
      travado = true;
      setIndice((i) => i + (dx > 0 ? 1 : -1));
      setCiclo((c) => c + 1);
      setDirecao(dx > 0 ? 1 : -1);
      setSemTransicao(false);
      setTimeout(() => {
        travado = false;
      }, TRANSICAO_MS + 100);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const passo = largura + gap;
  const x = -(indice * passo) + offsetArraste;

  return (
    <section className={styles.section}>
      <div className={styles.pagePadding}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.left}>
              <div className={styles.slider} ref={sliderRef}>
                <div
                  className={`${styles.slides} ${
                    arrastando ? styles.arrastando : ""
                  }`}
                  style={{
                    transform: `translate3d(${x}px, 0, 0)`,
                    transition: semTransicao
                      ? "none"
                      : `transform ${TRANSICAO_MS}ms cubic-bezier(0.45, 0, 0.55, 1)`,
                  }}
                >
                  {PISTA.map((s, i) => (
                    <div
                      key={i}
                      className={styles.slide}
                      style={largura ? { width: largura } : undefined}
                      aria-hidden={i !== indice}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.src}
                        alt={s.alt}
                        className={styles.slideImg}
                        loading={i === REAL ? "eager" : "lazy"}
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.nav}>
                <div className={styles.bars}>
                  {SLIDES.map((s, i) => (
                    <button
                      key={s.src}
                      type="button"
                      aria-label={`Slide ${i + 1}`}
                      className={`${styles.bar} ${
                        i === real ? styles.barAtiva : ""
                      }`}
                      onClick={() => ir(REAL + i, i > real ? 1 : -1)}
                    >
                      <span
                        /* A chave remonta o nó a cada troca — é o que rearma o
                           @keyframes de 5s. Sem ela a animação continuaria de
                           onde parou ao mudar de barra. */
                        key={i === real ? ciclo : "off"}
                        className={`${styles.barFill} ${
                          i === real && !semMovimento ? styles.barFillAtiva : ""
                        } ${pausado ? styles.pausado : ""}`}
                        onAnimationEnd={() => {
                          if (i === real) ir(indice + 1, 1);
                        }}
                      />
                    </button>
                  ))}
                </div>

                <div className={styles.counter}>
                  <span
                    key={numero}
                    className={`${styles.counterNum} ${
                      fase === "saindo" ? styles.counterSaindo : ""
                    } ${fase === "entrando" ? styles.counterEntrando : ""}`}
                    style={{ "--dir": String(direcao) }}
                  >
                    {numero}
                  </span>{" "}
                  / <span>{REAL}</span>
                </div>
              </div>
            </div>

            <div className={styles.right}>
              <div>
                <h2 className={styles.heading}>Your membership starts here</h2>
              </div>

              <div className={styles.bullets}>
                {BULLETS.map((b) => (
                  <div key={b} className={styles.bulletItem}>
                    <div className={styles.bulletDot} aria-hidden="true" />
                    <p className={styles.bulletText}>{b}</p>
                  </div>
                ))}
              </div>

              <div className={styles.pricing}>
                <div className={styles.price}>$199</div>
                <div className={styles.priceLabel}>
                  <p className={styles.pricePeriod}>/year*</p>
                  <p className={styles.priceBilling}>Billed annually</p>
                </div>
              </div>

              <div className={styles.ctaWrapper}>
                <div className={styles.ctaWrap}>
                  <a href="/checkout" className={styles.cta}>
                    Get started
                  </a>
                </div>

                <div className={styles.badges}>
                  {BADGES.map((b) => (
                    <div key={b.texto} className={styles.badge}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={b.icon}
                        alt=""
                        loading="lazy"
                        className={`${styles.badgeIcon} ${
                          b.menor ? styles.badgeIconMenor : ""
                        }`}
                      />
                      <div>{b.texto}</div>
                    </div>
                  ))}
                </div>
              </div>

              <p className={styles.disclaimer}>
                * Pricing may vary for members in New York and New Jersey
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
