import type { StoredEvent } from "./types";

const TIME_ZONE = "Asia/Tokyo";
const MAX_NAMES = 3;

/** Today's date in Japan as YYYY-MM-DD, regardless of the server's time zone. */
export function todayInJst(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function toUtcMs(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Whole days from `today` until `date` (0 = today, 1 = tomorrow, negative = past). */
export function daysUntil(today: string, date: string): number {
  return Math.round((toUtcMs(date) - toUtcMs(today)) / 86_400_000);
}

function summarize(names: string[]): string {
  const shown = names.slice(0, MAX_NAMES).join("、");
  return names.length > MAX_NAMES ? `${shown} ほか${names.length - MAX_NAMES}件` : shown;
}

export const NOTIFICATION_TITLE = "イベントカウントダウン";

/** The daily message for events happening today or tomorrow, or null if there is none. */
export function buildDailyMessage(
  events: StoredEvent[],
  today: string
): { title: string; body: string } | null {
  const todays = events.filter((e) => daysUntil(today, e.date) === 0).map((e) => e.name);
  const tomorrows = events.filter((e) => daysUntil(today, e.date) === 1).map((e) => e.name);
  const lines: string[] = [];
  if (todays.length) lines.push(`今日：${summarize(todays)}`);
  if (tomorrows.length) lines.push(`明日：${summarize(tomorrows)}`);
  if (lines.length === 0) return null;
  return { title: NOTIFICATION_TITLE, body: lines.join("\n") };
}
