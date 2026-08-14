"use client";

import { Card, PageHeader, SectionTitle, StatTile } from "@/components/ui";
import { useMyTimeData } from "@/lib/store";
import { formatDuration, getMonthRange, getWeekRange, todayStr } from "@/lib/time";
import { summarizeByTag, summarizeRange, summarizeToday, weeklyInsight } from "@/lib/stats";

export default function StatsPage() {
  const { records, plans } = useMyTimeData();

  const today = todayStr();
  const todaySummary = summarizeToday(records, plans);
  const week = getWeekRange(today);
  const month = getMonthRange(today);
  const weekSummary = summarizeRange(records, plans, week.start, week.end);
  const monthSummary = summarizeRange(records, plans, month.start, month.end);
  const insight = weeklyInsight(records, plans);
  const tagStats = summarizeByTag(records);
  const hasAnyRecord = records.length > 0;

  return (
    <div className="flex flex-1 flex-col gap-6 pb-10 animate-fade-in">
      <PageHeader title="統計" subtitle="自由時間の使い方を振り返りましょう。" />

      <section className="flex flex-col gap-2 px-5">
        <SectionTitle>今日</SectionTitle>
        <Card>
          <div className="grid grid-cols-2 gap-2.5">
            <StatTile label="設定した自由時間" value={formatDuration(todaySummary.plannedMinutes)} />
            <StatTile label="使用した時間" value={formatDuration(todaySummary.usedMinutes)} />
            <StatTile
              label="残り時間"
              value={formatDuration(todaySummary.remainingMinutes)}
              tone="accent"
            />
            <StatTile
              label="オーバー時間"
              value={todaySummary.overMinutes > 0 ? formatDuration(todaySummary.overMinutes) : "-"}
              tone={todaySummary.overMinutes > 0 ? "danger" : "neutral"}
            />
          </div>
        </Card>
      </section>

      <RangeSection title="今週" summary={weekSummary} />
      <RangeSection title="今月" summary={monthSummary} />

      {insight && (
        <section className="px-5">
          <Card className="bg-[var(--accent-soft)]">
            <p className="text-sm font-semibold text-[var(--accent)]">{insight}</p>
          </Card>
        </section>
      )}

      <section className="flex flex-col gap-2 px-5">
        <SectionTitle>タグ別分析</SectionTitle>
        {!hasAnyRecord ? (
          <Card className="py-8 text-center text-sm text-[var(--muted)]">
            まだデータがありません
          </Card>
        ) : (
          <Card className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-xs text-[var(--muted)]">
                  <th className="px-4 py-3 font-medium">タグ</th>
                  <th className="px-4 py-3 font-medium">使用時間</th>
                  <th className="px-4 py-3 font-medium">平均満足度</th>
                </tr>
              </thead>
              <tbody>
                {tagStats.map((t) => (
                  <tr key={t.tag} className="border-b border-[var(--border)] last:border-none">
                    <td className="px-4 py-3 font-semibold">{t.tag}</td>
                    <td className="px-4 py-3 tabular-nums">{formatDuration(t.totalMinutes)}</td>
                    <td className="px-4 py-3 tabular-nums">{t.avgSatisfaction.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
        <p className="px-1 text-xs text-[var(--muted)]">
          平均満足度は 最高=3 / 普通=2 / いまいち=1 で計算しています。
        </p>
      </section>
    </div>
  );
}

function RangeSection({
  title,
  summary,
}: {
  title: string;
  summary: ReturnType<typeof summarizeRange>;
}) {
  return (
    <section className="flex flex-col gap-2 px-5">
      <SectionTitle>{title}</SectionTitle>
      <Card>
        <div className="grid grid-cols-2 gap-2.5">
          <StatTile label="自由時間合計（設定）" value={formatDuration(summary.plannedTotal)} />
          <StatTile label="使用時間合計" value={formatDuration(summary.usedTotal)} />
          <StatTile label="満足度が高かった時間" value={formatDuration(summary.satisfiedTotal)} />
          <div className="flex flex-col gap-1 rounded-2xl bg-[var(--accent-soft)] px-4 py-3.5">
            <span className="text-xs font-medium text-[var(--accent)]">充実時間率</span>
            <span className="text-lg font-black tabular-nums text-[var(--accent)]">
              {summary.fulfillmentRate === null ? "まだデータがありません" : `${summary.fulfillmentRate}%`}
            </span>
          </div>
        </div>
      </Card>
    </section>
  );
}
