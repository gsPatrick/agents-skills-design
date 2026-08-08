"use client";

import { useEffect, useState } from "react";
import NavMenu from "@/components/organisms/NavMenu/NavMenu";
import { LOGO_PATH } from "./logoPath";
import styles from "./NavBar.module.css";

/**
 * NavBar — morph ao rolar.
 *
 * Camadas:   uma
 * Ancoragem: fixed, z-index 9999
 * Driver:    scrollY > 50 (só em ≥992px)
 * Estados:   DOIS
 *
 *   repouso     wrapper padding 1.5rem 4.5rem
 *               inner transparente, sem blur, sem raio
 *               left 28rem · right 25.5rem
 *               links #18181b · CTA preto/texto branco
 *               logo escala 1
 *
 *   is-scrolled wrapper padding 1rem 4.5rem
 *               inner rgba(0,0,0,.6) + blur(1.5rem), pílula
 *                     padding .375rem .375rem .375rem 1.5rem
 *                     max-width 56rem · gap 4rem
 *               links BRANCOS · CTA branco/texto #18181b
 *               logo scale(0.75)
 *               hambúrguer 3.0625rem, pílula escura, pontos brancos
 *
 * Tudo em 0.25s cubic-bezier(0.16, 1, 0.3, 1).
 *
 * O logo é `position: absolute` centrado no desktop — assim ele NÃO se
 * desloca quando os flancos mudam de largura no morph. É o que permite
 * animar `left`/`right` sem o wordmark tremer.
 *
 * O gatilho é 50px, não 0: rolagens acidentais de poucos pixels não
 * disparam a troca.
 */
const ESQ = [
  ["What we test", "/biomarkers"],
  ["Reviews", "/reviews"],
  ["FAQs", "/faqs"],
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth < 992) {
        setScrolled(false);
        return;
      }
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={styles.component}>
      <div className={`${styles.wrapper} ${scrolled ? styles.isScrolled : ""}`}>
        <a href="/" className={styles.logo} aria-label="Superpower — Home">
          <svg viewBox="0 0 169 23" className={styles.logoImg} fill="currentColor" role="img" aria-label="Superpower">
            <path d={LOGO_PATH} />
          </svg>
        </a>

        <div className={styles.inner}>
          <div className={styles.left}>
            {ESQ.map(([t, href]) => (
              <a key={t} href={href} className={styles.link}>
                {t}
              </a>
            ))}
          </div>

          <div className={styles.right}>
            <a href="https://app.superpower.com/" className={`${styles.link} ${styles.login}`}>
              Log in
            </a>
            <a href="/checkout" className={styles.cta}>
              Become&nbsp;a member
            </a>
          </div>
        </div>

        <button
          type="button"
          className={styles.hamburger}
          aria-label="Menu"
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto(true)}
        />
      </div>

      <NavMenu aberto={menuAberto} onFechar={() => setMenuAberto(false)} />
    </div>
  );
}
