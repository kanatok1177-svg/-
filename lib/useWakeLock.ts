"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Wake Lock API のラッパー。
 * 対応していないブラウザでは何もせず、エラーも投げない（サイレントフォールバック）。
 * タブがバックグラウンドから復帰した際は自動で再取得する。
 */
export function useWakeLock() {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  const wantsLockRef = useRef(false);

  const request = useCallback(async () => {
    wantsLockRef.current = true;
    if (typeof navigator === "undefined" || !("wakeLock" in navigator)) return;
    try {
      const sentinel = await navigator.wakeLock.request("screen");
      sentinelRef.current = sentinel;
    } catch {
      // 権限拒否やタブが非アクティブなど。無視してタイマー自体は継続する。
    }
  }, []);

  const release = useCallback(async () => {
    wantsLockRef.current = false;
    try {
      await sentinelRef.current?.release();
    } catch {
      // 既に解放済みなどは無視
    } finally {
      sentinelRef.current = null;
    }
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible" && wantsLockRef.current) {
        void request();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [request]);

  return { request, release };
}
