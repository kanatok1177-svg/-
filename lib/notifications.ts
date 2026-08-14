// 残り自由時間の通知まわり。Notification API が使えない環境でも
// 例外を投げずに黙ってスキップする。

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermission | null {
  if (!isNotificationSupported()) return null;
  try {
    return Notification.permission;
  } catch {
    return null;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  try {
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    const result = await Notification.requestPermission();
    return result === "granted";
  } catch {
    return false;
  }
}

export function sendFreeTimeNotification(title: string, body: string): void {
  if (!isNotificationSupported()) return;
  try {
    if (Notification.permission !== "granted") return;
    new Notification(title, { body, icon: undefined, tag: "mytime-remaining" });
  } catch {
    // 通知に失敗しても無視（アプリの動作には影響させない）
  }
}

/** 残り分数のしきい値。大きい順に判定する */
export const NOTIFY_THRESHOLDS = [30, 10, 0] as const;

export function messageForThreshold(threshold: number): string {
  if (threshold === 0) return "今日の自由時間を使い切りました。";
  return `今日の自由時間の残りが${threshold}分になりました。`;
}
