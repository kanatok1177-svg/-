import { dateKey } from "./storage";

/** ログの日付を「今日」「昨日」「8月13日」のように読みやすく整形する */
export function formatLogDate(dateStr: string): string {
  const today = dateKey();
  const yesterday = dateKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
  if (dateStr === today) return "今日";
  if (dateStr === yesterday) return "昨日";
  const [, m, d] = dateStr.split("-");
  return `${Number(m)}月${Number(d)}日`;
}

/** タイムスタンプを HH:mm 形式に整形する */
export function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}
