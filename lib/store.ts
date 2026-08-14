"use client";

// storage.ts の上に薄くかぶせるリアクティブ層。
// useSyncExternalStore を使い、LocalStorage の内容を React の状態として
// SSR セーフに購読できるようにする（サーバーでは常に空のスナップショットを返す）。
// 書き込みは必ずここのラッパー関数を通し、更新を購読者に通知する。
import { useSyncExternalStore } from "react";
import * as storage from "./storage";
import type { ActiveTimer, DailyPlanMap, PendingFinish, TimeRecord } from "./types";

export { generateId } from "./storage";

type Snapshot = {
  plans: DailyPlanMap;
  records: TimeRecord[];
  activeTimer: ActiveTimer | null;
  pendingFinish: PendingFinish | null;
  storageAvailable: boolean;
};

const SERVER_SNAPSHOT: Snapshot = {
  plans: {},
  records: [],
  activeTimer: null,
  pendingFinish: null,
  storageAvailable: true,
};

let cachedSnapshot: Snapshot | null = null;
const listeners = new Set<() => void>();
let storageListenerAttached = false;

function computeSnapshot(): Snapshot {
  return {
    plans: storage.getPlans(),
    records: storage.getRecords(),
    activeTimer: storage.getActiveTimer(),
    pendingFinish: storage.getPendingFinish(),
    storageAvailable: storage.isStorageAvailable(),
  };
}

function getSnapshot(): Snapshot {
  if (!cachedSnapshot) cachedSnapshot = computeSnapshot();
  return cachedSnapshot;
}

function getServerSnapshot(): Snapshot {
  return SERVER_SNAPSHOT;
}

function notifyChanged() {
  cachedSnapshot = null;
  for (const listener of listeners) listener();
}

function ensureStorageListener() {
  if (storageListenerAttached || typeof window === "undefined") return;
  storageListenerAttached = true;
  // 他タブでの変更にも追従する
  window.addEventListener("storage", () => notifyChanged());
}

function subscribe(listener: () => void): () => void {
  ensureStorageListener();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** MyTime の全データを購読するフック。書き込みは下の関数から行う。 */
export function useMyTimeData(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setPlanForDate(date: string, minutes: number): void {
  storage.setPlanForDate(date, minutes);
  notifyChanged();
}

export function addRecord(record: TimeRecord): void {
  storage.addRecord(record);
  notifyChanged();
}

export function deleteRecord(id: string): void {
  storage.deleteRecord(id);
  notifyChanged();
}

export function setActiveTimer(timer: ActiveTimer | null): void {
  storage.setActiveTimer(timer);
  notifyChanged();
}

export function setPendingFinish(pf: PendingFinish | null): void {
  storage.setPendingFinish(pf);
  notifyChanged();
}
