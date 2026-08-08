"use client";

import { useEffect, useRef, useState } from "react";
import PillButton from "@/components/atoms/PillButton/PillButton";
import LogosMarquee from "@/components/organisms/LogosMarquee/LogosMarquee";
import {
  measure,
  evaluate,
  clamp,
  TIMELINE_DURATION,
  BLOCK_SHADOW,
} from "./heroTimeline";
import styles from "./Hero.module.css";

const TYPED = "What’s the impact on subscriptions from the big launch this month?";

/**
 * Hero — seção pinada com timeline dirigida por scroll.
 *
 * Camadas:    bg-home.jpg → dashboard → blocos/cursores/IA → título → logos
 * Ancoragem:  root com runway de 1.2×Q; .pin é sticky top:0
 * Driver:     offset de scroll do root, suavizado por lerp (emula scrub:0.8)
 * Pista:      Q = 1480 × scale; runway = 1.2 × Q
 * Estados:    contínuo 0..1 → t = p × 1.2 na timeline
 * Mobile:     < 1024px a animação não roda. O original serve uma composição
 *             estática (hero-medium + hero-mobile sobre bg-home-square).
 *
 * A timeline vive em heroTimeline.js — ver lá os estados e os tempos.
 */
export default function Hero() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const refs = {
    title: useRef(null),
    dashboard: useRef(null),
    pink: useRef(null),
    blue: useRef(null),
    gray: useRef(null),
    ai: useRef(null),
    aiBox: useRef(null),
    aiIcons: useRef(null),
    aiPlaceholder: useRef(null),
    aiTyped: useRef(null),
    cursorL: useRef(null),
    cursorR: useRef(null),
    logos: useRef(null),
    bg: useRef(null),
    contentStart: useRef(null),
    content: useRef(null),
  };

  const [dims, setDims] = useState({ scale: 1, yOffset: 0, containerHeight: 1480 });
  const [enabled, setEnabled] = useState(false);

  /* Medidas responsivas */
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setDims(measure(w, window.innerHeight));
      setEnabled(
        w >= 1024 &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Loop de animação */
  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    const runway = 1.2 * dims.containerHeight;
    let current = 0;
    let raf = null;

    const apply = (t) => {
      const v = evaluate(t, dims.yOffset);
      const set = (ref, css) => {
        if (ref.current) Object.assign(ref.current.style, css);
      };

      set(refs.title, {
        opacity: v.title.opacity,
        transform: `translate3d(0, ${v.title.y}px, 0) scale(${v.title.scale})`,
      });
      set(refs.dashboard, {
        opacity: v.dashboard.opacity,
        transform: `translate3d(0, ${v.dashboard.y}px, 0) scale(${v.dashboard.scale})`,
      });

      ["pink", "blue", "gray"].forEach((k) => {
        set(refs[k], {
          opacity: v[k].opacity,
          transform: `translate3d(${v[k].x}px, ${v[k].y}px, 0)`,
          "--shadow-opacity": v[k].shadow,
        });
      });

      set(refs.ai, {
        width: `${v.ai.width}px`,
        transform: `translate3d(${v.ai.x}px, ${v.ai.y}px, 0)`,
        "--shadow-opacity": v.ai.shadow,
      });
      set(refs.aiBox, {
        height: `${v.ai.height}px`,
        backgroundColor: v.ai.collapsed > 0.02 ? "#F3F3F5" : "#ffffff",
      });
      set(refs.aiIcons, { opacity: v.ai.iconsOpacity });
      set(refs.aiPlaceholder, { opacity: v.ai.placeholderOpacity });
      set(refs.aiTyped, {
        width: `${v.ai.typed * 100}%`,
        transform: `translate3d(0, ${-6 * v.ai.typed}px, 0)`,
      });

      set(refs.cursorL, {
        opacity: v.cursorL.opacity,
        transform: `translate3d(${v.cursorL.x}px, ${v.cursorL.y}px, 0)`,
      });
      set(refs.cursorR, {
        opacity: v.cursorR.opacity,
        transform: `translate3d(${v.cursorR.x}px, ${v.cursorR.y}px, 0) scale(${v.cursorR.scale})`,
      });

      set(refs.logos, { transform: `translate3d(0, ${v.logos.y}px, 0)` });
      set(refs.bg, { transform: `translate3d(0, ${v.bg.y}px, 0)` });
      set(refs.contentStart, { opacity: v.contentStart.opacity });
      set(refs.content, {
        opacity: v.content.opacity,
        transform: `translate3d(0, ${v.content.y}px, 0)`,
      });
    };

    /* scrub: 0.8 do GSAP — o progresso persegue o scroll em vez de colar
       nele. Sem isto o movimento fica duro e cada clique de roda salta. */
    const tick = () => {
      const target = clamp(-root.getBoundingClientRect().top / runway, 0, 1);
      const diff = target - current;
      current += diff * 0.12;
      apply(current * TIMELINE_DURATION);

      if (Math.abs(diff) > 0.0002) {
        raf = requestAnimationFrame(tick);
      } else {
        current = target;
        apply(current * TIMELINE_DURATION);
        raf = null;
      }
    };

    const start = () => {
      if (raf === null) raf = requestAnimationFrame(tick);
    };

    /* Estado inicial correto mesmo se a página recarregar já rolada. */
    current = clamp(-root.getBoundingClientRect().top / runway, 0, 1);
    apply(current * TIMELINE_DURATION);

    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("resize", start);
    return () => {
      window.removeEventListener("scroll", start);
      window.removeEventListener("resize", start);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, dims]); // eslint-disable-line react-hooks/exhaustive-deps

  const block = (name, ref, src, w, h, radius) => (
    <div
      ref={ref}
      className={styles.block}
      style={{ "--block-shadow": BLOCK_SHADOW, "--radius": radius }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={w} height={h} className={styles.blockImg} />
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={styles.root}
      id="top"
      style={
        enabled
          ? { height: dims.containerHeight + 1.2 * dims.containerHeight }
          : undefined
      }
    >
      <div
        className={styles.pin}
        style={enabled ? { height: dims.containerHeight } : undefined}
      >
        <div ref={refs.bg} className={styles.bg} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/bg-home.webp" alt="" className={styles.bgImg} />
        </div>

        {/* --- Palco (≥1024px) ------------------------------------------
            O título vive DENTRO do palco (top-35% de 880px), como no
            original. Só o dashboard fica em fluxo; ele define a altura de
            880px da qual todas as peças absolutas se posicionam.        */}
        <div
          ref={stageRef}
          className={styles.stage}
          style={{ transform: `translateX(-50%) scale(${dims.scale})` }}
        >
          <div ref={refs.title} className={styles.titleWrap}>
            <h1 className={`display ${styles.title}`}>
              AI analytics for faster
              <br />
              insights and <em>zero chaos</em>
            </h1>
            <p className={styles.subhead}>
              Steep is an AI analytics platform built on governed metrics that
              powers analysis, reporting and company-wide engagement.
            </p>
            <div className={styles.actions}>
              <PillButton href="#cta" variant="filled" size="regular">
                Get started
              </PillButton>
              <PillButton href="#cta" variant="soft" size="regular">
                Book a demo
              </PillButton>
            </div>
          </div>

          <div ref={refs.dashboard} className={styles.dashboard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/hero-desktop-clean.png"
              alt=""
              width={1200}
              height={880}
              className={styles.dashboardImg}
            />
            <div ref={refs.contentStart} className={styles.contentStart}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/home-content-start.png"
                alt=""
                width={906}
                height={790}
              />
            </div>
            <div ref={refs.content} className={styles.content}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/home-content.png"
                alt=""
                width={800}
                height={790}
              />
            </div>
          </div>

          {block("pink", refs.pink, "/decor/hero-pink-block.svg", 294, 235, "12px")}
          {block("blue", refs.blue, "/decor/hero-blue-block.svg", 600, 235, "12px")}
          {block("gray", refs.gray, "/decor/hero-gray-block.svg", 294, 200, "12px")}

          <div ref={refs.cursorL} className={styles.cursor}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/decor/hero-cursor-left.svg" alt="" width={61} height={67} />
          </div>

          {/* Campo de IA — vira a barra de busca do dashboard no fim. */}
          <div
            ref={refs.ai}
            className={styles.aiWrap}
            style={{ "--block-shadow": BLOCK_SHADOW, "--radius": "16px" }}
          >
            <div ref={refs.aiBox} className={styles.aiBox}>
              <div className={styles.aiTextRow}>
                <span ref={refs.aiPlaceholder} className={styles.aiPlaceholder}>
                  Ask anything...
                </span>
                <span ref={refs.aiTyped} className={styles.aiTyped}>
                  {TYPED}
                </span>
              </div>

              <div ref={refs.aiIcons} className={styles.aiIcons}>
                <div className={styles.aiTools}>
                  <span>@</span>
                  <span>
                    <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                      <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M8 7.2v4M8 4.9v.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </span>
                </div>
                <span className={styles.aiSend}>
                  <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                    <path d="M8 13V3M3.6 7.4 8 3l4.4 4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div ref={refs.cursorR} className={styles.cursor}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/decor/hero-cursor-right.svg" alt="" width={60} height={76} />
          </div>

          <div ref={refs.logos} className={styles.logos}>
            <LogosMarquee />
          </div>
        </div>

        {/* --- Composição estática < 1024px -----------------------------
            O original serve um hero completamente diferente em telas
            pequenas: sem animação, sobre bg-home-square, com os dois
            screenshots sobrepostos.                                    */}
        <div className={styles.mobileHero}>
          <div className={styles.mobileBg} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/bg-home-square.webp"
              alt=""
              className={styles.mobileBgImg}
            />
          </div>

          <div className={styles.mobileInner}>
            <h1 className={`display ${styles.mobileTitle}`}>
              AI analytics for faster
              <br />
              insights and <em>zero chaos</em>
            </h1>
            <p className={styles.mobileSubhead}>
              Steep is an AI analytics platform built on governed metrics that
              powers analysis, reporting and company-wide engagement.
            </p>
            <div className={styles.actions}>
              <PillButton href="#cta" variant="filled" size="regular">
                Get started
              </PillButton>
              <PillButton href="#cta" variant="soft" size="regular">
                Book a demo
              </PillButton>
            </div>

            <div className={styles.mobileShots} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/hero-medium.png"
                alt=""
                className={styles.mobileMedium}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/hero-mobile.png"
                alt=""
                className={styles.mobilePhone}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
