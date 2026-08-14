// 時間・分の2つの数値入力をまとめた入力欄。分単位の合計値で状態を持つ。
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export default function DurationField({
  label,
  minutes,
  onChange,
}: {
  label: string;
  minutes: number;
  onChange: (minutes: number) => void;
}) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={23}
          value={h}
          onChange={(e) => onChange(clamp(Number(e.target.value) || 0, 0, 23) * 60 + m)}
          className="w-14 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-center text-sm tabular-nums"
        />
        <span className="text-xs text-[var(--muted)]">時間</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={59}
          step={5}
          value={m}
          onChange={(e) => onChange(h * 60 + clamp(Number(e.target.value) || 0, 0, 59))}
          className="w-14 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-center text-sm tabular-nums"
        />
        <span className="text-xs text-[var(--muted)]">分</span>
      </div>
    </div>
  );
}
