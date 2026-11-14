"use client";

import { useEffect, useState } from "react";
import {
  detectSupport,
  fetchPushConfig,
  getCurrentSubscription,
  subscribePush,
  syncSubscription,
  unsubscribePush,
} from "@/lib/push/client";
import type { StoredEvent } from "@/lib/push/types";

type Status =
  | "checking"
  | "unsupported"
  | "ios-install"
  | "unconfigured"
  | "denied"
  | "off"
  | "on"
  | "busy";

const SYNC_DEBOUNCE_MS = 800;

const HINTS: Partial<Record<Status, string>> = {
  "ios-install":
    "iPhone・iPadでは、Safariの共有ボタンから「ホーム画面に追加」したアプリで通知を使えます。",
  unconfigured: "通知は現在ご利用いただけません（サーバーの設定が未完了です）。",
  denied: "通知がブロックされています。ブラウザのサイト設定で通知を許可してください。",
  off: "オンにすると、イベント名と日付をサーバーに保存し、毎朝9時ごろ前日と当日にお知らせします。",
  on: "毎朝9時ごろ、前日と当日のイベントをお知らせします。",
};

export default function NotificationToggle({
  events,
  ready,
}: {
  events: StoredEvent[];
  /** True once the saved events have been loaded, so an empty list is never uploaded by mistake. */
  ready: boolean;
}) {
  const [status, setStatus] = useState<Status>("checking");
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const support = detectSupport();
      if (support !== "ok") {
        setStatus(support === "ios-needs-install" ? "ios-install" : "unsupported");
        return;
      }
      const config = await fetchPushConfig();
      if (cancelled) return;
      if (!config.enabled || !config.publicKey) {
        setStatus("unconfigured");
        return;
      }
      setPublicKey(config.publicKey);
      if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }
      const subscription = await getCurrentSubscription();
      if (cancelled) return;
      setStatus(subscription && Notification.permission === "granted" ? "on" : "off");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // While notifications are on, keep the server's copy of the events up to date.
  useEffect(() => {
    if (status !== "on" || !ready) return;
    const timer = setTimeout(async () => {
      const subscription = await getCurrentSubscription();
      if (subscription) await syncSubscription(subscription, events);
    }, SYNC_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [events, status, ready]);

  async function enable() {
    setStatus("busy");
    setError("");
    try {
      // Must be requested directly from the click for browsers to show the prompt.
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off");
        return;
      }
      if (!publicKey) throw new Error("missing public key");
      const subscription = await subscribePush(publicKey);
      const saved = await syncSubscription(subscription, events, true);
      if (!saved) {
        await subscription.unsubscribe().catch(() => undefined);
        throw new Error("sync failed");
      }
      setStatus("on");
    } catch {
      setError("通知をオンにできませんでした。通信状況を確認して、もう一度お試しください。");
      setStatus("off");
    }
  }

  async function disable() {
    setStatus("busy");
    setError("");
    try {
      await unsubscribePush();
      setStatus("off");
    } catch {
      setError("通知をオフにできませんでした。もう一度お試しください。");
      setStatus("on");
    }
  }

  if (status === "checking" || status === "unsupported") return null;

  const isOn = status === "on";
  const hint = error || HINTS[status];

  // Rendered as direct children of the grid in CountdownApp: the button shares the
  // first row with the theme switch, and the hint spans the full width below.
  return (
    <>
      {(status === "off" || status === "on" || status === "busy") && (
        <button
          type="button"
          aria-pressed={isOn}
          disabled={status === "busy"}
          onClick={isOn ? disable : enable}
          className={
            "col-start-1 row-start-1 inline-flex h-9 items-center gap-2 justify-self-start rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60 " +
            (isOn
              ? "border-transparent bg-accent-soft text-accent-strong"
              : "border-border bg-surface text-foreground hover:bg-surface-muted")
          }
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isOn ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          {status === "busy" ? "設定中…" : isOn ? "通知オン" : "通知をオンにする"}
        </button>
      )}
      {hint && (
        <p
          role="status"
          className={
            "col-span-2 row-start-2 text-xs leading-relaxed text-pretty " +
            (error ? "text-danger" : "text-muted")
          }
        >
          {hint}
        </p>
      )}
    </>
  );
}
