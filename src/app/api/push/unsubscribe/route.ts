import { json, readJson } from "@/lib/push/http";
import { getStore, subscriberId } from "@/lib/push/store";
import { isAllowedEndpoint } from "@/lib/push/validate";

// Deletes this browser's subscription and the events stored for it.
export async function POST(request: Request) {
  const store = getStore();
  if (!store) return json({ error: "not_configured" }, 503);

  const body = await readJson(request);
  if (!body || !isAllowedEndpoint(body.endpoint)) return json({ error: "bad_request" }, 400);

  await store.remove(subscriberId(body.endpoint));
  return json({ ok: true });
}
