"use client";

import { Flame, Sparkles } from "lucide-react";

interface HeaderProps {
  streak: number;
  todayCount: number;
}

export default function Header({ streak, todayCount }: HeaderProps) {
  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-xl items-center justify-between px-5 pt-6 sm:pt-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Sparkles size={18} strokeWidth={2.25} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-zinc-100">
              1分スタート
            </p>
            <p className="text-[11px] text-zinc-500">脱スマホ・勉強スイッチ</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
    <div className="flex items-center gap-1.5 rounded-full border border-surface-border bg-surface-card px-3 py-1.5">
      {icon}
      <span className="text-[11px] text-zinc-500">{label}</span>
      <span className="text-xs font-semibold text-zinc-100">{value}</span>
    </div>
  );
}
