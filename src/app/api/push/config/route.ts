import { json } from "@/lib/push/http";
import { getVapidConfig } from "@/lib/push/send";
import { getStore } from "@/lib/push/store";

// Tells the client whether push is set up on this deployment, and the public key to subscribe with.
export async function GET() {
  const vapid = getVapidConfig();
  if (!vapid || !getStore()) return json({ enabled: false });
  return json({ enabled: true, publicKey: vapid.publicKey });
}
