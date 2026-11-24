import { createHash, timingSafeEqual } from "node:crypto";
import { json } from "@/lib/push/http";
import { buildDailyMessage, todayInJst } from "@/lib/push/notify";
import { resolveVapid, sendPush } from "@/lib/push/send";
import { getStore } from "@/lib/push/store";

const CONCURRENCY = 10;

function safeEqual(a: string, b: string): boolean {
  const digest = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(digest(a), digest(b));
}

// Called once a day by Vercel Cron (see vercel.json).
// With CRON_SECRET set, Vercel sends `Authorization: Bearer $CRON_SECRET` and anything else is
// rejected. Without it (the zero-setup default for a personal app) only Vercel Cron's user agent
// is accepted. That is not a secret, but the job is idempotent per day and only ever sends the
// stored events' own reminders, so a stray call cannot do more than send today's reminder early.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorized = secret
    ? safeEqual(request.headers.get("authorization") ?? "", `Bearer ${secret}`)
    : (request.headers.get("user-agent") ?? "").startsWith("vercel-cron/");
  if (!authorized) return json({ error: "unauthorized" }, 401);

  const store = getStore();
  if (!store) return json({ error: "not_configured" }, 503);

  const vapid = await resolveVapid(store, new URL(request.url).origin);
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
        const result = await sendPush(record.subscription, message, vapid);
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
