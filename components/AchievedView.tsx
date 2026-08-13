"use client";

import { PartyPopper, Check, ArrowRight, Flame, Sparkles } from "lucide-react";

interface AchievedViewProps {
  task?: string;
  saved: boolean;
  streak: number;
  todayCount: number;
  onContinue: () => void;
  onSave: () => void;
}

export default function AchievedView({
  task,
  saved,
  streak,
  todayCount,
  onContinue,
  onSave,
}: AchievedViewProps) {
  return (
    <div className="flex h-full w-full animate-fade-in flex-col items-center justify-center gap-8 px-6 py-10 text-center">
      <div className="flex h-20 w-20 animate-scale-in items-center justify-center rounded-full bg-success/15 text-success">
        <PartyPopper size={36} strokeWidth={2} />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">1分達成！</h2>
        <p className="text-sm text-white/60">脳はすでに勉強モードです</p>
        {task ? (
          <p className="mt-2 max-w-xs truncate rounded-full bg-white/5 px-4 py-2 text-xs text-white/50">
            {task}
          </p>
        ) : null}

        {saved ? (
          <div className="mt-3 flex animate-scale-in items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Flame size={14} strokeWidth={2.5} className="text-orange-400" />
              <span className="text-[11px] text-white/50">ストリーク</span>
              <span className="text-xs font-bold text-white">{streak}日</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Sparkles size={14} strokeWidth={2.5} className="text-accent-soft" />
              <span className="text-[11px] text-white/50">今日</span>
              <span className="text-xs font-bold text-white">{todayCount}回</span>
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saved}
          className="flex items-center justify-center gap-2 rounded-2xl bg-success px-6 py-4 text-sm font-bold text-black transition-transform active:scale-95 disabled:opacity-60"
        >
          {saved ? (
            <>
              <Check size={16} strokeWidth={3} />
              記録に保存しました
            </>
          ) : (
            "今日の記録に保存"
          )}
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-white/80 transition-transform active:scale-95"
        >
          このまま勉強を続ける（画面を閉じる）
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
