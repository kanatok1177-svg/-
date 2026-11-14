// Service worker for push notifications. Kept dependency-free and served as-is from /sw.js.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    // fall through to the defaults below
  }
  // Browsers (iOS in particular) require every push to show a notification.
  event.waitUntil(
    self.registration.showNotification(data.title || "イベントカウントダウン", {
      body: data.body || "",
      icon: "/icon-192.png",
      tag: "event-countdown-daily",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      for (const client of windows) {
        if ("focus" in client) return client.focus();
      }
      return self.clients.openWindow("/");
    })
  );
});
