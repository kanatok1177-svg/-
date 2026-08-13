type ProgressBarProps = {
  completed: number;
  total: number;
};

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-medium text-slate-600">
          進捗状況
        </span>
        <span className="text-sm font-semibold text-indigo-600">
          {completed} / {total}
          <span className="ml-1 text-slate-500 font-normal">({percent}%)</span>
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden ring-1 ring-slate-200/70">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-violet-500 to-fuchsia-500 transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {total > 0 && percent === 100 && (
        <p className="mt-2 text-sm font-medium text-emerald-600">
          🎉 この日のタスクをすべて完了しました！
        </p>
      )}
    </div>
  );
}
