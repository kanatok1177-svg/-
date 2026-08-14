# MyTime

「今日、自分にはあとどれくらい自由な時間があるのか？」をひと目で確認できる、
自由時間を楽しむためのアプリです。

## できること

1. **自由時間計算** — 起床・就寝・学校・勉強・部活・食事・風呂などの予定から今日の自由時間を計算（かんたん設定でワンタップ設定も可能）
2. **ホーム** — 今日の残り自由時間を大きく表示。1タップでタイマー開始
3. **自由時間タイマー** — 経過時間と今日の残りをリアルタイム表示。リロード・再起動しても計測状態を保持
4. **満足度記録** — タイマー終了後、絵文字1タップ＋任意のタグで記録
5. **履歴** — 使用履歴を新しい順に表示、削除も可能
6. **統計** — 今日・今週・今月のサマリーと充実時間率、タグ別の満足度分析

データはすべてブラウザの LocalStorage に保存されます（外部データベース・API不要）。

## 開発

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。

## ビルド

```bash
npm run build
npm run start
```

## 技術スタック

- Next.js (App Router) / TypeScript / React
- Tailwind CSS
- LocalStorage（外部DB・APIなし）
- Vercel にそのままデプロイ可能

## コード構成

- `lib/types.ts` — データ型定義
- `lib/storage.ts` — LocalStorage の読み書き（唯一の入出力窓口）
- `lib/store.ts` — `useSyncExternalStore` によるリアクティブ購読層
- `lib/time.ts` — 日付・時間計算の純粋関数
- `lib/stats.ts` — 統計・分析の集計ロジック
- `lib/notifications.ts` — 残り時間通知（Notification API）
- `components/` — 共通UIパーツ
- `app/` — ホーム / 計算 / 履歴 / 統計の各画面
