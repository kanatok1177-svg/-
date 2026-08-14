// 時間・分の2つの数値入力をまとめた入力欄。分単位の合計値で状態を持つ。
//
// 入力中はテキストをこのコンポーネントがローカルで持ち、親には有効な数値になった
// ときだけ通知する。こうしないと「0」を消した瞬間に親からの value={0} で
// 表示が「0」に巻き戻ってしまい、0を消して打ち直すことができなくなる。
"use client";

import { useState } from "react";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function toDigits(raw: string): string {
  return raw.replace(/[^0-9]/g, "").slice(0, 2);
}

function textToNumber(text: string): number {
  if (text === "") return 0;
  const n = Number(text);
  return Number.isFinite(n) ? n : 0;
}

export default function DurationField({
  label,
  minutes,
  onChange,
}: {
  label: string;
  minutes: number;
  onChange: (minutes: number) => void;
}) {
  const [hText, setHText] = useState(String(Math.floor(minutes / 60)));
  const [mText, setMText] = useState(String(minutes % 60));

  const commit = (nextHText: string, nextMText: string) => {
    onChange(textToNumber(nextHText) * 60 + textToNumber(nextMText));
  };

  const handleHChange = (raw: string) => {
    const next = toDigits(raw);
    setHText(next);
    commit(next, mText);
  };

  const handleMChange = (raw: string) => {
    const next = toDigits(raw);
    setMText(next);
    commit(hText, next);
  };

  const handleHBlur = () => {
    const clamped = clamp(textToNumber(hText), 0, 23);
    setHText(String(clamped));
    commit(String(clamped), mText);
  };

  const handleMBlur = () => {
    const clamped = clamp(textToNumber(mText), 0, 59);
    setMText(String(clamped));
    commit(hText, String(clamped));
  };

  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={hText}
          onFocus={(e) => e.target.select()}
          onChange={(e) => handleHChange(e.target.value)}
          onBlur={handleHBlur}
          className="w-14 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-center text-sm tabular-nums"
        />
        <span className="text-xs text-[var(--muted)]">時間</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={mText}
          onFocus={(e) => e.target.select()}
          onChange={(e) => handleMChange(e.target.value)}
          onBlur={handleMBlur}
          className="w-14 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-center text-sm tabular-nums"
        />
        <span className="text-xs text-[var(--muted)]">分</span>
      </div>
    </div>
  );
}
