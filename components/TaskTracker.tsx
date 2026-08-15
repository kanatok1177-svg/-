"use client";

import { useMemo, useState } from "react";
import type { Task } from "@/lib/types";
import { useTasks, setTasks } from "@/lib/storage";
import { todayISODate, addDays } from "@/lib/date";
import { createId } from "@/lib/id";
import DateNav from "@/components/DateNav";
import ProgressBar from "@/components/ProgressBar";
import TaskItem from "@/components/TaskItem";

function parseCount(raw: string): number {
  const n = parseInt(raw, 10);
  if (Number.isNaN(n)) return 1;
  return Math.max(1, Math.min(20, n));
}

export default function TaskTracker() {
  const tasks = useTasks();
  const [selectedDate, setSelectedDate] = useState<string>(todayISODate());
  const [newTitle, setNewTitle] = useState("");
  // 個数入力は生の文字列として保持し、確定時(送信・フォーカスアウト)だけ
  // 1〜20に丸める。value を都度クランプすると "1" を消せなくなるため。
  const [countInput, setCountInput] = useState("1");

  const tasksForDate = useMemo(
    () => tasks.filter((t) => t.date === selectedDate).sort((a, b) => a.createdAt - b.createdAt),
    [tasks, selectedDate]
  );

  const previousDate = useMemo(() => addDays(selectedDate, -1), [selectedDate]);
  const previousDateTasks = useMemo(
    () => tasks.filter((t) => t.date === previousDate).sort((a, b) => a.createdAt - b.createdAt),
    [tasks, previousDate]
  );

  const completedCount = tasksForDate.filter((t) => t.completed).length;

  const overallStats = useMemo(() => {
    const totalCompleted = tasks.filter((t) => t.completed).length;
    const days = new Set(tasks.map((t) => t.date)).size;
    return { total: tasks.length, totalCompleted, days };
  }, [tasks]);

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    const count = parseCount(countInput);
    const now = Date.now();
    const newTasks: Task[] = Array.from({ length: count }, (_, i) => ({
      id: createId(),
      // 複数件まとめて追加するときは "(1/3)" のように番号を付けて区別できるようにする
      title: count > 1 ? `${title} (${i + 1}/${count})` : title,
      date: selectedDate,
      completed: false,
      createdAt: now + i,
    }));

    setTasks((prev) => [...prev, ...newTasks]);
    setNewTitle("");
    setCountInput("1");
  }

  function handleCopyPreviousDay() {
    if (previousDateTasks.length === 0) return;

    const now = Date.now();
    const copied: Task[] = previousDateTasks.map((t, i) => ({
      id: createId(),
      title: t.title,
      date: selectedDate,
      completed: false,
      createdAt: now + i,
    }));

    setTasks((prev) => [...prev, ...copied]);
  }

  function handleToggle(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      {overallStats.total > 0 && (
        <p className="text-center text-xs text-slate-500">
          これまでに {overallStats.days} 日間、
          {overallStats.totalCompleted} / {overallStats.total} 件のタスクを完了
        </p>
      )}

      <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-sm sm:p-6">
        <DateNav date={selectedDate} onChange={setSelectedDate} />

        <div className="mt-5">
          <ProgressBar completed={completedCount} total={tasksForDate.length} />
        </div>

        {previousDateTasks.length > 0 && (
          <button
            type="button"
            onClick={handleCopyPreviousDay}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/70 px-3 py-2.5 text-xs font-semibold text-indigo-600 transition hover:border-indigo-300 hover:bg-indigo-100"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            前日のタスクをコピー({previousDateTasks.length}件)
          </button>
        )}

        <form onSubmit={handleAddTask} className="mt-6 flex flex-wrap gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="新しいタスクを入力..."
            maxLength={200}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <div className="flex shrink-0 items-center gap-1 rounded-xl border border-slate-200 bg-white pl-1 pr-2.5 focus-within:ring-2 focus-within:ring-indigo-300">
            <input
              type="number"
              min={1}
              max={20}
              value={countInput}
              onChange={(e) => setCountInput(e.target.value)}
              onBlur={() => setCountInput(String(parseCount(countInput)))}
              aria-label="追加する個数"
              className="w-10 bg-transparent py-2.5 text-center text-sm text-slate-700 focus:outline-none"
            />
            <span className="text-xs text-slate-400">個</span>
          </div>
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:from-indigo-600 hover:to-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            追加
          </button>
        </form>

        <ul className="mt-5 flex flex-col gap-2">
          {tasksForDate.length === 0 ? (
            <li className="flex flex-col items-center gap-2 py-10 text-center text-sm text-slate-500">
              <span className="text-3xl">📝</span>
              この日のタスクはまだありません
            </li>
          ) : (
            tasksForDate.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
            ))
          )}
        </ul>
      </section>

      <p className="text-center text-xs text-slate-500">
        データはこのブラウザ内(LocalStorage)にのみ保存されます
      </p>
    </div>
  );
}
