export type Task = {
  id: string;
  title: string;
  /** 対象日 (YYYY-MM-DD, ローカルタイムゾーン基準) */
  date: string;
  completed: boolean;
  createdAt: number;
};
