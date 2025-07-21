# 🔧 環境変数設定手順

シャドウバース EVOLVE 戦績管理ツールの環境設定ガイド

## 1. `.env.local` ファイル作成

```bash
cp .env.example .env.local
```

## 2. 各サービスのセットアップ

### 📁 Neon Database (PostgreSQL)

#### アカウント作成
1. https://neon.tech にアクセス
2. GitHubアカウントでサインアップ

#### プロジェクト作成
1. "Create a project" をクリック
2. プロジェクト名: `shadowverse-stats`
3. リージョン: Asia Pacific (Tokyo) 推奨

#### 接続文字列取得
1. ダッシュボードから "Connection Details" を確認
2. 接続文字列をコピー

```bash
# .env.local に追加
DATABASE_URL="postgresql://username:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

### 🔐 Clerk Authentication

#### アカウント作成
1. https://clerk.com にアクセス
2. アカウント作成・ログイン

#### アプリケーション作成
1. "Create application" をクリック
2. アプリ名: `shadowverse-evolve-stats`
3. 認証方法: Email + Password + OAuth (Google推奨)

#### キー取得
1. ダッシュボードの "API Keys" セクション
2. Publishable key と Secret key をコピー

```bash
# .env.local に追加
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxx"
CLERK_SECRET_KEY="sk_test_xxxxx"
```

#### Webhook設定

⚠️ **重要**: 開発環境では `localhost` は使用できません。以下の方法でWebhookを設定してください。

##### 方法1: ngrok を使用（推奨）

1. **ngrokインストール**
```bash
# macOSの場合
brew install ngrok

2. **アプリケーション起動**
```bash
npm run dev
```

3. **新しいターミナルでngrok起動**
```bash
ngrok http 3000
```

4. **ngrok URL確認**
```
Session Status                online
Account                       your-account (Plan: Free)
Version                       3.1.0
Region                        Japan (jp)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
```

5. **Clerk Webhook設定**
- Clerk ダッシュボードの "Configure" → "Webhooks" へ
- "Add endpoint" をクリック
- Endpoint URL: `https://abc123.ngrok.io/api/webhooks/clerk` （⚠️ ngrokのHTTPS URLを使用）
- イベント選択: `user.created`, `user.updated`, `user.deleted`
- "Create" をクリック
- Webhook secret をコピー

##### 方法2: 一時的にVercelデプロイ

```bash
# 一時的に本番デプロイしてWebhook設定
vercel --prod

# 表示されたURLを使用
# https://your-project-name.vercel.app/api/webhooks/clerk
```

##### Webhook設定完了後

```bash
# .env.local に追加
CLERK_WEBHOOK_SECRET="whsec_xxxxx"
```

### 🌐 Next.js設定

```bash
# .env.local に追加
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # ランダム文字列生成
```

## 3. 完成した `.env.local` サンプル

```bash
# Database
DATABASE_URL="postgresql://username:password@ep-cool-lab-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_Y2xlcmsuZXhhbXBsZS5jb20k"
CLERK_SECRET_KEY="sk_test_1234567890abcdef"
CLERK_WEBHOOK_SECRET="whsec_abcdef1234567890"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="super-secret-key-for-nextauth"
```

## 4. データベース初期化

```bash
# マイグレーション実行
npm run db:generate
npm run db:migrate

# シードデータ投入（オプション）
psql $DATABASE_URL -f lib/db/migrations/seed.sql
```

## 5. 開発サーバー起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセスして動作確認

## 6. Clerk設定詳細

### ドメイン設定
- 開発環境: `localhost:3000`
- 本番環境: 実際のドメイン

### リダイレクトURL設定
```
サインイン後: /dashboard
サインアウト後: /
サインアップ後: /dashboard
```

### OAuth設定（推奨）
- Google OAuth を有効化
- 必要に応じてDiscord, GitHubも追加

## 7. 本番環境の設定

### Vercel デプロイ時

```bash
# Vercel CLI で環境変数設定
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
vercel env add CLERK_WEBHOOK_SECRET
vercel env add NEXTAUTH_SECRET
```

