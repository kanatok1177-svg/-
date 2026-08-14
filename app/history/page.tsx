"use client";

import { useState } from "react";
import { TrashIcon } from "@/components/icons";
import { Badge, Card, PageHeader } from "@/components/ui";
import { deleteRecord, useMyTimeData } from "@/lib/store";
import { formatDuration, msToClockLabel, strToDate } from "@/lib/time";
import type { DailyPlanMap, Satisfaction, TimeRecord } from "@/lib/types";

const emojiFor = (s: Satisfaction) => (s === 3 ? "😊" : s === 2 ? "😐" : "😞");

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  month: "long",
  day: "numeric",
  weekday: "short",
});

type DayGroup = {
  date: string;
  planned?: number;
  items: { record: TimeRecord; remainingAfter: number | null }[];
};

function buildGroups(records: TimeRecord[], plans: DailyPlanMap): DayGroup[] {
  const byDate = new Map<string, TimeRecord[]>();
  for (const r of records) {
    const arr = byDate.get(r.date) ?? [];
    arr.push(r);
    byDate.set(r.date, arr);
  }
  const dates = Array.from(byDate.keys()).sort((a, b) => b.localeCompare(a));

  return dates.map((date) => {
    const ascending = [...(byDate.get(date) ?? [])].sort((a, b) => a.startTime - b.startTime);
    const planned = plans[date];
    let cumulative = 0;
    const items = ascending.map((record) => {
      cumulative += Math.max(0, record.duration);
      const remainingAfter = planned !== undefined ? planned - cumulative : null;
      return { record, remainingAfter };
    });
    items.reverse(); // 新しいものを上に
    return { date, planned, items };
  });
}

export default function HistoryPage() {
  const { records, plans } = useMyTimeData();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteRecord(id);
    setConfirmId(null);
  };

  const groups = buildGroups(records, plans);

  return (
    <div className="flex flex-1 flex-col gap-5 pb-10 animate-fade-in">
      <PageHeader title="履歴" subtitle="これまでの自由時間の使い方を振り返れます。" />

      {groups.length === 0 ? (
        <div className="px-5">
          <Card className="flex flex-col items-center gap-2 py-10 text-center">
            <p className="text-sm text-[var(--muted)]">まだ記録がありません</p>
            <p className="text-xs text-[var(--muted)]">
              自由時間タイマーを使うと、ここに記録が表示されます。
            </p>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col gap-5 px-5">
          {groups.map((group) => (
            <div key={group.date} className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold">{dateFormatter.format(strToDate(group.date))}</h2>
                {group.planned !== undefined ? (
                  <span className="text-xs text-[var(--muted)]">
                    設定 {formatDuration(group.planned)}
                  </span>
                ) : (
                  <span className="text-xs text-[var(--muted)]">設定なし</span>
                )}
              </div>
              <Card className="flex flex-col divide-y divide-[var(--border)] p-0">
                {group.items.map(({ record, remainingAfter }) => (
                  <div key={record.id} className="flex items-center gap-3 px-4 py-3.5">
                    <span className="text-2xl">{emojiFor(record.satisfaction)}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="text-sm font-bold">{formatDuration(record.duration)}</p>
                        <span className="text-xs text-[var(--muted)]">
                          {msToClockLabel(record.startTime)}〜{msToClockLabel(record.endTime)}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {record.tag && <Badge tone="neutral">{record.tag}</Badge>}
                        {remainingAfter === null ? (
                          <span className="text-xs text-[var(--muted)]">設定に対する記録なし</span>
                        ) : remainingAfter >= 0 ? (
                          <span className="text-xs text-[var(--muted)]">
                            この時点で残り {formatDuration(remainingAfter)}
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--danger)]">
                            この時点で +{formatDuration(Math.abs(remainingAfter))} オーバー
                          </span>
                        )}
                      </div>
                    </div>

                    {confirmId === record.id ? (
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="rounded-lg bg-[var(--danger-soft)] px-2.5 py-1.5 text-xs font-bold text-[var(--danger)]"
                        >
                          削除
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="rounded-lg bg-[var(--surface-2)] px-2.5 py-1.5 text-xs font-bold text-[var(--muted)]"
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(record.id)}
                        aria-label="削除"
                        className="shrink-0 rounded-lg p-2 text-[var(--muted)] transition-colors hover:text-[var(--danger)]"
                      >
                        <TrashIcon className="h-4.5 w-4.5" />
                      </button>
                    )}
                  </div>
                ))}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
