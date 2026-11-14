import { createHash } from "node:crypto";
import { Redis } from "@upstash/redis";
import type { SubscriptionRecord } from "./types";

const INDEX_KEY = "push:subs";
// Records that nobody refreshes (the app is never opened again) expire on their own.
const TTL_SECONDS = 60 * 60 * 24 * 180;

export type PushStore = {
  get(id: string): Promise<SubscriptionRecord | null>;
  put(id: string, record: SubscriptionRecord): Promise<void>;
  remove(id: string): Promise<void>;
  ids(): Promise<string[]>;
};

export function subscriberId(endpoint: string): string {
  return createHash("sha256").update(endpoint).digest("hex").slice(0, 32);
}

function redisFromEnv(): Redis | null {
  // Vercel's Upstash integration may expose either naming scheme.
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

function redisStore(redis: Redis): PushStore {
  const key = (id: string) => `push:sub:${id}`;
  return {
    async get(id) {
      return (await redis.get<SubscriptionRecord>(key(id))) ?? null;
    },
    async put(id, record) {
      await redis.set(key(id), record, { ex: TTL_SECONDS });
      await redis.sadd(INDEX_KEY, id);
    },
    async remove(id) {
      await redis.del(key(id));
      await redis.srem(INDEX_KEY, id);
    },
    async ids() {
      return redis.smembers(INDEX_KEY);
    },
  };
}

// Local development only: survives hot reloads, lost on restart.
function memoryStore(): PushStore {
  const g = globalThis as unknown as { __pushMemoryStore?: Map<string, SubscriptionRecord> };
  const map = (g.__pushMemoryStore ??= new Map());
  return {
    async get(id) {
      return map.get(id) ?? null;
    },
    async put(id, record) {
      map.set(id, record);
    },
    async remove(id) {
      map.delete(id);
    },
    async ids() {
      return [...map.keys()];
    },
  };
}

/** null means storage is not configured (production without Redis env vars). */
export function getStore(): PushStore | null {
  const redis = redisFromEnv();
  if (redis) return redisStore(redis);
  if (process.env.NODE_ENV !== "production") return memoryStore();
  return null;
}
