"use client";

import { useEffect, useRef } from "react";
import { PIXEL_FLOWER_RECTS } from "./pixelFlowerData";
import styles from "./PixelFlower.module.css";

function shuffleGroups(items, groupCount = 8) {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  const size = Math.ceil(shuffled.length / groupCount);
  const groups = [];
  for (let i = 0; i < groupCount; i++) {
    groups.push(shuffled.slice(i * size, (i + 1) * size));
  }
  return groups;
}

export default function PixelFlower() {
  const svgRef = useRef(null);
  const playedRef = useRef(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || playedRef.current) return;

    const rects = Array.from(svg.querySelectorAll("rect"));
    rects.forEach((rect) => {
      rect.style.opacity = "0";
    });

    const groups = shuffleGroups(rects);
    let cancelled = false;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || playedRef.current || cancelled) return;
        playedRef.current = true;

        groups.forEach((group, groupIndex) => {
          group.forEach((rect, rectIndex) => {
            const delay = groupIndex * 80 + rectIndex * 10;
            window.setTimeout(() => {
              if (!cancelled) rect.style.opacity = "1";
            }, delay);
          });
        });

        obs.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    obs.observe(svg);
    return () => {
      cancelled = true;
      obs.disconnect();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className={styles.flower}
      viewBox="0 0 291 467"
      fill="none"
      aria-hidden="true"
    >
      {PIXEL_FLOWER_RECTS.map((p, i) => (
        <rect
          key={i}
          x={p.x}
          y={p.y}
          width={p.w}
          height={p.h}
          fill={p.c}
          style={{ opacity: 0, transition: "opacity 0.2s ease" }}
        />
      ))}
    </svg>
  );
}
