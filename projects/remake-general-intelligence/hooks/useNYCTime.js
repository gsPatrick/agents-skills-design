"use client";

import { useEffect, useState } from "react";
import {
  formatNYCTime,
  getClockRotation,
  getFooterImageIndex,
  getHeroImageIndex,
  getNYCHour,
  readCachedNYCHour,
  writeCachedNYCHour,
} from "@/lib/nycTime";

export default function useNYCTime() {
  const [hour, setHour] = useState(null);
  const [timeLabel, setTimeLabel] = useState("");
  const [clockRotation, setClockRotation] = useState(0);

  useEffect(() => {
    const sync = () => {
      const now = new Date();
      const h = getNYCHour(now);
      setHour(h);
      setTimeLabel(formatNYCTime(now));
      setClockRotation(getClockRotation(now));
      writeCachedNYCHour(h);
    };

    const cached = readCachedNYCHour();
    if (cached !== null) {
      setHour(cached);
      sync();
    } else {
      sync();
    }

    const id = setInterval(sync, 60000);
    return () => clearInterval(id);
  }, []);

  const heroIndex = hour === null ? 2 : getHeroImageIndex(hour);
  const footerIndex = hour === null ? 2 : getFooterImageIndex(hour);

  return {
    hour,
    timeLabel,
    clockRotation,
    heroSrc: `/images/spring-hero-${heroIndex}.avif`,
    footerSrc: `/images/footer-${footerIndex}.png`,
  };
}
