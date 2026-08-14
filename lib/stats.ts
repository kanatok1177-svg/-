// 統計・分析のための集計ロジック。UI から呼び出す純粋関数群。
import type { TimeRecord } from "./types";
import { addDaysStr, getWeekRange, isDateInRange, todayStr } from "./time";

export type RangeSummary = {
  plannedTotal: number; // 分
  usedTotal: number; // 分
  satisfiedTotal: number; // 満足度「最高」の合計分
  /** 充実時間率(%)。使用時間が 0 の場合は null（データなし） */
  fulfillmentRate: number | null;
};

function sumPlannedForRange(
  plans: Record<string, number>,
  start: string,
  end: string
): number {
  let total = 0;
  for (const [date, minutes] of Object.entries(plans)) {
    if (isDateInRange(date, start, end)) total += minutes;
  }
  return total;
}

export function summarizeRange(
  records: TimeRecord[],
  plans: Record<string, number>,
  start: string,
  end: string
): RangeSummary {
  const inRange = records.filter((r) => isDateInRange(r.date, start, end));
  const usedTotal = inRange.reduce((sum, r) => sum + Math.max(0, r.duration), 0);
  const satisfiedTotal = inRange
    .filter((r) => r.satisfaction === 3)
    .reduce((sum, r) => sum + Math.max(0, r.duration), 0);
  const plannedTotal = sumPlannedForRange(plans, start, end);
  const fulfillmentRate = usedTotal > 0 ? Math.round((satisfiedTotal / usedTotal) * 100) : null;
  return { plannedTotal, usedTotal, satisfiedTotal, fulfillmentRate };
}

export function summarizeToday(
  records: TimeRecord[],
  plans: Record<string, number>,
  extraElapsedMinutes = 0
): {
  plannedMinutes: number;
  usedMinutes: number;
  remainingMinutes: number;
  overMinutes: number;
} {
  const today = todayStr();
  const plannedMinutes = plans[today] ?? 0;
  const usedFromRecords = records
    .filter((r) => r.date === today)
    .reduce((sum, r) => sum + Math.max(0, r.duration), 0);
  const usedMinutes = usedFromRecords + Math.max(0, extraElapsedMinutes);
  const remainingMinutes = Math.max(0, plannedMinutes - usedMinutes);
  const overMinutes = Math.max(0, usedMinutes - plannedMinutes);
  return { plannedMinutes, usedMinutes, remainingMinutes, overMinutes };
}

export type TagStat = {
  tag: string;
  totalMinutes: number;
  avgSatisfaction: number;
  count: number;
};

export function summarizeByTag(records: TimeRecord[]): TagStat[] {
  const map = new Map<string, { total: number; satisfactionSum: number; count: number }>();
  for (const r of records) {
    const tag = r.tag && r.tag.trim() ? r.tag : "タグなし";
    const entry = map.get(tag) ?? { total: 0, satisfactionSum: 0, count: 0 };
    entry.total += Math.max(0, r.duration);
    entry.satisfactionSum += r.satisfaction;
    entry.count += 1;
    map.set(tag, entry);
  }
  return Array.from(map.entries())
    .map(([tag, v]) => ({
      tag,
      totalMinutes: v.total,
      avgSatisfaction: v.count > 0 ? Math.round((v.satisfactionSum / v.count) * 10) / 10 : 0,
      count: v.count,
    }))
    .sort((a, b) => b.totalMinutes - a.totalMinutes);
}

/** 今週 vs 先週の簡単な分析コメントを返す。データ不足なら null */
export function weeklyInsight(
  records: TimeRecord[],
  plans: Record<string, number>
): string | null {
  const today = todayStr();
  const thisWeek = getWeekRange(today);
  const lastWeekAnchor = addDaysStr(thisWeek.start, -1);
  const lastWeek = getWeekRange(lastWeekAnchor);

  const thisWeekSummary = summarizeRange(records, plans, thisWeek.start, thisWeek.end);
  const lastWeekSummary = summarizeRange(records, plans, lastWeek.start, lastWeek.end);

  if (thisWeekSummary.usedTotal === 0 || lastWeekSummary.usedTotal === 0) {
    return null;
  }

  const thisRate = thisWeekSummary.fulfillmentRate ?? 0;
  const lastRate = lastWeekSummary.fulfillmentRate ?? 0;
  const diff = thisRate - lastRate;

  if (diff >= 10) {
    return `今週は先週より充実した自由時間が増えています（充実時間率 ${lastRate}%→${thisRate}%）。`;
  }
  if (diff <= -10) {
    return `今週は先週より充実度がやや下がっています（充実時間率 ${lastRate}%→${thisRate}%）。`;
  }
  return `今週の充実時間率は先週とあまり変わりません（${lastRate}%→${thisRate}%）。`;
}
