import { AppData, STORAGE_KEY, StudyLog } from "./types";

const EMPTY_DATA: AppData = { logs: [] };

/** ローカルタイムゾーン基準の YYYY-MM-DD 文字列を返す */
export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadData(): AppData {
  if (!isBrowser()) return EMPTY_DATA;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_DATA;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.logs)) return EMPTY_DATA;
    return parsed as AppData;
  } catch {
    return EMPTY_DATA;
  }
}

export function saveData(data: AppData): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // LocalStorage が使えない環境（プライベートモード等）では黙って諦める
  }
}

export function addLog(task: string | undefined, durationSec: number): StudyLog {
  const data = loadData();
  const now = new Date();
  const log: StudyLog = {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    date: dateKey(now),
    timestamp: now.getTime(),
    task: task?.trim() ? task.trim() : undefined,
    durationSec,
  };
  const next: AppData = { logs: [log, ...data.logs] };
  saveData(next);
  return log;
}

/** 今日のスタート回数 */
export function todayCount(logs: StudyLog[]): number {
  const today = dateKey();
  return logs.filter((l) => l.date === today).length;
}

/**
 * 連続達成日数（ストリーク）を計算する。
 * 今日 or 昨日にログがあれば、そこから連続する日数を数える。
 * 今日・昨日どちらにも記録が無ければストリークは 0。
 */
export function computeStreak(logs: StudyLog[]): number {
  if (logs.length === 0) return 0;

  const uniqueDates = new Set(logs.map((l) => l.date));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 起点を決める：今日に記録があれば今日から、無くて昨日にあれば昨日から
  const cursor = new Date(today);
  if (!uniqueDates.has(dateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!uniqueDates.has(dateKey(cursor))) {
      return 0;
    }
  }

  let streak = 0;
  while (uniqueDates.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** 新しい順に並んだログ一覧を返す */
export function sortedLogs(logs: StudyLog[]): StudyLog[] {
  return [...logs].sort((a, b) => b.timestamp - a.timestamp);
}
