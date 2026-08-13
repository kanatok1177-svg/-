"use client";

import { PartyPopper, Check, ArrowRight } from "lucide-react";

interface AchievedViewProps {
  task?: string;
  saved: boolean;
  onContinue: () => void;
  onSave: () => void;
}

export default function AchievedView({
  task,
  saved,
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
