import { sendNotification } from "web-push";
import type { PushSub } from "./types";

export type VapidConfig = { publicKey: string; privateKey: string; subject: string };

export function getVapidConfig(): VapidConfig | null {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  return publicKey && privateKey && subject ? { publicKey, privateKey, subject } : null;
}

export type SendResult =
  | { ok: true }
  // gone: the push service says this subscription no longer exists (404/410)
  | { ok: false; gone: boolean; status?: number };

export async function sendPush(
  subscription: PushSub,
  payload: { title: string; body: string }
): Promise<SendResult> {
  const config = getVapidConfig();
  if (!config) return { ok: false, gone: false };
  try {
    await sendNotification(subscription, JSON.stringify(payload), {
      vapidDetails: config,
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
