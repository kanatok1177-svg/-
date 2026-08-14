// LocalStorage まわりの処理を一箇所に集約する。
// - どこからも直接 localStorage を触らず、必ずこのファイルの関数経由にする
// - 壊れたデータ / 利用不可な環境でもアプリが落ちないようにする
import type { ActiveTimer, DailyPlanMap, PendingFinish, TimeRecord } from "./types";

const PREFIX = "mytime:v1:";
const KEYS = {
  plans: `${PREFIX}plans`,
  records: `${PREFIX}records`,
  activeTimer: `${PREFIX}activeTimer`,
  pendingFinish: `${PREFIX}pendingFinish`,
} as const;

let storageAvailable: boolean | null = null;

/** このブラウザで localStorage が実際に使えるかどうか */
export function isStorageAvailable(): boolean {
  if (storageAvailable !== null) return storageAvailable;
  if (typeof window === "undefined") return false;
  try {
    const testKey = `${PREFIX}__test__`;
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
  return storageAvailable;
}

function readRaw(key: string): string | null {
  if (!isStorageAvailable()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): boolean {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function removeRaw(key: string): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // 無視
  }
}

// ---------- 自由時間の設定（日付ごと） ----------

export function getPlans(): DailyPlanMap {
  const raw = readRaw(KEYS.plans);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const result: DailyPlanMap = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (typeof k === "string" && typeof v === "number" && Number.isFinite(v) && v >= 0) {
          result[k] = v;
        }
      }
      return result;
    }
  } catch {
    // 壊れたデータは無視
  }
  return {};
}

export function getPlanForDate(date: string): number | undefined {
  const plans = getPlans();
  return plans[date];
}

export function setPlanForDate(date: string, minutes: number): void {
  const plans = getPlans();
  plans[date] = Math.max(0, Math.round(minutes));
  writeRaw(KEYS.plans, JSON.stringify(plans));
}

// ---------- 使用記録 ----------

function isValidRecord(r: unknown): r is TimeRecord {
  if (!r || typeof r !== "object") return false;
  const rec = r as Record<string, unknown>;
  return (
    typeof rec.id === "string" &&
    typeof rec.date === "string" &&
    typeof rec.startTime === "number" &&
    typeof rec.endTime === "number" &&
    typeof rec.duration === "number" &&
    (rec.satisfaction === 1 || rec.satisfaction === 2 || rec.satisfaction === 3) &&
    (rec.tag === undefined || typeof rec.tag === "string")
  );
}

export function getRecords(): TimeRecord[] {
  const raw = readRaw(KEYS.records);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(isValidRecord);
    }
  } catch {
    // 壊れたデータは無視
  }
  return [];
}

function saveRecords(records: TimeRecord[]): void {
  writeRaw(KEYS.records, JSON.stringify(records));
}

export function addRecord(record: TimeRecord): void {
  const records = getRecords();
  records.push(record);
  saveRecords(records);
}

export function deleteRecord(id: string): void {
  const records = getRecords().filter((r) => r.id !== id);
  saveRecords(records);
}

export function getRecordsForDate(date: string): TimeRecord[] {
  return getRecords().filter((r) => r.date === date);
}

// ---------- 計測中タイマー ----------

function isValidActiveTimer(t: unknown): t is ActiveTimer {
  if (!t || typeof t !== "object") return false;
  const timer = t as Record<string, unknown>;
  return (
    typeof timer.startTime === "number" &&
    typeof timer.date === "string" &&
    Array.isArray(timer.notifiedThresholds)
  );
}

export function getActiveTimer(): ActiveTimer | null {
  const raw = readRaw(KEYS.activeTimer);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (isValidActiveTimer(parsed)) return parsed;
  } catch {
    // 壊れたデータは無視
  }
  return null;
}

export function setActiveTimer(timer: ActiveTimer | null): void {
  if (timer === null) {
    removeRaw(KEYS.activeTimer);
    return;
  }
  writeRaw(KEYS.activeTimer, JSON.stringify(timer));
}

// ---------- 満足度入力待ちセッション ----------

function isValidPendingFinish(p: unknown): p is PendingFinish {
  if (!p || typeof p !== "object") return false;
  const pf = p as Record<string, unknown>;
  return (
    typeof pf.date === "string" &&
    typeof pf.startTime === "number" &&
    typeof pf.endTime === "number" &&
    typeof pf.duration === "number"
  );
}

export function getPendingFinish(): PendingFinish | null {
  const raw = readRaw(KEYS.pendingFinish);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (isValidPendingFinish(parsed)) return parsed;
  } catch {
    // 壊れたデータは無視
  }
  return null;
}

export function setPendingFinish(pf: PendingFinish | null): void {
  if (pf === null) {
    removeRaw(KEYS.pendingFinish);
    return;
  }
  writeRaw(KEYS.pendingFinish, JSON.stringify(pf));
}

/** id 生成（暗号強度は不要なので簡易実装） */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
