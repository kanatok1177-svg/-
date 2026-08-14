// 共通の見た目パーツ（カード・ボタン・プログレスバー）。
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  full?: boolean;
};

export function Button({
  variant = "primary",
  full = true,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-[15px] font-bold transition-all active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100";
  const variants: Record<string, string> = {
    primary: "bg-[var(--accent)] text-[var(--accent-contrast)] hover:brightness-105",
    secondary:
      "bg-[var(--surface-2)] text-[var(--foreground)] border border-[var(--border)]",
    ghost: "bg-transparent text-[var(--accent)]",
    danger: "bg-[var(--surface-2)] text-[var(--danger)] border border-[var(--border)]",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${full ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ProgressBar({
  ratio,
  tone = "normal",
}: {
  ratio: number; // 0〜1 を超えてもよい（超過表現のためクランプは呼び出し側で）
  tone?: "normal" | "warn" | "over";
}) {
  const clamped = Math.min(1, Math.max(0, ratio));
  const colors: Record<string, string> = {
    normal: "bg-[var(--accent)]",
    warn: "bg-[var(--warn)]",
    over: "bg-[var(--danger)]",
  };
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
      <div
        className={`h-full rounded-full transition-[width] duration-500 ease-out ${colors[tone]}`}
        style={{ width: `${clamped * 100}%` }}
      />
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "warn" | "danger";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-[var(--surface-2)] text-[var(--muted)]",
    accent: "bg-[var(--accent-soft)] text-[var(--accent)]",
    warn: "bg-[var(--warn-soft)] text-[var(--warn)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function StatTile({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "accent" | "danger";
}) {
  const toneClass =
    tone === "accent"
      ? "text-[var(--accent)]"
      : tone === "danger"
        ? "text-[var(--danger)]"
        : "text-[var(--foreground)]";
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-[var(--surface-2)] px-4 py-3.5">
      <span className="text-xs font-medium text-[var(--muted)]">{label}</span>
      <span className={`text-lg font-black tabular-nums ${toneClass}`}>{value}</span>
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="px-1 text-sm font-bold text-[var(--muted)]">{children}</h2>;
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="px-5 pb-2 pt-8">
      <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>}
    </header>
  );
}