### Webhook URL更新
- Clerk ダッシュボードでWebhook URLを本番ドメインに変更
- `https://your-app.vercel.app/api/webhooks/clerk`

## 8. セキュリティ注意点

### ⚠️ 重要な注意事項

1. **`.env.local` をGitにコミットしない**
   - `.gitignore` に既に含まれているか確認

2. **秘密鍵の管理**
   - `CLERK_SECRET_KEY` と `CLERK_WEBHOOK_SECRET` は絶対に公開しない
   - 定期的にキーローテーションを実施

3. **本番環境**
   - 強力な `NEXTAUTH_SECRET` を生成
   - データベース接続にSSLを使用

## 9. トラブルシューティング

### よくある問題と解決方法

#### データベース接続エラー
```bash
# 接続テスト
npm run db:studio
```

#### Clerk認証エラー
- キーの先頭文字列確認（`pk_test_`, `sk_test_`）
- ドメイン設定確認
- リダイレクトURL設定確認

#### Webhook エラー

##### "Invalid URL" エラーの解決
```bash
# ❌ 無効なURL例
http://localhost:3000/api/webhooks/clerk        # localhostは外部から到達不可
https://example.com/api/webhooks/clerk/          # 末尾スラッシュあり
https://example.com/webhooks/clerk               # /api/ パス抜け

# ✅ 正しいURL例  
https://abc123.ngrok.io/api/webhooks/clerk       # ngrok HTTPS URL
https://your-app.vercel.app/api/webhooks/clerk   # Vercel本番URL
```

##### 開発環境でのWebhookテスト手順
1. **ngrok起動確認**
```bash
# ngrok状態確認
curl http://localhost:4040/api/tunnels

# ngrok Web UI確認
open http://127.0.0.1:4040
```

2. **エンドポイント動作確認**
```bash
# Webhook エンドポイントテスト
curl -X POST https://your-ngrok-url.ngrok.io/api/webhooks/clerk \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'
```

3. **Clerkダッシュボードで配信履歴確認**
- Webhooks → 作成したWebhook → "Recent deliveries" タブ
- エラーメッセージとレスポンスコード確認

##### よくあるWebhookエラーと解決法
```bash
# Error: "URL not reachable"
# 原因: ngrokが停止またはNext.jsアプリが停止
# 解決: 両方のプロセス再起動

# Error: "Signature verification failed"  
# 原因: CLERK_WEBHOOK_SECRET が間違っている
# 解決: Clerkダッシュボードから正しいSecretを取得

# Error: "500 Internal Server Error"
# 原因: データベース接続エラーまたはコードエラー
# 解決: npm run dev のコンソールでエラーログ確認
```

##### Webhook設定のベストプラクティス
- 開発時は必ずngrokのHTTPS URLを使用
- Webhook secret は環境変数で管理
- ngrok URL変更時はClerkの設定も更新
- 本番デプロイ時にWebhook URLを本番ドメインに変更

### デバッグコマンド

```bash
# 型チェック
npm run typecheck

# リント
npm run lint

# データベーススキーマ確認
npm run db:studio

# ビルドテスト
npm run build
```

## 10. 開発フロー

### 初回セットアップ後
1. 依存関係インストール: `npm install`
2. 環境変数設定: `.env.local` 作成
3. データベースマイグレーション: `npm run db:migrate`
4. 開発サーバー起動: `npm run dev`

### 日常的な開発
1. 新機能開発前: `git pull`
2. マイグレーション確認: `npm run db:generate`
3. 型チェック: `npm run typecheck`
4. コミット前: `npm run lint`

## 11. 本番デプロイチェックリスト

- [ ] 環境変数の設定完了
- [ ] データベースマイグレーション実行
- [ ] Clerk Webhook URL更新
- [ ] OAuth設定確認
- [ ] セキュリティ設定確認
- [ ] パフォーマンステスト実行

---

## サポート

設定で問題が発生した場合は、以下を確認してください：

1. 各サービスのステータスページ
2. ログ出力（`npm run dev` のコンソール）
3. ブラウザのDeveloper Tools
4. このプロジェクトのREADME.md

詳細な技術情報は `README.md` を参照してください。