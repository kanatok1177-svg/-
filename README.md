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

通知は Web Push で送ります。購読情報とイベントを保存する Redis と、毎朝実行する Vercel Cron を使います。**パソコンやコマンドは不要で、スマホのブラウザだけで設定できます。**（通知用の鍵はサーバーが自動で作って保存します。）

### 1. Redis を用意する

Vercel のプロジェクトを開き、**Storage（または Marketplace）→ Upstash for Redis** を作成して、このプロジェクトに接続します。接続すると、接続用の環境変数（`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`、または `KV_REST_API_URL` / `KV_REST_API_TOKEN`）が自動で追加されます。

### 2. `CRON_SECRET` を追加する

**Settings → Environment Variables** で、次を1つ追加します。

| 名前 | 値 |
|---|---|
| `CRON_SECRET` | 英数字だけの、16文字以上の好きな文字列（記号・空白・改行は入れない） |

これは毎朝の定期実行を、Vercel 以外から実行されないようにする合言葉です。**設定しないと通知ボタンは使えません**（画面に「足りない設定」が表示されます）。

### 3. 再デプロイする

環境変数は再デプロイ後に反映されます。**Deployments** から最新のデプロイの「…」→ **Redeploy** を実行してください。定期実行は本番（Production）のデプロイでだけ動きます。

### 4. Android で通知をオンにする

1. Chrome でアプリを開き、**「通知をオンにする」** を押して、通知を **許可** します。
2. すぐに確認の通知が1通届けば設定完了です。
3. （任意）Chrome のメニュー →「ホーム画面に追加」または「アプリをインストール」で、アプリのように起動できます。

通知が届かないときは、Android の **設定 → アプリ → Chrome（インストールした場合はそのアプリ）→ 通知** がオンか、省電力の制限をかけていないかを確認してください。

### 通知のしくみ

- 毎日 UTC 0:00（日本時間 9:00）に Vercel Cron が `/api/cron/notify` を実行します（`vercel.json`）。
- 日本時間の「今日」と「明日」にあたるイベントがある端末にだけ、1日1通まとめて送ります。同じ日に重複して送ることはありません。
- Hobby プランの Cron は1日1回までで、実行時刻に最大1時間ほどの幅があります。そのため「9時台」に届きます。
- 通知をオンの間は、イベントを追加・削除するたびにサーバー側のコピーも更新されます。オフにするとサーバーのデータは削除されます。
- 通知をオンにすると、イベント名と日付がサーバー（Redis）に保存されます。
- 端末が無効になった場合は、次の送信時に自動で削除されます。180日以上アプリを開かない端末のデータは、Redis 側で自動的に期限切れになります。

### 動作確認

明日のイベントを登録して通知をオンにしておくと、翌朝の9時台に通知が届きます。パソコンがある場合は、次で今すぐ実行することもできます。

```bash
curl -H "Authorization: Bearer <CRON_SECRET>" https://<あなたのドメイン>/api/cron/notify
```

### 補足

- 通知用の鍵（VAPID）は、最初のアクセス時に自動で作られて Redis に保存されます。自分で決めたい場合は `npm run vapid` で作り、`VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY`（任意で `VAPID_SUBJECT`）を環境変数に設定してください。**鍵が変わると、すでにオンにした通知は無効になる**ので、各端末で入れ直してください。
- iPhone / iPad は、Safari の共有ボタンから「ホーム画面に追加」したアプリでのみ通知できます（iOS 16.4 以降）。
- ローカル開発（`npm run dev`）では Redis がなくてもメモリ上に保存されて動きます（再起動で消えます）。`.env.local` に `CRON_SECRET` を設定してください。

## 技術スタック

- [Next.js](https://nextjs.org/)（App Router）
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [web-push](https://github.com/web-push-libs/web-push) / [Upstash Redis](https://upstash.com/)（プッシュ通知）
