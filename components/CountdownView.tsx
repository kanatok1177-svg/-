"use client";

import { SmartphoneNfc } from "lucide-react";

interface CountdownViewProps {
  remaining: number;
  total: number;
  task?: string;
  onCancel: () => void;
}

export default function CountdownView({
  remaining,
  total,
  task,
  onCancel,
}: CountdownViewProps) {
  const progress = 1 - remaining / total;

  return (
    <div className="flex h-full w-full flex-col items-center justify-between px-6 py-10">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70">
          <SmartphoneNfc size={14} />
          スマホを裏返して、今すぐ机に置いてください
        </div>

        <div
          key={remaining}
          className="animate-tick select-none text-[7.5rem] font-black leading-none tracking-tighter text-white tabular-nums sm:text-[10rem]"
        >
          {remaining}
        </div>

        {task ? (
          <p className="max-w-xs truncate rounded-full bg-white/5 px-4 py-2 text-sm text-white/60">
            {task}
          </p>
        ) : null}

        <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-accent transition-all duration-1000 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onCancel}
        className="text-xs text-white/30 underline-offset-4 transition-colors hover:text-white/60 hover:underline"
      >
        やめる
      </button>
    </div>
  );
}
