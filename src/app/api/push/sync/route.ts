import { json, readJson } from "@/lib/push/http";
import { NOTIFICATION_TITLE } from "@/lib/push/notify";
import { getVapidConfig, sendPush } from "@/lib/push/send";
import { getStore, subscriberId } from "@/lib/push/store";
import { parseEvents, parseSubscription } from "@/lib/push/validate";

// Saves (or refreshes) this browser's subscription together with its current events.
// With `welcome: true` it also sends a confirmation push, so a broken setup shows up immediately.
export async function POST(request: Request) {
  const store = getStore();
  if (!store || !getVapidConfig()) return json({ error: "not_configured" }, 503);

  const body = await readJson(request);
  if (!body) return json({ error: "bad_request" }, 400);
  const subscription = parseSubscription(body.subscription);
  const events = parseEvents(body.events);
  if (!subscription || !events) return json({ error: "bad_request" }, 400);

  const id = subscriberId(subscription.endpoint);
  const existing = await store.get(id);
  await store.put(id, {
    subscription,
    events,
    lastNotified: existing?.lastNotified,
    updatedAt: Date.now(),
  });

  if (body.welcome === true) {
    const result = await sendPush(subscription, {
      title: NOTIFICATION_TITLE,
      body: "通知をオンにしました。毎朝9時ごろ、前日と当日のイベントをお知らせします。",
    });
    if (!result.ok) {
      await store.remove(id);
      return json({ error: "push_failed" }, 502);
    }
  }

  return json({ ok: true, count: events.length });
}
