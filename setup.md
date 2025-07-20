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
1. Clerk ダッシュボードの "Webhooks" へ
2. "Add endpoint" をクリック
3. Endpoint URL: `http://localhost:3000/api/webhooks/clerk`（開発時）
4. イベント選択: `user.created`, `user.updated`, `user.deleted`
5. Webhook secret をコピー

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
- エンドポイントURL確認
- イベント選択確認
- ngrokを使用した開発時のWebhookテスト

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