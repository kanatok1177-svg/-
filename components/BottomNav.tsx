"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalcIcon, HistoryIcon, HomeIcon, StatsIcon } from "./icons";

const NAV_ITEMS = [
  { href: "/", label: "ホーム", Icon: HomeIcon },
  { href: "/calculate", label: "計算", Icon: CalcIcon },
  { href: "/history", label: "履歴", Icon: HistoryIcon },
  { href: "/stats", label: "統計", Icon: StatsIcon },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--surface)]/80">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors"
            >
              <Icon
                className={`h-6 w-6 transition-colors ${
                  active ? "text-[var(--accent)]" : "text-[var(--muted)]"
                }`}
              />
              <span className={active ? "text-[var(--accent)]" : "text-[var(--muted)]"}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
