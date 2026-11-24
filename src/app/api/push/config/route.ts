import { json } from "@/lib/push/http";
import { resolveVapid } from "@/lib/push/send";
import { getStore } from "@/lib/push/store";

// Tells the client whether push is set up on this deployment, and the public key to subscribe with.
// When something is missing it names the setting (never a value) so the owner can fix it.
export async function GET(request: Request) {
  const store = getStore();
  if (!store) return json({ enabled: false, missing: ["Redis"] });

  try {
    const vapid = await resolveVapid(store, new URL(request.url).origin);
    return json({ enabled: true, publicKey: vapid.publicKey });
  } catch (error) {
    console.error("push config failed", { name: (error as Error).name });
    return json({ enabled: false, missing: ["Redis（接続エラー）"] });
  }
}
