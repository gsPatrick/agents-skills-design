"use client";

import { useEffect, useRef } from "react";

export default function DriveVideo() {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // React/Next SSR doesn't always emit the `muted` attribute in the
    // server HTML, so iOS Safari sees a non-muted video and blocks autoplay.
    // Forcing the property here (plus the attributes below) is what makes it
    // start on its own on iPhone/Safari without a tap.
    video.muted = true;
    video.defaultMuted = true;

    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);

    // Last-resort fallback: if the browser still refused (e.g. Low Power
    // Mode), kick off playback on the very first user interaction.
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
      src="/Drive-Car.mp4"
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
