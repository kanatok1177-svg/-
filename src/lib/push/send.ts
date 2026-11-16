import { generateVAPIDKeys, sendNotification } from "web-push";
import type { PushStore } from "./store";
import type { PushSub } from "./types";

export type VapidConfig = { publicKey: string; privateKey: string; subject: string };

function defaultSubject(origin: string): string {
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;
  return origin.startsWith("https://") ? origin : "https://localhost";
}

/**
 * The VAPID identity used to sign pushes. If VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY are set they
 * win; otherwise a key pair is generated once and kept in the store, so no setup is needed.
 */
export async function resolveVapid(store: PushStore, origin: string): Promise<VapidConfig> {
  const subject = process.env.VAPID_SUBJECT || defaultSubject(origin);

  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (publicKey && privateKey) return { publicKey, privateKey, subject };

  let keys = await store.getVapidKeys();
  if (!keys) {
    await store.setVapidKeysIfAbsent(generateVAPIDKeys());
    keys = await store.getVapidKeys(); // re-read: another request may have won the race
  }
  if (!keys) throw new Error("could not load or create VAPID keys");
  return { ...keys, subject };
}

export type SendResult =
  | { ok: true }
  // gone: the push service says this subscription no longer exists (404/410)
  | { ok: false; gone: boolean; status?: number };

export async function sendPush(
  subscription: PushSub,
  payload: { title: string; body: string },
  vapid: VapidConfig
): Promise<SendResult> {
  try {
    await sendNotification(subscription, JSON.stringify(payload), {
      vapidDetails: vapid,
      TTL: 60 * 60 * 12,
      timeout: 10_000,
    });
    return { ok: true };
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode;
    // Never log the endpoint: it is a secret capability URL.
    console.error("web push failed", { status, name: (error as Error).name });
    return { ok: false, gone: status === 404 || status === 410, status };
  }
}
