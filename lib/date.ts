/** Date を "YYYY-MM-DD" 形式(ローカルタイムゾーン)に変換する */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISODate(): string {
  return toISODate(new Date());
}

export function addDays(iso: string, amount: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  date.setDate(date.getDate() + amount);
  return toISODate(date);
}

/** "2026年8月13日 (木)" のような日本語表示に変換する */
export function formatJP(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  const weekday = new Intl.DateTimeFormat("ja-JP", { weekday: "short" }).format(date);
  return `${y}年${m}月${d}日 (${weekday})`;
}

export function isToday(iso: string): boolean {
  return iso === todayISODate();
}
