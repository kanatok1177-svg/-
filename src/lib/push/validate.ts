import type { PushSub, StoredEvent } from "./types";

export const MAX_EVENTS = 200;
export const MAX_NAME_LENGTH = 60;

// The server POSTs to whatever endpoint a client registers, so only accept the
// push services that browsers actually use (prevents server-side request forgery).
const ALLOWED_PUSH_HOSTS = [
  "fcm.googleapis.com", // Chrome, Edge, Brave, Opera, Samsung Internet (Android/desktop)
  "push.services.mozilla.com", // Firefox
  "push.apple.com", // Safari / iOS home-screen apps
  "notify.windows.com", // Edge via WNS
];

export function isAllowedEndpoint(raw: unknown): raw is string {
  if (typeof raw !== "string" || raw.length > 2048) return false;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port) {
    return false;
  }
  const host = url.hostname.toLowerCase();
  return ALLOWED_PUSH_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
}

const BASE64URL = /^[A-Za-z0-9_-]{16,200}$/;

export function parseSubscription(input: unknown): PushSub | null {
  if (typeof input !== "object" || input === null) return null;
  const { endpoint, keys } = input as { endpoint?: unknown; keys?: unknown };
  if (!isAllowedEndpoint(endpoint)) return null;
  if (typeof keys !== "object" || keys === null) return null;
  const { p256dh, auth } = keys as { p256dh?: unknown; auth?: unknown };
  if (typeof p256dh !== "string" || !BASE64URL.test(p256dh)) return null;
  if (typeof auth !== "string" || !BASE64URL.test(auth)) return null;
  return { endpoint, keys: { p256dh, auth } };
}

function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/** Returns null when the payload is malformed; silently drops individual bad items. */
export function parseEvents(input: unknown): StoredEvent[] | null {
  if (!Array.isArray(input) || input.length > MAX_EVENTS) return null;
  const events: StoredEvent[] = [];
  for (const item of input) {
    if (typeof item !== "object" || item === null) continue;
    const { id, name, date } = item as Record<string, unknown>;
    if (typeof id !== "string" || id.length < 1 || id.length > 64) continue;
    if (typeof name !== "string") continue;
    const trimmed = name.trim();
    if (trimmed.length < 1 || trimmed.length > MAX_NAME_LENGTH) continue;
    if (typeof date !== "string" || !isRealDate(date)) continue;
    events.push({ id, name: trimmed, date });
  }
  return events;
}
