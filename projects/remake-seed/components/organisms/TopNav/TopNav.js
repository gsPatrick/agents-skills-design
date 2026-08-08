"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/atoms/Logo/Logo";
import PillButton from "@/components/atoms/PillButton/PillButton";
import styles from "./TopNav.module.css";

const LINKS = [
  { label: "Shop", href: "#shop" },
  { label: "Science", href: "#science" },
  { label: "Learn", href: "#learn" },
];

/**
 * TopNav — a faixa do header.
 *
 * Camadas:   uma
 * Ancoragem: STICKY — `top: 8px`, `z-index: 10` (medido no original). Em
 *            repouso fica em y=40, abaixo da barra de anúncio; ao rolar,
 *            cola em y=8 e acompanha a página inteira.
 * Driver:    scroll > 0 alterna para o estado de vidro
 * Estados:   DOIS —
 *
 *   repouso (scrollY = 0)   fundo transparente, sem blur, texto ink
 *   vidro   (scrollY > 0)   rgba(87,94,85,0.35) + blur(19px)
 *                           radius 1000px, texto paper
 *
 * O mesmo rgba(87,94,85,0.35) do card da ViaCap — é o token
 * --color-neutral-frosted-glass-35 do design system deles, reaproveitado.
 * O blur aqui é 19px contra os 37.5px do card: menos difusão porque a
 * pílula é pequena e precisa manter os links legíveis.
 *
 * A transição é `background-color 0.3s ease-in-out, color 0.3s` — só cor,
 * sem mexer em forma ou posição.
 *
 * Medido em 1440px:
 *   faixa        16,40,1416,56  transparente
 *   logo         48,58,64,20    20px / 300
 *   Shop         128,54,55,28   14px / 400, padding 7px 10.5px
 *   Science      202,54,73,28
 *   Learn        294,54,57,28
 *   Sign in      1241,54,72,28  padding 7px 14px
 *   Get Started  1313,47,113,43 radius 1000px
 *
 * A faixa começa em x=16 e mede 1416 = viewport − 32. É inset de 16px,
 * não container centralizado com max-width.
 */
export default function TopNav() {
  const [vidro, setVidro] = useState(false);

  useEffect(() => {
    const onScroll = () => setVidro(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.nav}>
      {/* O vidro envolve SÓ o logo + menu: 375px começando em x=16. O bloco
          Sign in / Get Started fica fora, com fundo próprio. Aplicar o vidro
          na faixa inteira vira uma barra de ponta a ponta, não uma pílula. */}
      <div className={`${styles.glass} ${vidro ? styles.vidro : ""}`}>
        <a href="#top" className={styles.logoLink}>
          <Logo label="Home" />
        </a>

        <ul className={styles.menu}>
        {LINKS.map((l) => (
          <li key={l.label}>
            <a className={styles.menuItem} href={l.href}>
              {l.label}
            </a>
          </li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        <PillButton href="#signin" variant="text">
          Sign in
        </PillButton>
        <PillButton href="#start" variant="solid">
          Get Started
        </PillButton>
      </div>
    </div>
  );
}
