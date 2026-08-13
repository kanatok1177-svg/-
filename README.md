# 1分スタート - 脱スマホ・勉強スイッチ

行動心理学の「着手ハードル最小化」に基づいた、スマホ依存の無意識ループを断ち切るためのWebアプリです。
開いた瞬間、考える前に1タップで「1分間の集中」を始められます。

## コンセプト

- スマホを開く→アプリを開く→**何も入力せず**巨大ボタンを1タップ→60秒間だけ集中
- 60秒達成した瞬間、脳はすでに「勉強モード」に切り替わっている
- ストリーク（連続達成日数）と記録で、行動の継続を可視化

## 主な機能

- **超巨大ワンタップボタン**：文字入力不要で即スタート
- **1分集中モード**：全画面漆黒表示 + 60秒カウントダウンで視覚刺激を遮断
- **Wake Lock API**：カウントダウン中に画面がスリープしないよう制御
- **Web Audio API**：外部音声ファイル不要、サイン波合成によるスタート音・ティック音・達成ファンファーレ
- **ストリーク / 今日のスタート回数**：LocalStorageに記録し、ヘッダーにバッジ表示
- **学習開始ログ**：日付・時刻・任意タスク名を一覧表示
- **PWA対応**：ホーム画面に追加すると全画面アプリとして起動

## 技術スタック

- [Next.js 14 (App Router)](https://nextjs.org/)
- TypeScript
- Tailwind CSS
- [lucide-react](https://lucide.dev/)（アイコン）
- Web Audio API / Wake Lock API（外部依存なし）
- LocalStorage（データ永続化、サーバー不要）

## セットアップ

```bash
npm install
npm run dev
```

`http://localhost:3000` で確認できます。

## ビルド

```bash
npm run build
npm start
```

## Vercelへのデプロイ

このリポジトリをVercelにインポートするだけで、追加設定なしにデプロイできます
（環境変数・外部APIキーは不要です）。

## ディレクトリ構成

```
app/
  layout.tsx        # 全体レイアウト・メタデータ・PWA設定
  page.tsx           # メイン画面（状態管理・各コンポーネントの組み立て）
  manifest.ts         # PWA manifest
  globals.css          # Tailwindベーススタイル
components/
  Header.tsx          # ストリーク・今日の回数バッジ
  StartCard.tsx        # 巨大ワンタップボタン + タスク入力欄
  FocusModal.tsx        # 1分集中モードのオーケストレーション
  CountdownView.tsx      # カウントダウン表示
  AchievedView.tsx        # 達成画面（保存 / 続ける）
  HistoryList.tsx          # 学習開始ログ一覧
lib/
  types.ts              # 型定義
  storage.ts             # LocalStorage読み書き・ストリーク計算
  sound.ts               # Web Audio APIによる効果音合成
  useWakeLock.ts          # Wake Lock APIフック
  format.ts               # 日付・時刻表示の整形
```

## 動作の仕様メモ

- 「今日の記録に保存」ボタンを押すと、そのログが保存されストリーク・今日の回数に反映されます
- 「このまま勉強を続ける（画面を閉じる）」は記録せずにそのままモーダルを閉じます
- ストリークは「今日」または「昨日」に記録があるところを起点に、連続する日数をカウントします
