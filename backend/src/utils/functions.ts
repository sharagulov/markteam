export function formatTimeAgo(ms: number): string {
  const now = Date.now();
  const diff = now - ms;

  const MIN = 60 * 1000;
  const HOUR = 60 * MIN;
  const DAY = 24 * HOUR;
  const YEAR = 365 * DAY;

  const plural = (num: number, word: string) =>
    `${num} ${word}${num === 1 ? "" : "s"} ago`;

  if (diff < HOUR) {
    const mins = Math.floor(diff / MIN) || 1;
    return plural(mins, "minute");
  }

  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return plural(hours, "hour");
  }

  if (diff < YEAR) {
    const days = Math.floor(diff / DAY);
    return plural(days, "day");
  }

  const years = Math.floor(diff / YEAR);
  return plural(years, "year");
}
