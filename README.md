# イベントカウントダウン

イベント名と日付を登録するだけで、残り日数を自動計算して表示するシンプルなカウントダウンアプリです。Next.js（App Router）+ TypeScript + Tailwind CSS で構築しています。

## 機能

- イベント名・日付の追加
- 残り日数の自動表示（当日・過去の判定つき）
- イベントの削除（6秒以内なら「元に戻す」で復元）
- 表示モードの切り替え（ライト／自動／ダーク。選択はブラウザに保存）
- プッシュ通知（任意）：毎朝9時ごろ、前日と当日のイベントをお知らせ。アプリを閉じていても届く
- 登録データはブラウザの `localStorage` に保存（通知をオンにした場合のみ、サーバーにも保存）

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

このリポジトリは標準的な Next.js プロジェクトです。**プッシュ通知を使わない場合は、追加設定なしで** Vercel にデプロイできます（通知ボタンは「サーバーの設定が未完了」と表示されます）。通知を使う場合は、下の「プッシュ通知のセットアップ」も行ってください。

1. [Vercel](https://vercel.com) に GitHub リポジトリをインポート
2. Framework Preset に `Next.js` が自動選択されることを確認
3. 「Deploy」をクリック

Vercel CLI からデプロイする場合:

```bash
npm i -g vercel
vercel
```

## プッシュ通知のセットアップ

通知は Web Push（VAPID）で送ります。購読情報とイベントを保存する Redis と、毎朝実行する Vercel Cron を使います。

### 1. Redis を用意する

Vercel のプロジェクトで **Storage（または Marketplace）→ Upstash for Redis** を作成し、このプロジェクトに接続します。接続すると、`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`（または `KV_REST_API_URL` / `KV_REST_API_TOKEN`）が環境変数として自動で追加されます。どちらの名前でも動作します。

### 2. VAPID キーを作る

```bash
npm install
npm run vapid
```

表示された `Public Key` と `Private Key` を控えます。**Private Key は秘密にしてください**（リポジトリにコミットしないこと）。

### 3. 環境変数を設定する

Vercel の **Settings → Environment Variables** に追加します（`.env.example` に一覧があります）。

| 名前 | 値 |
|---|---|
| `VAPID_PUBLIC_KEY` | 手順2の Public Key |
| `VAPID_PRIVATE_KEY` | 手順2の Private Key |
| `VAPID_SUBJECT` | 連絡先。`mailto:あなたのメールアドレス` またはサイトのURL |
| `CRON_SECRET` | 十分長いランダムな文字列（例：`openssl rand -hex 32`） |

### 4. 再デプロイして確認する

環境変数は再デプロイ後に反映されます。デプロイ後にアプリを開き、**「通知をオンにする」** を押してください。許可すると、すぐに確認の通知が1通届きます。届けば設定完了です。

### 通知のしくみ

- 毎日 UTC 0:00（日本時間 9:00）に Vercel Cron が `/api/cron/notify` を実行します（`vercel.json`）。
- 日本時間の「今日」と「明日」にあたるイベントがある端末にだけ、1日1通まとめて送ります。
- Hobby プランの Cron は1日1回までで、実行時刻に最大1時間ほどの幅があります。
- 通知をオンの間は、イベントを追加・削除するたびにサーバー側のコピーも更新されます。オフにするとサーバーのデータは削除されます。
- 端末が無効になった場合（アンインストールなど）は、次の送信時に自動で削除されます。
- 180日以上アプリを開かない端末のデータは、Redis 側で自動的に期限切れになります。

### 動作確認（手動実行）

明日のイベントを登録したうえで、次を実行すると、その場で通知を送れます。

```bash
curl -H "Authorization: Bearer <CRON_SECRET>" https://<あなたのドメイン>/api/cron/notify
```

結果（`sent` が送信数）が JSON で返ります。同じ日に2回目を実行しても、重複送信はされません。

### 対応環境と注意

- **iPhone / iPad**：Safari の共有ボタン →「ホーム画面に追加」で追加したアプリでのみ通知できます（iOS 16.4 以降）。
- Chrome / Edge / Firefox / Safari（macOS）で通知できます。
- 通知をオンにすると、イベント名と日付がサーバー（Redis）に保存されます。
- VAPID キーを変更すると既存の購読は無効になります。各端末で通知を入れ直してください。
- ローカル開発（`npm run dev`）では Redis がなくてもメモリ上に保存されて動きます（再起動で消えます）。`VAPID_*` と `CRON_SECRET` は `.env.local` に設定してください。

## 技術スタック

- [Next.js](https://nextjs.org/)（App Router）
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [web-push](https://github.com/web-push-libs/web-push) / [Upstash Redis](https://upstash.com/)（プッシュ通知）
