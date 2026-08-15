"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import CountdownView from "./CountdownView";
import AchievedView from "./AchievedView";
import { useWakeLock } from "@/lib/useWakeLock";
import { playFanfare, playTick } from "@/lib/sound";

const TOTAL_SEC = 60;

interface FocusModalProps {
  task?: string;
  streak: number;
  todayCount: number;
  onClose: () => void;
  onComplete: (task: string | undefined, durationSec: number) => void;
}

type Phase = "counting" | "achieved";

export default function FocusModal({
  task,
  streak,
  todayCount,
  onClose,
  onComplete,
}: FocusModalProps) {
  const [phase, setPhase] = useState<Phase>("counting");
  const [remaining, setRemaining] = useState(TOTAL_SEC);
  const [saved, setSaved] = useState(false);
  const wakeLock = useWakeLock();
  const startedAtRef = useRef<number>(Date.now());
  const lastTickRef = useRef<number>(TOTAL_SEC);
  const loggedRef = useRef(false);

  // カウントダウン中はスクロールを固定し、Wake Lock を取得する
  useEffect(() => {
    void wakeLock.request();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      void wakeLock.release();
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "counting") return;

    startedAtRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - startedAtRef.current) / 1000);
      const next = Math.max(0, TOTAL_SEC - elapsedSec);
      setRemaining(next);

      if (next !== lastTickRef.current) {
        lastTickRef.current = next;
        if (next > 0 && next <= 3) {
          playTick();
        }
      }

      if (next <= 0) {
        clearInterval(interval);
        playFanfare();
        void wakeLock.release();
        // 60秒達成した時点で自動的に記録する（ボタンの押し忘れでストリークが
        // 途切れてしまうのを防ぐため）。ボタンで再度呼ばれても二重記録しない。
        if (!loggedRef.current) {
          loggedRef.current = true;
          onComplete(task, TOTAL_SEC);
          setSaved(true);
        }
        setPhase("achieved");
      }
    }, 200);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleSave = () => {
    if (loggedRef.current) return;
    loggedRef.current = true;
    onComplete(task, TOTAL_SEC);
    setSaved(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black" role="dialog" aria-modal="true">
      {phase === "counting" ? (
        <>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-white/25 transition-colors hover:bg-white/5 hover:text-white/60"
          >
            <X size={18} />
          </button>
          <CountdownView
            remaining={remaining}
            total={TOTAL_SEC}
            task={task}
            onCancel={onClose}
          />
        </>
      ) : (
        <AchievedView
          task={task}
          saved={saved}
          streak={streak}
          todayCount={todayCount}
          onContinue={onClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
