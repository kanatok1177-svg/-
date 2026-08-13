"use client";

import { useMemo, useState } from "react";
import type { Task } from "@/lib/types";
import { useTasks, setTasks } from "@/lib/storage";
import { todayISODate } from "@/lib/date";
import DateNav from "@/components/DateNav";
import ProgressBar from "@/components/ProgressBar";
import TaskItem from "@/components/TaskItem";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function TaskTracker() {
  const tasks = useTasks();
  const [selectedDate, setSelectedDate] = useState<string>(todayISODate());
  const [newTitle, setNewTitle] = useState("");

  const tasksForDate = useMemo(
    () => tasks.filter((t) => t.date === selectedDate).sort((a, b) => a.createdAt - b.createdAt),
    [tasks, selectedDate]
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

    const task: Task = {
      id: createId(),
      title,
      date: selectedDate,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [...prev, task]);
    setNewTitle("");
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
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
          習慣トラッカー
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          毎日のタスクをシンプルに管理しよう
        </p>
        {overallStats.total > 0 && (
          <p className="mt-1 text-xs text-slate-400">
            これまでに {overallStats.days} 日間、
            {overallStats.totalCompleted} / {overallStats.total} 件のタスクを完了
          </p>
        )}
      </header>

      <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-sm sm:p-6">
        <DateNav date={selectedDate} onChange={setSelectedDate} />

        <div className="mt-5">
          <ProgressBar completed={completedCount} total={tasksForDate.length} />
        </div>

        <form onSubmit={handleAddTask} className="mt-6 flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="新しいタスクを入力..."
            maxLength={200}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
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
            <li className="flex flex-col items-center gap-2 py-10 text-center text-sm text-slate-400">
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

      <p className="text-center text-xs text-slate-400">
        データはこのブラウザ内(LocalStorage)にのみ保存されます
      </p>
    </div>
  );
}
