import { useSyncExternalStore } from "react";
import type { Goal } from "./types";

const STORAGE_KEY = "habit-tracker:goal";

type Listener = () => void;
let listeners: Listener[] = [];
let cache: Goal | null = null;
let cacheLoaded = false;

function readFromStorage(): Goal | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as Goal;
  } catch {
    return null;
  }
}

function getSnapshot(): Goal | null {
  if (!cacheLoaded) {
    cache = readFromStorage();
    cacheLoaded = true;
  }
  return cache;
}

function getServerSnapshot(): Goal | null {
  return null;
}

function subscribe(listener: Listener): () => void {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function emitChange(): void {
  for (const listener of listeners) listener();
}

/** 目標を更新し、LocalStorage への保存と購読者への通知を行う */
export function setGoal(updater: Goal | null | ((prev: Goal | null) => Goal | null)): void {
  const prev = getSnapshot();
  const next = typeof updater === "function" ? (updater as (p: Goal | null) => Goal | null)(prev) : updater;
  cache = next;
  cacheLoaded = true;
  try {
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage が使えない環境(プライベートモード等)では黙って無視する
  }
  emitChange();
}

/** LocalStorage と同期された目標(常に0〜1件)を購読するフック */
export function useGoal(): Goal | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
