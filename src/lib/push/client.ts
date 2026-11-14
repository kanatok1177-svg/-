import type { StoredEvent } from "./types";

export type PushSupport = "ok" | "ios-needs-install" | "unsupported";

export function detectSupport(): PushSupport {
  const capable =
    "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  if (capable) return "ok";
  // iOS only exposes push to web apps added to the Home Screen.
  const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent);
  return isIos ? "ios-needs-install" : "unsupported";
}

export async function fetchPushConfig(): Promise<{ enabled: boolean; publicKey?: string }> {
  try {
    const res = await fetch("/api/push/config", { cache: "no-store" });
    if (!res.ok) return { enabled: false };
    return await res.json();
  } catch {
    return { enabled: false };
  }
}

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const raw = atob(padded);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  const registration = await navigator.serviceWorker.getRegistration("/sw.js");
  return (await registration?.pushManager.getSubscription()) ?? null;
}

export async function subscribePush(publicKey: string): Promise<PushSubscription> {
  await navigator.serviceWorker.register("/sw.js");
  const registration = await navigator.serviceWorker.ready;
  return (
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    }))
  );
}

/** Uploads the subscription and events. Resolves false on any failure (offline, server error). */
export async function syncSubscription(
  subscription: PushSubscription,
  events: StoredEvent[],
  welcome = false
): Promise<boolean> {
  try {
    const res = await fetch("/api/push/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        events,
        ...(welcome ? { welcome: true } : {}),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function unsubscribePush(): Promise<void> {
  const subscription = await getCurrentSubscription();
  if (!subscription) return;
  try {
    await fetch("/api/push/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });
  } catch {
    // The server copy will expire on its own; still drop the local subscription.
  }
  await subscription.unsubscribe();
}
