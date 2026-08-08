"use client";

import { useEffect, useRef, useState } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import styles from "./RivePanel.module.css";

/**
 * Painel Rive — os visuais das abas do Engage e do Semantic platform.
 *
 * Não são vídeos nem screenshots: o original carrega UM arquivo
 * (/animations/global-animations.riv, 3.2MB) com um artboard por aba:
 * AI · Explore-line · Reports · Drill-down · Targets · Maps
 *
 * Só monta quando entra na viewport (o original faz igual, com lazy +
 * IntersectionObserver) — 3.2MB no carregamento inicial seria inaceitável.
 *
 * O artboard só toca quando é o ativo; nos demais fica parado no frame 0
 * para não gastar CPU com seis canvases animando fora de vista.
 */
export default function RivePanel({ artboard, active }) {
  const hostRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMounted(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={styles.host}>
      {mounted ? <Canvas artboard={artboard} active={active} /> : null}
    </div>
  );
}

function Canvas({ artboard, active }) {
  const { rive, RiveComponent } = useRive({
    src: "/animations/global-animations.riv",
    artboard,
    autoplay: false,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.TopCenter }),
  });

  useEffect(() => {
    if (!rive) return;
    if (active) {
      rive.reset({ artboard });
      rive.play();
    } else {
      rive.pause();
    }
  }, [rive, active, artboard]);

  return <RiveComponent className={styles.canvas} />;
}
