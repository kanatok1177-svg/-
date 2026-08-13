import { useSyncExternalStore } from "react";
import type { Task } from "./types";

const STORAGE_KEY = "habit-tracker:tasks";

type Listener = () => void;
let listeners: Listener[] = [];
let cache: Task[] = [];
let cacheLoaded = false;

function readFromStorage(): Task[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Task[]) : [];
  } catch {
    return [];
  }
}

function getSnapshot(): Task[] {
  if (!cacheLoaded) {
    cache = readFromStorage();
    cacheLoaded = true;
  }
  return cache;
}

const EMPTY_TASKS: Task[] = [];

function getServerSnapshot(): Task[] {
  return EMPTY_TASKS;
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

/** タスク一覧を更新し、LocalStorage への保存と購読者への通知を行う */
export function setTasks(updater: Task[] | ((prev: Task[]) => Task[])): void {
  const prev = getSnapshot();
  const next = typeof updater === "function" ? (updater as (p: Task[]) => Task[])(prev) : updater;
  cache = next;
  cacheLoaded = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage が使えない環境(プライベートモード等)では黙って無視する
  }
  emitChange();
}

/** LocalStorage と同期されたタスク一覧を購読するフック */
export function useTasks(): Task[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
