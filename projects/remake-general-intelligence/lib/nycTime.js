const HOUR_KEY = "gic-nyc-hour";
const TS_KEY = "gic-nyc-hour-ts";
const CACHE_MS = 5 * 60 * 1000;

/** NYC hour → spring-hero index (1–4), matching original site logic. */
export function getHeroImageIndex(hour) {
  if (hour >= 6 && hour < 9) return 1;
  if (hour >= 9 && hour < 16) return 2;
  if (hour >= 16 && hour < 18) return 3;
  return 4;
}

/** NYC hour → footer landscape (2–4). */
export function getFooterImageIndex(hour) {
  if (hour >= 6 && hour < 17) return 2;
  if (hour >= 17 && hour < 21) return 3;
  return 4;
}

export function getNYCHour(date = new Date()) {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      hour12: false,
    }).format(date)
  );
}

export function formatNYCTime(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  }).format(date);
}

/** Degrees for the decorative clock hand (NYC time). */
export function getClockRotation(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(date);

  const hour = Number(parts.find((p) => p.type === "hour")?.value || 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value || 0);
  return ((hour % 12) + minute / 60) * 30;
}

export function readCachedNYCHour() {
  if (typeof window === "undefined") return null;
  const hour = localStorage.getItem(HOUR_KEY);
  const ts = localStorage.getItem(TS_KEY);
  if (!hour || !ts) return null;
  if (Date.now() - Number(ts) > CACHE_MS) return null;
  return Number(hour);
}

export function writeCachedNYCHour(hour) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HOUR_KEY, String(hour));
  localStorage.setItem(TS_KEY, String(Date.now()));
}
