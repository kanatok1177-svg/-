"use client";

import { Flame, Sparkles } from "lucide-react";

interface HeaderProps {
  streak: number;
  todayCount: number;
}

export default function Header({ streak, todayCount }: HeaderProps) {
  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-2 px-4 pt-6 sm:px-5 sm:pt-8">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Sparkles size={18} strokeWidth={2.25} />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="whitespace-nowrap text-sm font-semibold tracking-tight text-zinc-100">
              1分スタート
            </p>
            <p className="whitespace-nowrap text-[10px] text-zinc-500">
              脱スマホ・勉強スイッチ
            </p>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1.5">
          <Badge
            icon={<Flame size={14} strokeWidth={2.5} className="text-orange-400" />}
            label="ストリーク"
            value={`${streak}日`}
          />
          <Badge
            icon={<Sparkles size={14} strokeWidth={2.5} className="text-accent-soft" />}
            label="今日"
            value={`${todayCount}回`}
          />
        </div>
      </div>
    </header>
  );
}

function Badge({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1 whitespace-nowrap rounded-full border border-surface-border bg-surface-card px-2.5 py-1.5">
      {icon}
      <span className="hidden text-[11px] text-zinc-500 min-[380px]:inline">
        {label}
      </span>
      <span className="text-xs font-semibold text-zinc-100">{value}</span>
    </div>
  );
}
