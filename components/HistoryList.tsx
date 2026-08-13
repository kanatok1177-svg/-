"use client";

import { History, CheckCircle2 } from "lucide-react";
import { StudyLog } from "@/lib/types";
import { formatLogDate, formatTime } from "@/lib/format";

interface HistoryListProps {
  logs: StudyLog[];
}

const MAX_VISIBLE = 8;

export default function HistoryList({ logs }: HistoryListProps) {
  const visible = logs.slice(0, MAX_VISIBLE);

  return (
    <section className="mx-auto w-full max-w-xl px-5 pb-10">
      <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
        <History size={14} />
        学習開始ログ
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-surface-border px-4 py-8 text-center text-xs text-zinc-600">
          まだ記録がありません。最初の1分を始めましょう。
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((log) => (
            <li
              key={log.id}
              className="flex items-center gap-3 rounded-2xl border border-surface-border bg-surface-card px-4 py-3"
            >
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                <CheckCircle2 size={16} strokeWidth={2.5} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-zinc-200">
                  {log.task ?? "タスク未設定"}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {formatLogDate(log.date)} ・ {formatTime(log.timestamp)} ・{" "}
                  {log.durationSec}秒達成
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
