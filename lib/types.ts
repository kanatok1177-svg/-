/**
 * 学習開始ログ 1件分のデータ構造。
 */
export interface StudyLog {
  /** ログの一意なID */
  id: string;
  /** 記録日（YYYY-MM-DD, ローカルタイムゾーン基準） */
  date: string;
  /** 記録が作成された時刻（UNIXタイムスタンプ ms） */
  timestamp: number;
  /** 任意で入力されたタスク名 */
  task?: string;
  /** 達成した集中時間（秒）。基本は60固定。 */
  durationSec: number;
}

/**
 * LocalStorage に保存するアプリ全体のデータ。
 */
export interface AppData {
  logs: StudyLog[];
}

export const STORAGE_KEY = "study-start-switch:data:v1";
