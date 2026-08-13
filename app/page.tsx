"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import StartCard from "@/components/StartCard";
import FocusModal from "@/components/FocusModal";
import HistoryList from "@/components/HistoryList";
import { StudyLog } from "@/lib/types";
import { addLog, computeStreak, loadData, sortedLogs, todayCount } from "@/lib/storage";
import { primeAudio, playStartTone } from "@/lib/sound";

export default function HomePage() {
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<{ task?: string } | null>(null);

  // LocalStorage はブラウザにしか無いため、マウント後に読み込む
  useEffect(() => {
    setLogs(sortedLogs(loadData().logs));
    setHydrated(true);
  }, []);

  const handleStart = (task: string) => {
    // ユーザー操作のコールスタック内で AudioContext を初期化・再生する
    primeAudio();
    playStartTone();
    setSession({ task: task.trim() ? task.trim() : undefined });
  };

  const handleCloseModal = () => {
    setSession(null);
  };

  const handleCompleteLog = (task: string | undefined, durationSec: number) => {
    addLog(task, durationSec);
    setLogs(sortedLogs(loadData().logs));
  };

  const streak = computeStreak(logs);
  const today = todayCount(logs);

  return (
    <div className="flex min-h-screen flex-col">
      <Header streak={streak} todayCount={today} />

      {hydrated ? (
        <>
          <StartCard onStart={handleStart} />
          <HistoryList logs={logs} />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-surface-border border-t-accent" />
        </div>
      )}

      {session ? (
        <FocusModal
          task={session.task}
          onClose={handleCloseModal}
          onComplete={handleCompleteLog}
        />
      ) : null}
    </div>
  );
}
