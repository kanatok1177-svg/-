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

通知は Web Push で送ります。購読情報とイベントを保存する Redis と、毎朝実行する Vercel Cron を使います。**必要な作業は「Redis を接続して再デプロイ」だけで、パソコンやコマンドは不要です。**（通知用の鍵はサーバーが自動で作って保存します。）

### 1. Upstash Redis を接続する

1. ブラウザで [Vercel Marketplace の Upstash](https://vercel.com/marketplace/upstash) を開き、**Install** を押す（Vercel にログインした状態で）。
   - 「Redis」という名前の別のサービスもありますが、選ぶのは **Upstash** です。
2. 画面の案内に従って Redis（無料プランで足ります）を作成し、このアプリの Vercel プロジェクトに **接続（Connect）** する。
3. 接続すると、接続用の環境変数（`KV_REST_API_URL` / `KV_REST_API_TOKEN`、または `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`）がプロジェクトに自動で追加されます。自分で入力する必要はありません。

### 2. 再デプロイする

環境変数は再デプロイ後に反映されます。Vercel のプロジェクトの **Deployments** を開き、最新のデプロイの「…」→ **Redeploy** を押します。

### 3. Android で通知をオンにする

1. Chrome でアプリを開く。画面上部の「サーバーの設定が未完了です：Redis」という表示が消え、**「通知をオンにする」** ボタンが出ていれば、手順1・2は成功です。
2. ボタンを押して、通知を **許可** する。
3. すぐに確認の通知が1通届けば設定完了です。
4. （任意）Chrome のメニュー →「ホーム画面に追加」または「アプリをインストール」で、アプリのように起動できます。

通知が届かないときは、Android の **設定 → アプリ → Chrome（インストールした場合はそのアプリ）→ 通知** がオンか、省電力の制限をかけていないかを確認してください。

### 通知のしくみ

- 毎日 UTC 0:00（日本時間 9:00）に Vercel Cron が `/api/cron/notify` を実行します（`vercel.json`）。
- 日本時間の「今日」と「明日」にあたるイベントがある端末にだけ、1日1通まとめて送ります。同じ日に重複して送ることはありません。
- Hobby プランの Cron は1日1回までで、実行時刻に最大1時間ほどの幅があります。そのため「9時台」に届きます。
- 通知をオンの間は、イベントを追加・削除するたびにサーバー側のコピーも更新されます。オフにするとサーバーのデータは削除されます。
- 通知をオンにすると、イベント名と日付がサーバー（Redis）に保存されます。
- 端末が無効になった場合は、次の送信時に自動で削除されます。180日以上アプリを開かない端末のデータは、Redis 側で自動的に期限切れになります。

### 動作確認

明日のイベントを登録して通知をオンにしておくと、翌朝の9時台に通知が届きます。パソコンがある場合は、`CRON_SECRET` を設定したうえで、次で今すぐ実行することもできます。

```bash
curl -H "Authorization: Bearer <CRON_SECRET>" https://<あなたのドメイン>/api/cron/notify
```

### 補足

- `CRON_SECRET`（任意）：設定すると、毎朝の定期実行は Vercel が送る合言葉（`Authorization: Bearer ...`）がないと動かなくなり、より安全です。英数字だけの16文字以上を Vercel の環境変数に追加して再デプロイしてください。未設定でも動きます（その場合は Vercel Cron の呼び出しだけを受け付けます。1日1回の重複しない処理なので、第三者に呼ばれても今日の通知が早く届く程度です）。
- 通知用の鍵（VAPID）は、最初のアクセス時に自動で作られて Redis に保存されます。自分で決めたい場合は `npm run vapid` で作り、`VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY`（任意で `VAPID_SUBJECT`）を環境変数に設定してください。**鍵が変わると、すでにオンにした通知は無効になる**ので、各端末で入れ直してください。
- iPhone / iPad は、Safari の共有ボタンから「ホーム画面に追加」したアプリでのみ通知できます（iOS 16.4 以降）。
- ローカル開発（`npm run dev`）では Redis がなくてもメモリ上に保存されて動きます（再起動で消えます）。手動で定期実行を試すときは `.env.local` に `CRON_SECRET` を設定してください。

## 技術スタック

- [Next.js](https://nextjs.org/)（App Router）
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [web-push](https://github.com/web-push-libs/web-push) / [Upstash Redis](https://upstash.com/)（プッシュ通知）
