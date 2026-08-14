export type Task = {
  id: string;
  title: string;
  /** 対象日 (YYYY-MM-DD, ローカルタイムゾーン基準) */
  date: string;
  completed: boolean;
  createdAt: number;
};

/** 継続目標。アプリ内では常に最大1件だけ保持する */
export type Goal = {
  id: string;
  title: string;
  /** 継続成功に必要な日数 */
  targetDays: number;
  createdAt: number;
  /** チェックした日付 (YYYY-MM-DD) の一覧 */
  checkedDates: string[];
  /** 具体的にやることのメモ(任意) */
  memo?: string;
};
