# イベントカウントダウン

イベント名と日付を登録するだけで、残り日数を自動計算して表示するシンプルなカウントダウンアプリです。Next.js（App Router）+ TypeScript + Tailwind CSS で構築しています。

## 機能

- イベント名・日付の追加
- 残り日数の自動表示（当日・過去の判定つき）
- イベントの削除
- 登録データはブラウザの `localStorage` に保存（サーバー・DB不要）

## 開発

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いて確認できます。

## ビルド

```bash
npm run build
npm run start
```

## Vercel へのデプロイ

このリポジトリは標準的な Next.js プロジェクトなので、追加設定なしで Vercel にデプロイできます。

1. [Vercel](https://vercel.com) に GitHub リポジトリをインポート
2. Framework Preset に `Next.js` が自動選択されることを確認
3. 「Deploy」をクリック

Vercel CLI からデプロイする場合:

```bash
npm i -g vercel
vercel
```

## 技術スタック

- [Next.js](https://nextjs.org/)（App Router）
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
