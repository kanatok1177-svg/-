const MAX_BODY_BYTES = 64 * 1024;

export function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Parses a small JSON request body; returns undefined if missing, too large or invalid. */
export async function readJson(request: Request): Promise<Record<string, unknown> | undefined> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return undefined;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return undefined;
    const parsed: unknown = JSON.parse(text);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : undefined;
  } catch {
    return undefined;
  }
}
