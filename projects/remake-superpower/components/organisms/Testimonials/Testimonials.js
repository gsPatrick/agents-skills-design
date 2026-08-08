"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Testimonials.module.css";

/**
 * Testimonials — "Changing outcomes and lives across the nation"
 *
 * Camadas:   uma
 * Driver:    índice do slide (clique nos bullets ou arrasto)
 * Estados:   ativo / inativo por slide
 *
 * Do CSS original:
 *   .sp2-testimonials2        padding 7.5rem 0, gap 4rem, bg secundário
 *   .__header                 max-width 39rem
 *   .__card                   width 45.8rem, border-right 1px #18181b1a
 *   .__card-media             height 20rem, radius .5rem
 *   .__card-image             object-position 0% 50%   ← ancora à ESQUERDA
 *   .__track                  transition transform .75s
 *                             cubic-bezier(.45, 0, .55, 1)
 *   .__slide                  opacity .5 · --active opacity 1
 *   .__bullet                 flex 1 1 0, height .25rem, opacity .2
 *   .__bullet--active         opacity 1, FLEX-GROW 6
 *
 * Os BULLETS não são pontos: são barras que dividem a largura por
 * `flex: 1 1 0`, e a ativa cresce para `flex-grow: 6`. A barra vira uma
 * régua de progresso onde o trecho atual ocupa seis vezes mais espaço —
 * mostra posição E quantidade no mesmo elemento.
 *
 * Os slides inativos ficam a `opacity: .5`. Combinado com o card que sangra
 * (45.8rem numa faixa mais estreita), o próximo depoimento aparece
 * apagado na borda: dá para ler que existe sem competir com o atual.
 *
 * `object-position: 0% 50%` nas fotos — ancoradas à ESQUERDA, não
 * centralizadas. Como os retratos têm a pessoa à esquerda do quadro, o
 * corte à direita nunca remove o rosto.
 *
 * A curva `cubic-bezier(.45, 0, .55, 1)` é quase simétrica (ease-in-out
 * suave), diferente do expo-out usado no resto da página. Slide de
 * carrossel pede aceleração e freio parelhos.
 */
const DEPOIMENTOS = [
  {
    nome: "Camelia, 29",
    citacao:
      "“I left the appointment feeling like I was being dramatic. I wasn't being dramatic. I was being responsible.”",
    legenda:
      "Doctors refused to test her fertility, so she took control of her health",
  },
  {
    nome: "Thach, 37",
    citacao:
      "“They told me I was overthinking my genetic risk of diabetes but when I tested with Superpower I found my A1c was really high.”",
    legenda: "His Superpower test caught risks that two doctors missed",
  },
  {
    nome: "Carissa, 38",
    citacao:
      "“I spent almost a year thinking something was wrong with me.”",
    legenda:
      "Uncovered the hormone imbalances behind bloating and weight gain",
  },
  {
    nome: "Teva, 28 and Cole, 29",
    citacao:
      "“I got my boyfriend a Superpower blood test. And it opened his eyes.”",
    legenda: "The gift that changed how they think and talk about health",
  },
  {
    nome: "Joel, 55",
    citacao:
      "“I was putting in so much effort to improve my health. But nothing was working.”",
    legenda:
      "Superpower gave him a supplement plan that saved him time and money",
  },
];

