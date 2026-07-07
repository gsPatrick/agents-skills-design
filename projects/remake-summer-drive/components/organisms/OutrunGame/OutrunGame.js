"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createRacer } from "./engine";
import styles from "./OutrunGame.module.css";

const PLAYER_NAMES = [
  "straight",
  "left",
  "right",
  "up",
  "upleft",
  "upright",
  "straight-brake",
  "left-brake",
  "right-brake",
  "up-brake",
  "upleft-brake",
  "upright-brake",
];

const CAR_NAMES = [
  "outgoing1",
  "outgoing2",
  "outgoing3",
  "outgoing4",
  "outgoing5",
  "outgoing6",
  "outgoing7",
  "oncoming1",
  "oncoming2",
  "oncoming3",
  "oncoming4",
  "oncoming5",
  "oncoming6",
  "oncoming7",
];

const CATEGORY_WIDTH = { player: 80, tree: 200, sign: 240, car: 60 };

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load " + src));
    img.src = src;
  });
}

export default function OutrunGame() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const racerRef = useRef(null);

  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [lives, setLives] = useState(3);
  const [timeStr, setTimeStr] = useState("00:00");
  const [crashCount, setCrashCount] = useState(0);

  useEffect(() => {
    let destroyed = false;

    async function boot() {
      const [playerImgs, carImgs, treeImg, signImg, bgImg] = await Promise.all([
        Promise.all(PLAYER_NAMES.map((n) => loadImage(`/outrun/${n}.png`))),
        Promise.all(CAR_NAMES.map((n) => loadImage(`/outrun/${n}.png`))),
        loadImage("/outrun/tree.png"),
        loadImage("/outrun/sign.png"),
        loadImage("/outrun/background.jpg"),
      ]);

      if (destroyed) return;

      const descriptor = (img, catW) => ({
        img,
        w: catW,
        h: catW * (img.naturalHeight / img.naturalWidth),
      });

      const sprites = {};
      PLAYER_NAMES.forEach((name, i) => {
        sprites[name] = descriptor(playerImgs[i], CATEGORY_WIDTH.player);
      });
      sprites.tree = descriptor(treeImg, CATEGORY_WIDTH.tree);
      sprites.sign = descriptor(signImg, CATEGORY_WIDTH.sign);

      const carSprites = carImgs.map((img) =>
        descriptor(img, CATEGORY_WIDTH.car)
      );

      const audio = new window.Audio("/outrun/radio.mp3");
      audio.loop = true;
      audio.volume = 0.55;
      audioRef.current = audio;

      setLoaded(true);

      racerRef.current = createRacer({
        canvas: canvasRef.current,
        sprites,
        carSprites,
        background: bgImg,
        onFirstInput: () => {
          setStarted(true);
          audio.play().catch(() => {});
        },
        hud: {
          setTime: (t) => setTimeStr(t),
          setLives: (n) => setLives(n),
          crash: () => setCrashCount((c) => c + 1),
          gameOver: () => setCrashCount((c) => c + 1),
        },
      });
    }

    boot();

    return () => {
      destroyed = true;
      if (racerRef.current) racerRef.current.destroy();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const hearts = [0, 1, 2].map((i) => (
    <span key={i} className={styles.heart}>
      {i < lives ? "\u2665" : "\u2661"}
    </span>
  ));

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.game}>
          <canvas ref={canvasRef} className={styles.canvas} />
        </div>
      </div>

      <Link href="/summer-drive" className={styles.title} aria-label="The Summer Drive">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 542 98">
          <path
            fill="#006EFF"
            d="M19.6962 43.3541h12.7789V11.7146h18.6962V1.31513H1V11.7146h18.6962v31.6395zM54.7979 43.3541h12.7789V27.2822h29.083v16.0719h12.7792V1.31513H96.6598V16.8828h-29.083V1.31513H54.7979V43.3541zM114.035 1.31513V43.3541h46.961v-9.517h-34.371v-7.4372h31.979v-8.3196h-31.979v-7.2481h33.93V1.31513h-46.52zM172.924 29.9294c-.063.8824-.063 1.7017-.063 2.0799 0 4.9791 1.322 8.1935 3.903 9.454 3.714 1.8908 6.924 2.206 21.466 2.206 9.128 0 15.36-.3782 18.507-1.0715 6.169-1.3236 8.436-4.727 8.436-12.4793 0-8.4457-3.148-11.9752-11.143-12.3533-2.14-.1261-7.805-.3152-8.938-.3152h-11.898c-4.155-.063-4.407-.126-5.162-.3151-1.825-.4412-2.707-1.5757-2.707-3.3404 0-2.395 1.133-3.2774 4.533-3.5295 2.014-.1261 7.491-.2521 11.582-.2521 8.247 0 9.506.5042 9.506 4.1597h12.464c0-6.30266-.944-8.88677-3.84-10.8406C216.549 1.37816 213.149 1 198.419 1c-9.191 0-14.101.31513-17.5 1.19751-6.044 1.44962-8.184 4.664-8.184 12.22719 0 5.7355 1.385 9.0759 4.407 10.6516 2.707 1.3866 5.917 1.8278 13.66 1.8278h11.583c6.61.063 6.609.063 7.994.5042 1.322.4412 2.141 1.7017 2.141 3.4035 0 3.4664-1.763 3.9076-16.556 3.9076-4.029 0-7.617-.2521-8.561-.6302-1.511-.5673-1.826-1.2606-1.952-4.1598h-12.527zM228.483 1.31513V23.9418c0 5.9246.252 8.6347.944 11.0297 1.133 3.9707 3.903 6.4918 8.499 7.7524 2.706.7563 6.798 1.0084 17.248 1.0084 7.68 0 13.156-.1261 14.919-.4412 5.54-.8194 9.191-3.3404 10.953-7.4372 1.008-2.395 1.259-4.8531 1.259-12.4793V1.31513h-12.778V20.6014c0 4.664 0 4.664-.063 5.6094-.063 3.2144-.693 5.0421-1.952 5.9875-1.574 1.1976-4.218 1.4497-13.786 1.4497-7.806 0-10.576-.7564-11.646-3.1514-.818-1.8908-.818-1.8908-.818-10.9036V1.31513h-12.779zM286.804 43.3541h12.338l-.378-32.4589 18.319 32.4589h10.198l18.633-32.4589-.629 32.4589h12.464V1.31513h-20.144L322.371 29.2361 307.074 1.31513h-20.27V43.3541zM362.393 43.3541h12.339l-.378-32.4589 18.318 32.4589h10.198l18.634-32.4589-.63 32.4589h12.464V1.31513h-20.144L397.96 29.2361 382.663 1.31513h-20.27V43.3541zM437.983 1.31513V43.3541h46.961v-9.517h-34.371v-7.4372h31.979v-8.3196h-31.979v-7.2481h33.93V1.31513h-46.52zM488.122 43.3541h12.716V32.7656h19.577c3.463 0 4.47.126 5.477.8193 1.133.8194 1.574 2.143 1.574 4.538v5.2312h12.967v-6.6178c0-3.5925-.503-5.4834-1.762-6.933-1.259-1.5126-2.896-2.0168-7.302-2.2689-.315 0-1.134-.0631-2.078-.1261 5.666-.8194 7.617-1.4496 9.065-2.9623 1.826-1.9538 2.644-4.9791 2.644-9.517 0-6.55484-1.7-10.39949-5.351-12.10122-2.455-1.13448-5.288-1.51265-11.331-1.51265h-36.196V43.3541zm12.716-20.8619V11.6516h20.396c3.84 0 4.91.189 5.854 1.1975.818.8823 1.07 2.0168 1.07 4.727 0 4.1598-1.196 4.9161-7.365 4.9161h-19.955z"
          />
        </svg>
      </Link>

      <div className={styles.health}>{hearts}</div>
      <div className={styles.clock}>{timeStr}</div>

      <div
        className={`${styles.radioContainer} ${started ? styles.radioOn : ""}`}
      >
        <p className={styles.radioLabel}>Radio</p>
        <p className={styles.nowPlaying}>Fury Weekend &mdash; 12 To Midnight</p>
      </div>

      {crashCount > 0 && <div key={crashCount} className={styles.crash} />}

      {!started && (
        <div className={styles.intro}>
          <p className={styles.introTitle}>
            {loaded ? "Press an arrow key to drive" : "Loading\u2026"}
          </p>
          {loaded && (
            <ul className={styles.introControls}>
              <li>
                <span>&uarr;</span> Accelerate
              </li>
              <li>
                <span>&darr;</span> Brake
              </li>
              <li>
                <span>&larr; &rarr;</span> Steer
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
