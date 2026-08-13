type GoalRingProps = {
  /** 0〜1 の達成率 */
  progress: number;
  success: boolean;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
};

export default function GoalRing({ progress, success, size = 176, strokeWidth = 14, children }: GoalRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(progress, 0), 1);
  const offset = circumference * (1 - clamped);
  const center = size / 2;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-slate-100"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={`fill-none transition-[stroke-dashoffset] duration-700 ease-out ${
            success ? "stroke-emerald-500" : "stroke-indigo-500"
          }`}
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        {children}
      </div>
    </div>
  );
}
