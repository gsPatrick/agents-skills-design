"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./NavMenu.module.css";

/**
 * NavMenu — painel que desliza da direita.
 *
 * Camadas:   overlay escuro → painel branco
 * Montagem:  PORTAL no body — dentro do nav fixed o `bottom: 0` mediria a
 *            altura do nav, não a da viewport
 * Driver:    clique no hambúrguer
 * Estados:   fechado → is-open
 *
 * Do CSS original:
 *   .sp-navbar3_menu          width 32rem, height 100vh, padding 1.5rem
 *                             gap 1rem, radius 1.5rem (só à esquerda)
 *                             backdrop-filter blur(1.5rem)
 *                             right 0, translateX(100%) → 0
 *                             transition transform .3s cubic-bezier(.16,1,.3,1)
 *                             visibility hidden, pointer-events none
 *   .sp-navbar3_menu-title    2rem / lh 2.375rem / ls −.04rem
 *   .sp-navbar3_menu-nav-link idem título — a navegação TEM o peso do título
 *   .sp-navbar3_menu-label    opacity .5, .875rem
 *   .sp-navbar3_menu-cta      #18181b, pílula, padding .75rem 1.25rem
 *   .sp-navbar3_menu-close    3rem, circular
 *   .sp-navbar3_overlay       rgba(0,0,0,.5), z-index 1001
 *
 * Desliza por TRANSFORM, não por `right`. `right` anima layout a cada
 * frame; `translateX` é composto na GPU. O `will-change: transform` avisa
 * o navegador antes.
 *
 * `visibility: hidden` + `pointer-events: none` no estado fechado: sem
 * isso o painel continua clicável fora da tela e captura foco de teclado.
 *
 * Dois detalhes de acabamento:
 *   · cada link do menu ganha um TRAÇO de 0.5rem à esquerda no hover,
 *     animado em `width` — o item aponta para si mesmo
 *   · os IRMÃOS caem para opacity .5 quando um recebe hover (`:has`),
 *     então o foco vem do contraste, não de destacar o alvo
 */
const NAV = [
  ["What we test", "/biomarkers"],
  ["How it works", "/how-it-works"],
  ["FAQ", "/faqs"],
  ["Reviews", "/reviews"],
  ["About", "/manifesto"],
  ["Gift health", "/gift"],
];

const COLS = [
  ["Compare", [
    ["vs Function Health", "/superpower-vs-function-health"],
    ["vs Mito Health", "/superpower-vs-mito-health"],
    ["vs InsideTracker", "/superpower-vs-insidetracker"],
  ]],
  ["Company", [
    ["Blog", "/blog"],
    ["For Teams", "/organizations"],
    ["Careers", "/careers"],
    ["Superpower Labs", "https://healthiesthoodie.com/"],
  ]],
];

export default function NavMenu({ aberto, onFechar }) {
  /* PORTAL para o body: o nav é `position: fixed` e vira o bloco que contém
     o painel, então `bottom: 0` media a altura do NAV (76px), não a da
     viewport — o menu saía cortado no topo.

     O original resolve igual, movendo o menu com
     `document.body.appendChild(menu)` no script. */
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  /* Trava o scroll do body e fecha no Escape. */
  useEffect(() => {
    if (!aberto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onFechar();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener("keydown", onKey);
    };
  }, [aberto, onFechar]);

  const conteudo = (
    <>
      <div
        className={`${styles.overlay} ${aberto ? styles.overlayOn : ""}`}
        onClick={onFechar}
        aria-hidden="true"
      />

      <aside
        className={`${styles.menu} ${aberto ? styles.isOpen : ""}`}
        aria-label="Menu"
        aria-hidden={!aberto}
      >
        <div className={styles.top}>
          <h3 className={styles.title}>Menu</h3>
          <div className={styles.actions}>
            <a href="https://app.superpower.com/" className={styles.login}>
              Log in
            </a>
            <a href="/checkout" className={styles.cta}>
              Be a member
            </a>
            <button
              type="button"
              className={styles.close}
              onClick={onFechar}
              aria-label="Fechar menu"
            >
              {/* Quatro pontos nos cantos — o hambúrguer de nove com o
                  miolo e as bordas retirados vira um "x" implícito. */}
              <span className={styles.closeIcon}>
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={styles.dot} />
                ))}
              </span>
            </button>
          </div>
        </div>

        <nav className={styles.nav}>
          <p className={styles.label}>Explore</p>
          {NAV.map(([t, href]) => (
            <a key={t} href={href} className={styles.navLink}>
              {t}
            </a>
          ))}
        </nav>

        <div className={styles.spacer} />

        <div className={styles.footer}>
          {COLS.map(([label, itens]) => (
            <div key={label} className={styles.col}>
              <p className={styles.colLabel}>{label}</p>
              {itens.map(([t, href]) => (
                <a key={t} href={href} className={styles.colLink}>
                  {t}
                </a>
              ))}
            </div>
          ))}
        </div>
      </aside>
    </>
  );

  if (!montado) return null;
  return createPortal(conteudo, document.body);
}
