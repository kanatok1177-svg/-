"use client";

import { useState } from "react";
import { Play, PencilLine } from "lucide-react";

interface StartCardProps {
  onStart: (task: string) => void;
}

export default function StartCard({ onStart }: StartCardProps) {
  const [task, setTask] = useState("");

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-8 px-6 py-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
          迷ったら、まず1分。
        </h1>
        <p className="text-sm text-zinc-500">
          考える前に押す。それだけでスマホ依存のループは切れます。
        </p>
      </div>

      {/* 最優先：超巨大ワンタップボタン */}
      <button
        type="button"
        onClick={() => onStart(task)}
        className="group relative flex h-64 w-64 flex-shrink-0 animate-pulse-glow flex-col items-center justify-center gap-2 rounded-full bg-gradient-to-b from-accent to-accent-glow text-white shadow-[0_18px_60px_-15px_rgba(91,140,255,0.6)] transition-transform duration-200 ease-out active:scale-95 sm:h-72 sm:w-72"
        aria-label="とりあえず1分始める"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 group-active:scale-90">
          <Play size={32} strokeWidth={2.5} fill="currentColor" />
        </span>
        <span className="text-2xl font-bold leading-tight sm:text-3xl">
          とりあえず
          <br />
          1分始める
        </span>
        <span className="text-xs font-medium text-white/70">
          （文字入力不要・ワンタップ）
        </span>
      </button>

      {/* サブ：任意タスク入力欄 */}
      <div className="w-full max-w-sm">
        <label className="mb-2 flex items-center gap-1.5 text-xs text-zinc-500">
          <PencilLine size={13} />
          今からやること（任意）
        </label>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="例：数学ワーク P.20"
          maxLength={60}
          className="w-full rounded-2xl border border-surface-border bg-surface-card px-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-accent/60"
        />
      </div>
    </div>
  );
}
