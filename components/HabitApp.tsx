"use client";

import { useState } from "react";
import TaskTracker from "@/components/TaskTracker";
import GoalTracker from "@/components/GoalTracker";

type Tab = "tasks" | "goal";

export default function HabitApp() {
  const [tab, setTab] = useState<Tab>("tasks");

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
          習慣トラッカー
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          毎日のタスクと、続けたい目標をシンプルに管理しよう
        </p>
      </header>

      <nav
        role="tablist"
        aria-label="表示の切り替え"
        className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1"
      >
        <TabButton label="タスク" icon={<ChecklistIcon />} active={tab === "tasks"} onClick={() => setTab("tasks")} />
        <TabButton label="継続目標" icon={<TargetIcon />} active={tab === "goal"} onClick={() => setTab("goal")} />
      </nav>

      <div role="tabpanel">{tab === "tasks" ? <TaskTracker /> : <GoalTracker />}</div>
    </div>
  );
}

function TabButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition ${
        active ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ChecklistIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx={12} cy={12} r={9} />
      <circle cx={12} cy={12} r={5} />
      <circle cx={12} cy={12} r={1} fill="currentColor" stroke="none" />
    </svg>
  );
}
