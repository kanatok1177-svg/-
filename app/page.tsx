"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Badge, Button, Card, ProgressBar } from "@/components/ui";
import { addRecord, generateId, setActiveTimer, setPendingFinish, useMyTimeData } from "@/lib/store";
import { formatClock, formatDuration, msToClockLabel, todayStr } from "@/lib/time";
import {
  NOTIFY_THRESHOLDS,
  messageForThreshold,
  requestNotificationPermission,
  sendFreeTimeNotification,
} from "@/lib/notifications";
import type { ActiveTimer, DailyPlanMap, PendingFinish, Satisfaction, TimeRecord } from "@/lib/types";
import { TAG_OPTIONS } from "@/lib/types";

const SATISFACTION_OPTIONS: { value: Satisfaction; emoji: string; label: string }[] = [
  { value: 3, emoji: "😊", label: "最高" },
  { value: 2, emoji: "😐", label: "普通" },
  { value: 1, emoji: "😞", label: "いまいち" },
];

export default function HomePage() {
  const { plans, records, activeTimer, pendingFinish, storageAvailable } = useMyTimeData();
  const [now, setNow] = useState<number>(() => Date.now());
  const [today, setToday] = useState<string>(() => todayStr());

  // 1秒ごとに時計を更新（タイマー表示・日付が変わったことの検知に使う）
  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
      setToday((prev) => {
        const t = todayStr();
        return prev === t ? prev : t;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // 残り自由時間のしきい値通知
  useEffect(() => {
    if (!activeTimer) return;
    const plannedForSession = plans[activeTimer.date] ?? 0;
    const usedBeforeMinutes = records
      .filter((r) => r.date === activeTimer.date)
      .reduce((sum, r) => sum + Math.max(0, r.duration), 0);
    const elapsedSeconds = Math.max(0, Math.floor((now - activeTimer.startTime) / 1000));
    const totalUsedSeconds = usedBeforeMinutes * 60 + elapsedSeconds;
    const remainingSeconds = plannedForSession * 60 - totalUsedSeconds;

    const already = activeTimer.notifiedThresholds;
    const toNotify = NOTIFY_THRESHOLDS.filter(
      (th) => remainingSeconds <= th * 60 && !already.includes(th)
    );
    if (toNotify.length > 0) {
      toNotify.forEach((th) => sendFreeTimeNotification("MyTime", messageForThreshold(th)));
      setActiveTimer({ ...activeTimer, notifiedThresholds: [...already, ...toNotify] });
    }
  }, [now, activeTimer, plans, records]);

  const hasPlanToday = plans[today] !== undefined;

  const handleStart = useCallback(() => {
    if (plans[today] === undefined) return;
    void requestNotificationPermission();
    setActiveTimer({ startTime: Date.now(), date: today, notifiedThresholds: [] });
  }, [plans, today]);

  const handleStop = useCallback(() => {
    if (!activeTimer) return;
    const endTime = Date.now();
    const rawMs = endTime - activeTimer.startTime;
    setActiveTimer(null);
    if (rawMs <= 0) return; // 時計のずれ等、異常な計測は破棄する
    const durationMinutes = Math.max(1, Math.round(rawMs / 60000));
    setPendingFinish({
      date: activeTimer.date,
      startTime: activeTimer.startTime,
      endTime,
      duration: durationMinutes,
    });
  }, [activeTimer]);

  const handleFinish = useCallback(
    (satisfaction: Satisfaction, tag: string | undefined) => {
      if (!pendingFinish) return;
      const record: TimeRecord = {
        id: generateId(),
        date: pendingFinish.date,
        startTime: pendingFinish.startTime,
        endTime: pendingFinish.endTime,
        duration: pendingFinish.duration,
        satisfaction,
        tag,
      };
      addRecord(record);
      setPendingFinish(null);
    },
    [pendingFinish]
  );

  return (
    <div className="flex flex-1 flex-col gap-5 px-5 pb-6 pt-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight">MyTime</h1>
        {!storageAvailable && (
          <span className="text-xs font-medium text-[var(--danger)]">
            データを保存できません
          </span>
        )}
      </div>

      {pendingFinish ? (
        <FinishingView pendingFinish={pendingFinish} onFinish={handleFinish} />
      ) : activeTimer ? (
        <RunningView
          activeTimer={activeTimer}
          plans={plans}
          records={records}
          now={now}
          onStop={handleStop}
        />
      ) : hasPlanToday ? (
        <ReadyView
          plannedMinutes={plans[today] ?? 0}
          records={records}
          today={today}
          onStart={handleStart}
        />
      ) : (
        <NoPlanView />
      )}

      <RecentRecords records={records} />
    </div>
  );
}

// ---------- 予定未設定 ----------

function NoPlanView() {
  return (
    <Card className="flex flex-col items-center gap-4 bg-[var(--accent-soft)] px-6 py-10 text-center">
      <p className="text-sm font-semibold text-[var(--accent)]">今日の自由時間はまだ未設定です</p>
      <h2 className="text-2xl font-bold leading-snug">
        今日、自分にはあと
        <br />
        どれくらい自由な時間がある？
      </h2>
      <p className="text-sm text-[var(--muted)]">
        今日の予定を入力するだけで、自由に使える時間がわかります。
      </p>
      <Link href="/calculate" className="w-full">
        <Button variant="primary">今日の自由時間を計算する</Button>
      </Link>
    </Card>
  );
}

// ---------- 予定設定済み・タイマー未実行 ----------

function ReadyView({
  plannedMinutes,
  records,
  today,
  onStart,
}: {
  plannedMinutes: number;
  records: TimeRecord[];
  today: string;
  onStart: () => void;
}) {
  const usedMinutes = records
    .filter((r) => r.date === today)
    .reduce((sum, r) => sum + Math.max(0, r.duration), 0);
  const remaining = plannedMinutes - usedMinutes;
  const isOver = remaining < 0;
  const isUsedUp = remaining <= 0;
  const ratio = plannedMinutes > 0 ? usedMinutes / plannedMinutes : 1;

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col items-center gap-2 py-8 text-center">
        <p className="text-sm font-semibold text-[var(--muted)]">今日の自由時間・残り</p>
        <p
          className={`text-5xl font-black tabular-nums tracking-tight ${
            isOver ? "text-[var(--danger)]" : "text-[var(--accent)]"
          }`}
        >
          {isOver ? `+${formatDuration(Math.abs(remaining))}` : formatDuration(remaining)}
        </p>
        {isOver && <Badge tone="danger">オーバー</Badge>}
        {!isOver && isUsedUp && <Badge tone="warn">使い切りました</Badge>}

        <div className="mt-4 w-full">
          <ProgressBar ratio={ratio} tone={isOver ? "over" : ratio > 0.8 ? "warn" : "normal"} />
        </div>
        <div className="mt-2 flex w-full justify-between text-xs text-[var(--muted)]">
          <span>使用済み：{formatDuration(usedMinutes)}</span>
          <span>設定：{formatDuration(plannedMinutes)}</span>
        </div>
      </Card>

      <Button variant="primary" onClick={onStart} className="py-5 text-lg">
        自由時間を開始
      </Button>

      <Link href="/calculate">
        <Button variant="ghost" full>
          自由時間を計算しなおす
        </Button>
      </Link>
    </div>
  );
}

// ---------- タイマー実行中 ----------

function RunningView({
  activeTimer,
  plans,
  records,
  now,
  onStop,
}: {
  activeTimer: ActiveTimer;
  plans: DailyPlanMap;
  records: TimeRecord[];
  now: number;
  onStop: () => void;
}) {
  const plannedForSession = plans[activeTimer.date] ?? 0;
  const usedBeforeMinutes = records
    .filter((r) => r.date === activeTimer.date)
    .reduce((sum, r) => sum + Math.max(0, r.duration), 0);
  const elapsedSeconds = Math.max(0, Math.floor((now - activeTimer.startTime) / 1000));
  const totalUsedSeconds = usedBeforeMinutes * 60 + elapsedSeconds;
  const plannedSeconds = plannedForSession * 60;
  const remainingSeconds = plannedSeconds - totalUsedSeconds;
  const isOver = remainingSeconds < 0;
  const isUsedUp = remainingSeconds <= 0;
  const remainingMinutes = Math.max(0, Math.round(remainingSeconds / 60));
  const overMinutes = Math.round(Math.abs(Math.min(0, remainingSeconds)) / 60);
  const ratio = plannedSeconds > 0 ? totalUsedSeconds / plannedSeconds : 1;

  return (
    <Card className="flex flex-col items-center gap-3 bg-[var(--accent-soft)] py-8 text-center">
      <p className="text-sm font-semibold text-[var(--accent)]">自由時間を使用中</p>
      <p className="font-mono text-6xl font-black tabular-nums tracking-tight">
        {formatClock(elapsedSeconds)}
      </p>

      <div className="mt-2 w-full">
        <ProgressBar ratio={ratio} tone={isOver ? "over" : ratio > 0.8 ? "warn" : "normal"} />
      </div>

      <div className="mt-1 flex flex-col items-center gap-1">
        <p className="text-xs font-semibold text-[var(--muted)]">今日の残り</p>
        <p className={`text-2xl font-bold tabular-nums ${isOver ? "text-[var(--danger)]" : ""}`}>
          {isOver ? `+${formatDuration(overMinutes)}オーバー` : formatDuration(remainingMinutes)}
        </p>
        {isUsedUp && (
          <p className={`text-xs font-semibold ${isOver ? "text-[var(--danger)]" : "text-[var(--warn)]"}`}>
            今日の自由時間を使い切りました
          </p>
        )}
      </div>

      <div className="mt-4 w-full">
        <Button variant="secondary" onClick={onStop} className="py-4 text-base">
          終了
        </Button>
      </div>
    </Card>
  );
}

// ---------- 終了後：満足度入力 ----------

function FinishingView({
  pendingFinish,
  onFinish,
}: {
  pendingFinish: PendingFinish;
  onFinish: (satisfaction: Satisfaction, tag: string | undefined) => void;
}) {
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  return (
    <Card className="flex flex-col items-center gap-5 py-8 text-center animate-fade-in">
      <div>
        <p className="text-sm font-semibold text-[var(--muted)]">おつかれさまでした</p>
        <p className="mt-1 text-3xl font-black">{formatDuration(pendingFinish.duration)}</p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {msToClockLabel(pendingFinish.startTime)}〜{msToClockLabel(pendingFinish.endTime)}
        </p>
      </div>

      <div className="w-full">
        <p className="mb-3 text-sm font-semibold">満足度は？</p>
        <div className="grid grid-cols-3 gap-3">
          {SATISFACTION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFinish(opt.value, selectedTag)}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] py-4 text-3xl transition-transform active:scale-95"
            >
              <span>{opt.emoji}</span>
              <span className="text-xs font-semibold text-[var(--muted)]">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2 text-xs font-semibold text-[var(--muted)]">
          タグ（任意・先に選んでから満足度をタップ）
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag((prev) => (prev === tag ? undefined : tag))}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                selectedTag === tag
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ---------- 最近の記録 ----------

function RecentRecords({ records }: { records: TimeRecord[] }) {
  const recent = [...records].sort((a, b) => b.startTime - a.startTime).slice(0, 3);
  if (recent.length === 0) return null;

  const emojiFor = (s: Satisfaction) => (s === 3 ? "😊" : s === 2 ? "😐" : "😞");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[var(--muted)]">最近の記録</h2>
        <Link href="/history" className="text-xs font-semibold text-[var(--accent)]">
          すべて見る
        </Link>
      </div>
      <Card className="flex flex-col divide-y divide-[var(--border)] p-0">
        {recent.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{emojiFor(r.satisfaction)}</span>
              <div>
                <p className="text-sm font-semibold">{formatDuration(r.duration)}</p>
                <p className="text-xs text-[var(--muted)]">
                  {r.date}
                  {r.tag ? ` ・ ${r.tag}` : ""}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
