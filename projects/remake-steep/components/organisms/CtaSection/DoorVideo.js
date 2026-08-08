"use client";

import { useEffect, useRef } from "react";
import styles from "./CtaSection.module.css";

/**
 * Vídeo de fechamento — recipe: recipes/video-autoplay-ios
 *
 * As quatro camadas de defesa, porque só os atributos JSX não bastam:
 *  1. playsInline (sem ele o iOS abre em tela cheia)
 *  2. muted forçado na PROPRIEDADE — o React não emite o atributo no HTML
 *     do servidor, o Safari lê o SSR sem `muted` e bloqueia o autoplay
 *  3. .play() com .catch() + listener de loadeddata para a corrida
 *  4. fallback na primeira interação (Modo de Baixo Consumo bloqueia tudo)
 */
export default function DoorVideo() {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);

    const onFirstInteraction = () => {
      tryPlay();
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
    };
    window.addEventListener("touchstart", onFirstInteraction, {
      passive: true,
    });
    window.addEventListener("click", onFirstInteraction);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
    };
  }, []);

  return (
    <video
      ref={ref}
      src="/videos/door.mp4"
      className={styles.previewImage}
      autoPlay
      playsInline
      loop
      muted
      preload="metadata"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
