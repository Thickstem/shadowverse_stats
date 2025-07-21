# 🔗 Clerk Webhook 設定ガイド

シャドウバース EVOLVE 戦績管理ツールのClerk Webhook詳細設定手順

## 🎯 Webhookの目的

Clerkでユーザーが作成・更新・削除された際に、自動的にアプリケーションのデータベースにも反映させるため

## 📝 設定手順

### 1. Clerkダッシュボードへアクセス

1. https://dashboard.clerk.com にログイン
2. 作成したアプリケーション（`shadowverse-evolve-stats`）を選択
3. 左サイドバーの「Webhooks」をクリック

### 2. Webhook作成

#### 基本設定
1. 「Add Endpoint」ボタンをクリック
2. **Endpoint URL**を入力：

```
開発環境: http://localhost:3000/api/webhooks/clerk
本番環境: https://your-domain.vercel.app/api/webhooks/clerk
```

#### イベント選択
以下のイベントを有効化：
- ✅ `user.created` - ユーザー新規作成時
- ✅ `user.updated` - ユーザー情報更新時  
- ✅ `user.deleted` - ユーザー削除時

#### フィルタリング（オプション）
特定条件でのみWebhookを発火させたい場合：
```json
{
  "user.created": {},
  "user.updated": {},
  "user.deleted": {}
}
```

### 3. Webhookシークレット取得

1. Webhook作成後、「Signing Secret」をコピー
2. `.env.local`に追加：

```bash
CLERK_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 4. 開発環境でのWebhookテスト

#### ngrokを使用した方法（推奨）

1. **ngrokインストール**
```bash
# Homebrewの場合
brew install ngrok

# または公式サイトからダウンロード
# https://ngrok.com/download
```

2. **Next.jsアプリ起動**
```bash
npm run dev
```

3. **ngrokでトンネル作成**
```bash
ngrok http 3000
```

4. **Webhook URL更新**
```
ngrokが提供するURL: https://abc123.ngrok.io/api/webhooks/clerk
```

#### ローカル環境用の設定

開発中は以下のようにClerk設定を変更：

```bash
# 一時的にngrok URLを使用
WEBHOOK_URL="https://abc123.ngrok.io/api/webhooks/clerk"
```

### 5. Webhookペイロード例

#### user.created
```json
{
  "data": {
    "id": "user_xxxxxxxxxxxxxxxxxxxxxxxx",
    "username": "john_doe",
    "first_name": "John",
    "last_name": "Doe",
    "email_addresses": [
      {
        "email_address": "john@example.com",
        "verification": {
          "status": "verified"
        }
      }
    ],
    "created_at": 1640995200000,
    "updated_at": 1640995200000
  },
  "object": "event",
  "type": "user.created"
}
```

#### user.updated
```json
{
  "data": {
    "id": "user_xxxxxxxxxxxxxxxxxxxxxxxx",
    "username": "john_updated",
    "first_name": "John",
    "last_name": "Smith",
    "updated_at": 1640995300000
  },
  "object": "event",
  "type": "user.updated"
}
```

#### user.deleted
```json
{
  "data": {
    "id": "user_xxxxxxxxxxxxxxxxxxxxxxxx",
    "deleted": true
  },
  "object": "event",
  "type": "user.deleted"
}
```

## 🔧 実装されているWebhookハンドラー

アプリケーションの `/app/api/webhooks/clerk/route.ts` で以下を処理：

### user.created 処理
- 新しいユーザーレコードをデータベースに作成
- `users`テーブルに`clerk_id`、`username`を保存

### user.updated 処理  
- 既存ユーザー情報を更新
- `username`の変更を反映

### user.deleted 処理
- ユーザーレコードをデータベースから削除
- 関連する対戦記録、デッキも連鎖削除（CASCADE設定による）

## 🛠️ トラブルシューティング

### よくある問題

#### 1. Webhook未受信
```bash
# ログ確認
tail -f .next/server.log

# または開発サーバーのコンソール出力確認
```

**解決方法:**
- Endpoint URLが正しいか確認
- ngrokが正常に動作しているか確認
- Clerkダッシュボードで配信履歴確認

#### 2. 署名検証エラー
```bash
Error verifying webhook: SignatureVerificationError
```

**解決方法:**
- `CLERK_WEBHOOK_SECRET`が正しく設定されているか確認
- シークレットキーに余分なスペースがないか確認

#### 3. データベースエラー
```bash
Error creating user: duplicate key value violates unique constraint
```

**解決方法:**
- 同じユーザーが既に存在する場合の処理を確認
- データベース接続が正常か確認

### デバッグ方法

#### 1. Webhook配信履歴確認
1. Clerkダッシュボードの「Webhooks」
2. 作成したWebhookをクリック  
3. 「Recent deliveries」タブで配信状況確認

#### 2. レスポンス確認
- ステータスコード200が返されているか
- エラーメッセージの内容確認

#### 3. ローカルでのテスト
```bash
# Webhookエンドポイントに直接リクエスト送信
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "Content-Type: application/json" \
  -H "svix-id: test-id" \
  -H "svix-timestamp: $(date +%s)" \
  -H "svix-signature: test-signature" \
  -d '{"type": "user.created", "data": {"id": "test_user", "username": "test"}}'
```

## 🔄 本番環境への移行

### 1. Vercelデプロイ時
```bash
# 環境変数設定
vercel env add CLERK_WEBHOOK_SECRET

# デプロイ
vercel --prod
```

### 2. Webhook URL更新
Clerkダッシュボードで本番URLに変更：
```
https://your-app.vercel.app/api/webhooks/clerk
```

### 3. 動作確認
1. 本番環境でユーザー登録テスト
2. Clerkダッシュボードで配信履歴確認
3. アプリケーションのデータベース確認

## 📊 Webhook監視

### ログ監視
```bash
# Vercelの場合
vercel logs --follow

# 他のホスティングサービスの場合
# 各サービスのログ確認方法に従う
```

### アラート設定（推奨）
- Webhook失敗時の通知設定
- データベースエラー時の監視
- レスポンス時間の監視

## 🔒 セキュリティ考慮事項

### 1. 署名検証
- 必ず`svix`ライブラリを使用して署名検証
- 不正なリクエストを拒否

### 2. レート制限
- 異常な頻度でのWebhook受信に対する対策
- DDoS攻撃への備え

### 3. エラーハンドリング
- 適切なHTTPステータスコード返却
- センシティブ情報をログに出力しない

---

## 📞 サポート

Webhook設定で問題が発生した場合：

1. **Clerkドキュメント**: https://clerk.com/docs/webhooks
2. **ngrok公式ガイド**: https://ngrok.com/docs
3. **プロジェクトのGitHubリポジトリ**: Issues作成

これでClerk Webhookの完全な設定が完了します！