export default function Testimonials() {
  const N = DEPOIMENTOS.length;
  const DURACAO = 8000;   /* medido: `var duration = 8000` */
  const TRANSICAO = 750;  /* `var transitionMs = 750` */

  /* TRÊS CÓPIAS dos slides — clones antes E depois dos originais. O índice
     começa na cópia do MEIO, então dá para ir e voltar sem chegar na borda.
     Depois de cada transição o índice é normalizado de volta ao meio, sem
     animação. Com uma cópia só (o que eu tinha feito) o loop fecha, mas
     voltar do primeiro slide não tem para onde ir. */
  const slides = Array.from({ length: N * 3 }, (_, i) => DEPOIMENTOS[i % N]);
  const [atual, setAtual] = useState(N);
  const [semTransicao, setSemTransicao] = useState(false);

  const trackRef = useRef(null);
  const restante = useRef(DURACAO);
  const ultimoTick = useRef(0);
  const timer = useRef(null);
  const [pausado, setPausado] = useState(false);
  const arraste = useRef({ ativo: false, x: 0 });

  const real = ((atual % N) + N) % N;

  /* Posiciona o trilho pelo offsetLeft do slide, não por largura × índice —
     assim margens irregulares não acumulam erro. */
  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const el = t.children[atual];
    if (!el) return;
    t.style.transition = semTransicao
      ? "none"
      : `transform ${TRANSICAO / 1000}s cubic-bezier(0.45, 0, 0.55, 1)`;
    t.style.transform = `translate3d(${-el.offsetLeft}px, 0, 0)`;
  }, [atual, semTransicao]);

  /* Normaliza de volta à cópia do meio depois que a transição acaba. */
  useEffect(() => {
    const t = setTimeout(() => {
      let s = atual;
      while (s >= 2 * N) s -= N;
      while (s < N) s += N;
      if (s !== atual) {
        setSemTransicao(true);
        setAtual(s);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setSemTransicao(false))
        );
      }
    }, TRANSICAO + 20);
    return () => clearTimeout(t);
  }, [atual, N]);

  /* AUTOPLAY com barra de progresso. O `restante` guarda quanto falta, então
     ao voltar do hover o preenchimento continua de onde parou em vez de
     recomeçar. */
  useEffect(() => {
    clearTimeout(timer.current);
    if (pausado) {
      const passou = Date.now() - ultimoTick.current;
      restante.current = Math.max(50, restante.current - passou);
      return;
    }
    ultimoTick.current = Date.now();
    timer.current = setTimeout(() => {
      restante.current = DURACAO;
      setAtual((a) => a + 1);
    }, restante.current);
    return () => clearTimeout(timer.current);
  }, [atual, pausado]);

  const irPara = (i) => {
    restante.current = DURACAO;
    setAtual(N + i);
  };

  const inicio = (e) => {
    arraste.current = { ativo: true, x: e.pageX };
    setPausado(true);
  };
  const fim = (e) => {
    if (!arraste.current.ativo) {
      setPausado(false);
      return;
    }
    const d = e.pageX - arraste.current.x;
    arraste.current.ativo = false;
    if (Math.abs(d) >= 60) {
      restante.current = DURACAO;
      setAtual((a) => a + (d < 0 ? 1 : -1));
    }
    setPausado(false);
  };

  return (
    <section className={styles.section}>
      <div className={styles.pagePadding}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.rating}>
              <p>4.6 out of 5</p>
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none" aria-hidden="true">
                <path
                  d="M20.2924 7.37117H12.54L10.1536 6.86646e-05L7.75307 7.37117L0.00069809 7.35705L6.27037 11.9181L3.86982 19.2892L10.1395 14.7282L16.4092 19.2892L14.0227 11.9181L20.2924 7.37117Z"
                  fill="#00B67A"
                />
                <path
                  d="M14.5597 13.5843L14.0231 11.918L10.154 14.7281L14.5597 13.5843Z"
                  fill="#005128"
                />
              </svg>
              <p>Trustpilot</p>
            </div>
            <h2 className={styles.h2}>
              Changing outcomes and lives across the nation
            </h2>
            <p className={styles.sub}>
              60% of members said Superpower identified something previously
              missed or overlooked by a doctor.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.slider}>
        <div className={styles.swiper}>
          <div
            ref={trackRef}
            className={styles.track}
            onMouseDown={inicio}
            onMouseUp={fim}
            onMouseLeave={fim}
            onMouseEnter={() => setPausado(true)}
          >
            {slides.map((d, i) => {
              return (
              <div
                key={i}
                className={`${styles.slide} ${
                  ((i % N) + N) % N === real ? styles.slideActive : ""
                }`}
                aria-hidden={i !== atual}
              >
                <article className={styles.card}>
                  <div className={styles.cardMedia}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/media/tst-${(i % N) + 1}.avif`}
                      alt=""
                      className={styles.cardImage}
                      draggable={false}
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <p className={styles.cardName}>{d.nome}</p>
                    <p className={styles.cardQuote}>{d.citacao}</p>
                    <p className={styles.cardCaption}>{d.legenda}</p>
                  </div>
                </article>
              </div>
              );
            })}
          </div>
        </div>

        <div className={styles.navWrap}>
          <div className={styles.nav}>
            {/* Barras, não pontos: dividem a largura e a ativa cresce 6×. */}
            <div className={styles.pagination}>
              {DEPOIMENTOS.map((d, i) => (
                <button
                  key={d.nome}
                  type="button"
                  className={`${styles.bullet} ${
                    i === real ? styles.bulletActive : ""
                  }`}
                  onClick={() => irPara(i)}
                  onMouseEnter={() => setPausado(true)}
                  onMouseLeave={() => setPausado(false)}
                  aria-label={`Depoimento ${i + 1}`}
                >
                  {/* O "arrego": preenche 0 → 100% em 8s e então avança.
                      `linear`, não eased — é relógio, e relógio não acelera. */}
                  <span
                    className={styles.bulletFill}
                    style={
                      i === real
                        ? {
                            width: "100%",
                            transition: `width ${restante.current}ms linear`,
                          }
                        : { width: "0%", transition: "none" }
                    }
                  />
                </button>
              ))}
            </div>
            <p className={styles.counter}>
              {real + 1}/{N}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
