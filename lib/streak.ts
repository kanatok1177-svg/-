import { addDays } from "./date";

/**
 * 「今日」を基準に連続達成日数を計算する。
 * 今日がまだ未チェックでも、昨日までの連続記録が途切れていなければ
 * (今日はまだ終わっていないとみなし)継続中として数える。
 */
export function calculateStreak(checkedDates: string[], today: string): number {
  const checked = new Set(checkedDates);

  let cursor: string;
  if (checked.has(today)) {
    cursor = today;
  } else {
    const yesterday = addDays(today, -1);
    if (checked.has(yesterday)) {
      cursor = yesterday;
    } else {
      return 0;
    }
  }

  let streak = 0;
  while (checked.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** 継続日数と目標日数に応じて変化する一言メッセージ */
export function goalMessage(streak: number, targetDays: number, hasHistory: boolean): string {
  if (streak >= targetDays) {
    return "🎉 継続成功!よく頑張りました";
  }
  if (streak <= 0) {
    return hasHistory
      ? "記録が途切れました。今日からまた挑戦しましょう"
      : "さあ、今日から始めましょう";
  }

  const ratio = streak / targetDays;
  const remaining = targetDays - streak;

  if (ratio < 0.25) return `いいスタートです。${streak}日目`;
  if (ratio < 0.5) return `習慣になりつつあります。${streak}日目`;
  if (ratio < 0.75) return "半分を超えました。その調子!";
  if (remaining === 1) return "ゴールまであと1日!";
  return `ゴールまであと${remaining}日!`;
}
