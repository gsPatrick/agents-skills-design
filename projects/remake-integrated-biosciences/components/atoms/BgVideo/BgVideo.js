"use client";

import { useEffect, useRef } from "react";

/** Autoplaying, muted, looping background video with a reliable iOS start. */
export default function BgVideo({ src, className = "", style }) {
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
    window.addEventListener("touchstart", onFirstInteraction, { passive: true });
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
      className={className}
      style={style}
      src={src}
      autoPlay
      playsInline
      loop
      muted
      preload="auto"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
