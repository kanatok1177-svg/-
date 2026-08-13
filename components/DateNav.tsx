"use client";

import { addDays, formatJP, isToday, todayISODate } from "@/lib/date";

type DateNavProps = {
  date: string;
  onChange: (date: string) => void;
};

export default function DateNav({ date, onChange }: DateNavProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(addDays(date, -1))}
        aria-label="前日"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className="flex flex-1 flex-col items-center gap-1 sm:flex-row sm:justify-center sm:gap-3">
        <span className="text-base font-semibold text-slate-800 whitespace-nowrap">
          {formatJP(date)}
        </span>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => e.target.value && onChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          {!isToday(date) && (
            <button
              type="button"
              onClick={() => onChange(todayISODate())}
              className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100"
            >
              今日
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange(addDays(date, 1))}
        aria-label="翌日"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
