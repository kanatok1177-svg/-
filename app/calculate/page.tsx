"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import DurationField from "@/components/DurationField";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { setPlanForDate } from "@/lib/store";
import { calculateDetailedFreeTime, formatDuration, todayStr } from "@/lib/time";

const PRESETS = [
  { label: "30分", minutes: 30 },
  { label: "1時間", minutes: 60 },
  { label: "2時間", minutes: 120 },
  { label: "3時間", minutes: 180 },
  { label: "4時間", minutes: 240 },
];

type Tab = "simple" | "detailed";

export default function CalculatePage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("simple");

  // かんたん設定
  const [presetMinutes, setPresetMinutes] = useState<number | null>(null);
  const [customMode, setCustomMode] = useState(false);
  const [customH, setCustomH] = useState(1);
  const [customM, setCustomM] = useState(0);

  const simpleSelectedMinutes = customMode ? customH * 60 + customM : presetMinutes;

  // 詳細計算
  const [wake, setWake] = useState("07:00");
  const [sleep, setSleep] = useState("23:00");
  const [schoolMin, setSchoolMin] = useState(0);
  const [studyMin, setStudyMin] = useState(0);
  const [clubMin, setClubMin] = useState(0);
  const [mealMin, setMealMin] = useState(0);
  const [bathMin, setBathMin] = useState(0);
  const [otherMin, setOtherMin] = useState(0);
  const [showDetailedResult, setShowDetailedResult] = useState(false);

  const detailedResult = useMemo(
    () =>
      calculateDetailedFreeTime({
        wake,
        sleep,
        schoolMin,
        studyMin,
        clubMin,
        mealMin,
        bathMin,
        otherMin,
      }),
    [wake, sleep, schoolMin, studyMin, clubMin, mealMin, bathMin, otherMin]
  );

  const applyPlan = (minutes: number) => {
    setPlanForDate(todayStr(), Math.max(0, Math.round(minutes)));
    router.push("/");
  };

  return (
    <div className="flex flex-1 flex-col gap-4 pb-10 animate-fade-in">
      <PageHeader
        title="今日の自由時間を計算"
        subtitle="必要な項目だけ入力すればOKです。"
      />

      <div className="px-5">
        <div className="flex rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-1">
          <TabButton active={tab === "simple"} onClick={() => setTab("simple")}>
            かんたん設定
          </TabButton>
          <TabButton active={tab === "detailed"} onClick={() => setTab("detailed")}>
            詳細に計算
          </TabButton>
        </div>
      </div>

      {tab === "simple" ? (
        <div className="flex flex-col gap-4 px-5">
          <Card>
            <p className="mb-3 text-sm font-semibold">今日使える自由時間を選ぶ</p>
            <div className="grid grid-cols-3 gap-2.5">
              {PRESETS.map((p) => (
                <button
                  key={p.minutes}
                  onClick={() => {
                    setPresetMinutes(p.minutes);
                    setCustomMode(false);
                  }}
                  className={`rounded-2xl border px-2 py-3.5 text-sm font-bold transition-colors ${
                    !customMode && presetMinutes === p.minutes
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--foreground)]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setCustomMode(true);
                  setPresetMinutes(null);
                }}
                className={`rounded-2xl border px-2 py-3.5 text-sm font-bold transition-colors ${
                  customMode
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--foreground)]"
                }`}
              >
                自分で入力
              </button>
            </div>

            {customMode && (
              <div className="mt-4 border-t border-[var(--border)] pt-4">
                <DurationField
                  label="自由時間"
                  minutes={customH * 60 + customM}
                  onChange={(min) => {
                    setCustomH(Math.floor(min / 60));
                    setCustomM(min % 60);
                  }}
                />
              </div>
            )}
          </Card>

          {simpleSelectedMinutes !== null && (
            <ResultCard minutes={simpleSelectedMinutes} onConfirm={applyPlan} />
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 px-5">
          <Card>
            <p className="mb-1 text-sm font-semibold">起床・就寝</p>
            <p className="mb-3 text-xs text-[var(--muted)]">
              就寝が起床より前の時刻なら、日をまたぐものとして計算します。
            </p>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">起床時間</span>
              <input
                type="time"
                value={wake}
                onChange={(e) => setWake(e.target.value)}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm tabular-nums"
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">就寝時間</span>
              <input
                type="time"
                value={sleep}
                onChange={(e) => setSleep(e.target.value)}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm tabular-nums"
              />
            </div>
          </Card>

          <Card>
            <p className="mb-1 text-sm font-semibold">自由時間ではない予定</p>
            <p className="mb-2 text-xs text-[var(--muted)]">不要な項目は0分のままでOKです。</p>
            <div className="divide-y divide-[var(--border)]">
              <DurationField label="学校・仕事" minutes={schoolMin} onChange={setSchoolMin} />
              <DurationField label="勉強時間" minutes={studyMin} onChange={setStudyMin} />
              <DurationField label="部活・習い事" minutes={clubMin} onChange={setClubMin} />
              <DurationField label="食事" minutes={mealMin} onChange={setMealMin} />
              <DurationField label="風呂" minutes={bathMin} onChange={setBathMin} />
              <DurationField label="その他の予定" minutes={otherMin} onChange={setOtherMin} />
            </div>
          </Card>

          <Button variant="primary" onClick={() => setShowDetailedResult(true)}>
            計算する
          </Button>

          {showDetailedResult && (
            <div className="flex flex-col gap-3">
              <Card className="flex flex-col gap-1.5 text-sm text-[var(--muted)]">
                <div className="flex justify-between">
                  <span>起床〜就寝</span>
                  <span className="font-semibold text-[var(--foreground)]">
                    {formatDuration(detailedResult.awakeMinutes)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>予定の合計</span>
                  <span className="font-semibold text-[var(--foreground)]">
                    {formatDuration(detailedResult.busyMinutes)}
                  </span>
                </div>
                {detailedResult.overBudget && (
                  <p className="pt-1 text-xs text-[var(--danger)]">
                    予定の合計が起床〜就寝の時間を超えています。自由時間は0分になります。
                  </p>
                )}
              </Card>
              <ResultCard minutes={detailedResult.freeMinutes} onConfirm={applyPlan} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-colors ${
        active ? "bg-[var(--surface)] text-[var(--accent)] shadow-sm" : "text-[var(--muted)]"
      }`}
    >
      {children}
    </button>
  );
}

function ResultCard({
  minutes,
  onConfirm,
}: {
  minutes: number;
  onConfirm: (minutes: number) => void;
}) {
  return (
    <Card className="flex flex-col items-center gap-3 bg-[var(--accent-soft)] py-7 text-center animate-fade-in">
      {minutes <= 0 ? (
        <Badge tone="warn">自由時間は0分です</Badge>
      ) : (
        <Badge tone="accent">今日の自由時間</Badge>
      )}
      <p className="text-4xl font-black tracking-tight text-[var(--accent)]">
        {formatDuration(minutes)}
      </p>
      <div className="mt-2 w-full">
        <Button variant="primary" onClick={() => onConfirm(minutes)}>
          この時間を今日の自由時間に設定
        </Button>
      </div>
    </Card>
  );
}
