export type StoredEvent = { id: string; name: string; date: string }; // date: YYYY-MM-DD

export type PushSub = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export type SubscriptionRecord = {
  subscription: PushSub;
  events: StoredEvent[];
  /** JST date (YYYY-MM-DD) of the last daily notification, to avoid double sends. */
  lastNotified?: string;
  updatedAt: number;
};
