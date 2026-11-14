import { createHash, timingSafeEqual } from "node:crypto";
import { json } from "@/lib/push/http";
import { buildDailyMessage, todayInJst } from "@/lib/push/notify";
import { sendPush } from "@/lib/push/send";
import { getStore } from "@/lib/push/store";

const CONCURRENCY = 10;

function safeEqual(a: string, b: string): boolean {
  const digest = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(digest(a), digest(b));
}

// Called once a day by Vercel Cron (see vercel.json). Vercel sends
// `Authorization: Bearer $CRON_SECRET` when the CRON_SECRET env var is set.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return json({ error: "CRON_SECRET is not set" }, 500);
  if (!safeEqual(request.headers.get("authorization") ?? "", `Bearer ${secret}`)) {
    return json({ error: "unauthorized" }, 401);
  }

  const store = getStore();
  if (!store) return json({ error: "not_configured" }, 503);

  const today = todayInJst();
  const ids = await store.ids();
  const summary = { subscribers: ids.length, sent: 0, skipped: 0, removed: 0, failed: 0 };

  for (let i = 0; i < ids.length; i += CONCURRENCY) {
    await Promise.all(
      ids.slice(i, i + CONCURRENCY).map(async (id) => {
        const record = await store.get(id);
        if (!record) {
          await store.remove(id); // expired record still listed in the index
          summary.removed++;
          return;
        }
        const message = buildDailyMessage(record.events, today);
        if (!message || record.lastNotified === today) {
          summary.skipped++;
          return;
        }
        const result = await sendPush(record.subscription, message);
        if (result.ok) {
          await store.put(id, { ...record, lastNotified: today });
          summary.sent++;
        } else if (result.gone) {
          await store.remove(id);
          summary.removed++;
        } else {
          summary.failed++;
        }
      })
    );
  }

  return json({ date: today, ...summary });
}
