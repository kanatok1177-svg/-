// MyTime のデータ型定義

/** 満足度: 3=最高, 2=普通, 1=いまいち */
export type Satisfaction = 1 | 2 | 3;

/** 自由時間の使用タグ */
export const TAG_OPTIONS = [
  "ゲーム",
  "動画",
  "SNS",
  "読書",
  "スポーツ",
  "休憩",
  "その他",
] as const;

export type Tag = (typeof TAG_OPTIONS)[number];

/** 日付ごとの自由時間の設定（YYYY-MM-DD -> 分） */
export type DailyPlanMap = Record<string, number>;

/** 自由時間の使用記録 */
export type TimeRecord = {
  id: string;
  date: string; // YYYY-MM-DD（開始した日）
  startTime: number; // epoch ms
  endTime: number; // epoch ms
  duration: number; // 分（切り上げなしの実測分）
  satisfaction: Satisfaction;
  tag?: string;
};

/** 計測中のタイマー状態 */
export type ActiveTimer = {
  startTime: number; // epoch ms
  date: string; // 開始した日 YYYY-MM-DD
  notifiedThresholds: number[]; // 通知済みのしきい値（分）
};

/** タイマー終了後、満足度入力待ちのセッション（リロード対策で保存する） */
export type PendingFinish = {
  date: string;
  startTime: number;
  endTime: number;
  duration: number; // 分
};

/** 詳細計算の入力 */
export type DetailedCalcInput = {
  wake: string; // "HH:MM"
  sleep: string; // "HH:MM"
  schoolMin: number;
  studyMin: number;
  clubMin: number;
  mealMin: number;
  bathMin: number;
  otherMin: number;
};

export type DetailedCalcResult = {
  awakeMinutes: number;
  busyMinutes: number;
  freeMinutes: number;
  overBudget: boolean;
  /** 就寝が起床と同じか前の時刻（＝日をまたいで翌日に寝る）場合 true */
  crossesMidnight: boolean;
};
