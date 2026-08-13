# 習慣トラッカー (Habit Tracker)

シンプルなタスク・習慣トラッカーアプリです。Next.js (App Router) + TypeScript + Tailwind CSS で構築されています。

## 機能

- タスクの追加・完了チェック・削除
- 完了状況を可視化する進捗バー
- 日付ごとにタスクを管理(前日/翌日ボタン・日付選択に対応)
- データはブラウザの LocalStorage に保存され、リロードしても消えません
- 日本語 UI

## 開発

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。

## ビルド

```bash
npm run build
npm start
```

## デプロイ (Vercel)

このリポジトリを Vercel に接続すれば、追加設定なしでそのままデプロイできます(App Router / Next.js 標準構成)。

## 技術スタック

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## データについて

タスクはすべてブラウザの LocalStorage に保存されます。サーバーには送信されないため、ブラウザやデバイスを変えるとデータは引き継がれません。
