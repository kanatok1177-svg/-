// 日付・時間まわりの純粋関数集。UIやストレージには依存しない。
import type { DetailedCalcInput, DetailedCalcResult } from "./types";

const pad2 = (n: number) => String(n).padStart(2, "0");

/** ローカルタイムでの YYYY-MM-DD を返す（タイムゾーンずれを避けるため toISOString は使わない） */
export function dateToStr(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function todayStr(): string {
  return dateToStr(new Date());
}

export function strToDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** dateStr に n 日を加算した YYYY-MM-DD を返す */
export function addDaysStr(dateStr: string, days: number): string {
  const d = strToDate(dateStr);
  d.setDate(d.getDate() + days);
  return dateToStr(d);
}

/** "HH:MM" 形式を分に変換 */
export function timeStrToMinutes(t: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
  if (!m) return 0;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (Number.isNaN(h) || Number.isNaN(min)) return 0;
  return h * 60 + min;
}

/** 分を「◯時間◯分」の日本語表記に変換 */
export function formatDuration(minutesRaw: number): string {
  const minutes = Math.round(minutesRaw);
  if (minutes <= 0) return "0分";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}時間${m}分`;
  if (h > 0) return `${h}時間`;
  return `${m}分`;
}

/** 分を「◯h◯m」など短縮表記（小さい補足テキスト用） */
export function formatDurationShort(minutesRaw: number): string {
  const minutes = Math.round(Math.abs(minutesRaw));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}時間${m > 0 ? m + "分" : ""}`;
  return `${m}分`;
}

/** 経過秒数を "MM:SS" または "H:MM:SS" に変換 */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${pad2(m)}:${pad2(sec)}`;
  return `${pad2(m)}:${pad2(sec)}`;
}

/** "HH:MM" を "7:00" のような表示用に整形（先頭の 0 埋めはそのまま利用） */
export function formatHM(t: string): string {
  return t;
}

/**
 * 起床〜就寝の時間から予定を差し引いて自由時間を計算する。
 * 就寝時刻が起床時刻以前（例: 起床7:00, 就寝1:00）の場合は日をまたぐとみなす。
 */
export function calculateDetailedFreeTime(
  input: DetailedCalcInput
): DetailedCalcResult {
  const wake = timeStrToMinutes(input.wake);
  let sleep = timeStrToMinutes(input.sleep);
  if (sleep <= wake) sleep += 24 * 60;
  const awakeMinutes = sleep - wake;

  const safe = (n: number) => (Number.isFinite(n) && n > 0 ? Math.round(n) : 0);
  const busyMinutes =
    safe(input.schoolMin) +
    safe(input.studyMin) +
    safe(input.clubMin) +
    safe(input.mealMin) +
    safe(input.bathMin) +
    safe(input.otherMin);

  const freeMinutes = Math.max(0, awakeMinutes - busyMinutes);

  return {
    awakeMinutes,
    busyMinutes,
    freeMinutes,
    overBudget: busyMinutes > awakeMinutes,
  };
}

/** ミリ秒の時刻から HH:MM 形式の時刻文字列を得る */
export function msToClockLabel(ms: number): string {
  const d = new Date(ms);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** 指定日を含む週の月曜日と日曜日（YYYY-MM-DD）を返す */
export function getWeekRange(dateStr: string): { start: string; end: string } {
  const d = strToDate(dateStr);
  const day = d.getDay(); // 0=日 ... 6=土
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(d);
  start.setDate(d.getDate() + diffToMonday);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start: dateToStr(start), end: dateToStr(end) };
}

/** 指定日を含む月の初日と末日（YYYY-MM-DD）を返す */
export function getMonthRange(dateStr: string): { start: string; end: string } {
  const d = strToDate(dateStr);
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return { start: dateToStr(start), end: dateToStr(end) };
}

export function isDateInRange(dateStr: string, start: string, end: string): boolean {
  return dateStr >= start && dateStr <= end;
}
