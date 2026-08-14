"use client";

import { useMemo, useState } from "react";
import type { Goal } from "@/lib/types";
import { useGoal, setGoal } from "@/lib/goalStorage";
import { todayISODate, formatJP } from "@/lib/date";
import { createId } from "@/lib/id";
import { calculateStreak, goalMessage } from "@/lib/streak";
import GoalRing from "@/components/GoalRing";

const PRESETS = [
  { label: "3週間", days: 21 },
  { label: "1ヶ月", days: 30 },
  { label: "習慣化", days: 66 },
];

export default function GoalTracker() {
  const goal = useGoal();

  if (!goal) {
    return <GoalCreateForm />;
  }

  return <ActiveGoal goal={goal} />;
}

function GoalCreateForm() {
  const [title, setTitle] = useState("");
  const [targetDays, setTargetDays] = useState(21);
  const [memo, setMemo] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || targetDays < 1) return;

    const goal: Goal = {
      id: createId(),
      title: trimmed,
      targetDays,
      createdAt: Date.now(),
      checkedDates: [],
      memo: memo.trim(),
    };
    setGoal(goal);
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-sm">
      <div className="text-center">
        <span className="text-3xl">🎯</span>
        <h2 className="mt-2 text-lg font-bold text-slate-800">継続したい目標を1つ決めよう</h2>
        <p className="mt-1 text-sm text-slate-500">
          毎日チェックして、目標日数まで続けると継続成功になります
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-600">目標にすること</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: 毎日ストレッチする"
            maxLength={100}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-600">継続日数の目標</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={365}
              value={targetDays}
              onChange={(e) => setTargetDays(Math.max(1, Math.min(365, Number(e.target.value) || 1)))}
              className="w-24 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <span className="text-sm text-slate-500">日間</span>
          </div>
          <div className="mt-1 flex gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.days}
                type="button"
                onClick={() => setTargetDays(preset.days)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  targetDays === preset.days
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {preset.label} ({preset.days}日)
              </button>
            ))}
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-600">
            メモ(具体的にやること)<span className="font-normal text-slate-400">・任意</span>
          </span>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="例: 腹筋20回・腕立て10回を寝る前に行う"
            maxLength={300}
            rows={2}
            className="resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </label>

        <button
          type="submit"
          disabled={!title.trim()}
          className="mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:from-indigo-600 hover:to-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          目標を設定する
        </button>
      </form>
    </section>
  );
}

function ActiveGoal({ goal }: { goal: Goal }) {
  const today = todayISODate();
  const checkedToday = goal.checkedDates.includes(today);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const streak = useMemo(() => calculateStreak(goal.checkedDates, today), [goal.checkedDates, today]);
  const success = streak >= goal.targetDays;
  const progress = goal.targetDays === 0 ? 0 : streak / goal.targetDays;
  const message = goalMessage(streak, goal.targetDays, goal.checkedDates.length > 0);

  function handleToggleToday() {
    setGoal((prev) => {
      if (!prev) return prev;
      const has = prev.checkedDates.includes(today);
      return {
        ...prev,
        checkedDates: has
          ? prev.checkedDates.filter((d) => d !== today)
          : [...prev.checkedDates, today],
      };
    });
  }

  function handleConfirmDelete() {
    setGoal(null);
    setConfirmingDelete(false);
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">継続目標</p>
          <h2 className="mt-0.5 break-words text-lg font-bold text-slate-800">{goal.title}</h2>
        </div>
        <button
          type="button"
          onClick={() => setConfirmingDelete(true)}
          aria-label="目標を削除する"
          className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>

      {confirmingDelete && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-red-50 px-3 py-2.5">
          <span className="text-sm font-medium text-red-700">この目標を削除しますか?</span>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-white"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-600"
            >
              削除する
            </button>
          </div>
        </div>
      )}

      <label className="mt-4 flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-500">メモ(具体的にやること)</span>
        <textarea
          value={goal.memo ?? ""}
          onChange={(e) =>
            setGoal((prev) => (prev ? { ...prev, memo: e.target.value } : prev))
          }
          placeholder="例: 腹筋20回・腕立て10回を寝る前に行う"
          maxLength={300}
          rows={2}
          className="resize-none rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </label>

      <div className="mt-6 flex flex-col items-center gap-4">
        <GoalRing progress={progress} success={success}>
          <span className={`text-2xl font-bold ${success ? "text-emerald-600" : "text-indigo-600"}`}>
            {streak}
            <span className="text-sm font-medium text-slate-400"> / {goal.targetDays}日</span>
          </span>
          <span className="text-xs font-medium text-slate-500">
            {success ? "継続成功" : "連続達成中"}
          </span>
        </GoalRing>

        <p
          className={`text-center text-sm font-semibold ${
            success ? "text-emerald-600" : "text-slate-700"
          }`}
        >
          {message}
        </p>

        <button
          type="button"
          onClick={handleToggleToday}
          aria-pressed={checkedToday}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition ${
            checkedToday
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {checkedToday ? `${formatJP(today)} 達成ずみ` : "今日できたらチェック"}
        </button>
      </div>
    </section>
  );
}
