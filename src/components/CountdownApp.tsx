"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

type EventItem = {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
};

const STORAGE_KEY = "event-countdown:events";

function todayAtMidnight() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

function daysUntil(dateStr: string) {
  const target = parseDateOnly(dateStr);
  const diffMs = target.getTime() - todayAtMidnight().getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function formatDateLabel(dateStr: string) {
  const d = parseDateOnly(dateStr);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

function statusLabel(days: number) {
  if (days > 0) return { text: `あと ${days} 日`, tone: "upcoming" as const };
  if (days === 0) return { text: "本日です！", tone: "today" as const };
  return { text: `${Math.abs(days)} 日前に終了`, tone: "past" as const };
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function CountdownApp() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // One-time sync from the external localStorage store on mount.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setEvents(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events, hydrated]);

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) => parseDateOnly(a.date).getTime() - parseDateOnly(b.date).getTime()
      ),
    [events]
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("イベント名を入力してください");
      return;
    }
    if (!date) {
      setError("日付を選択してください");
      return;
    }
    setEvents((prev) => [...prev, { id: createId(), name: trimmedName, date }]);
    setName("");
    setDate("");
    setError("");
  }

  function handleDelete(id: string) {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-5 py-12 sm:py-16 flex flex-col gap-10">
      <header className="flex flex-col items-center gap-2 text-center">
        <span className="text-xs font-medium tracking-widest text-accent uppercase">
          Event Countdown
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          イベントカウントダウン
        </h1>
        <p className="text-sm text-muted">
          楽しみな予定までの日数を、シンプルに数えましょう。
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-surface border border-border rounded-2xl p-6 shadow-sm"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="event-name" className="text-sm font-medium">
            イベント名
          </label>
          <input
            id="event-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：夏の旅行"
            className="rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
            maxLength={60}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="event-date" className="text-sm font-medium">
            日付
          </label>
          <input
            id="event-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-strong active:scale-[0.98]"
        >
          追加する
        </button>
      </form>

      <section className="flex flex-col gap-3">
        {hydrated && sortedEvents.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-14 text-center text-muted">
            <p className="text-sm">まだイベントが登録されていません</p>
            <p className="text-xs">上のフォームから最初のイベントを追加しましょう</p>
          </div>
        )}

        {sortedEvents.map((ev) => {
          const days = daysUntil(ev.date);
          const status = statusLabel(days);
          return (
            <div
              key={ev.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <h2 className="truncate text-base font-semibold">{ev.name}</h2>
                <p className="text-xs text-muted">{formatDateLabel(ev.date)}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={
                    "rounded-full px-3.5 py-1.5 text-sm font-bold whitespace-nowrap " +
                    (status.tone === "past"
                      ? "bg-surface-muted text-muted"
                      : status.tone === "today"
                      ? "bg-accent text-white"
                      : "bg-accent-soft text-accent-strong")
                  }
                >
                  {status.text}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(ev.id)}
                  aria-label={`${ev.name} を削除`}
                  className="rounded-full p-2 text-muted transition hover:bg-surface-muted hover:text-danger"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
