# シャドウバース EVOLVE 戦績管理ツール

シャドウバース EVOLVE対戦記録・統計分析Webアプリケーション

## 🚀 技術スタック

### フロントエンド
- **Next.js 15** - App Router, React Server Components, Server Actions
- **React 19** - Concurrent Features, Suspense Boundaries  
- **TypeScript 5.5** - 型安全性
- **Tailwind CSS** - スタイリング
- **shadcn/ui** - UIコンポーネントライブラリ
- **React Hook Form + Zod** - フォーム管理・バリデーション
- **Lucide React** - アイコン

### バックエンド・データベース
- **Drizzle ORM** - 型安全なORM
- **Neon** - Serverless PostgreSQL
- **Edge Runtime** - Vercelエッジ関数

### 認証・セキュリティ
- **Clerk** - 認証サービス
- **Passwordless認証** - パスキー対応
- **OAuth** - Google, Discord連携

## 📋 主要機能

### ✅ 実装済み機能

1. **認証システム**
   - Clerkによるセキュアな認証
   - ログイン・サインアップページ
   - プロテクトされたルート

2. **ダッシュボード**
   - 戦績概要の表示
   - KPIカード（勝率、対戦数、連勝記録など）
   - 最近の対戦履歴
   - クイックアクション

3. **対戦記録管理**
   - 新しい対戦の記録
   - 対戦履歴の表示
   - フィルタリング機能
   - 詳細な対戦情報入力

4. **デッキ管理**
   - デッキ一覧表示
   - デッキ別統計
   - アクティブ/非アクティブ状態管理

5. **統計・分析**
   - デッキ別勝率
   - 対戦相手別勝率
   - 月別戦績推移
   - 詳細な統計データ

6. **AIインサイト**
   - AI分析結果の表示
   - 強みと改善点の分析
   - 具体的な改善提案
   - 目標設定の提案

7. **UIコンポーネント**
   - shadcn/uiベースのコンポーネント
   - レスポンシブデザイン
   - ダークモード対応
   - アクセシビリティ配慮

## 🏗️ プロジェクト構造

```
shadowverse_stats/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 認証関連ページ
│   │   ├── sign-in/              # ログインページ
│   │   └── sign-up/              # サインアップページ
│   ├── (dashboard)/              # メインアプリ
│   │   ├── page.tsx              # ダッシュボード
│   │   ├── battles/              # 対戦記録
│   │   ├── decks/                # デッキ管理
│   │   ├── statistics/           # 統計
│   │   └── insights/             # AIインサイト
│   ├── globals.css               # グローバルCSS
│   └── layout.tsx                # ルートレイアウト
├── components/                   # UIコンポーネント
│   └── ui/                       # shadcn/ui コンポーネント
├── lib/                          # ライブラリ・ユーティリティ
│   ├── db/                       # データベース関連
│   │   └── schema.ts             # Drizzleスキーマ
│   ├── validations/              # Zodスキーマ
│   ├── constants/                # 定数定義
│   └── utils.ts                  # ユーティリティ関数
└── middleware.ts                 # Clerkミドルウェア
```

## 🗄️ データベース設計

### テーブル構造

```sql
-- ユーザー
users (
  id UUID PRIMARY KEY,
  clerk_id TEXT UNIQUE,
  username TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- デッキ
decks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT,
  archetype TEXT,
  leader TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMP
)

-- 対戦記録
battles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  player_deck_id UUID REFERENCES decks(id),
  opponent_archetype TEXT,
  result ENUM('win', 'loss', 'draw'),
  turn_count INTEGER,
  damage_dealt INTEGER,
  damage_received INTEGER,
  played_at TIMESTAMP
)
```

## 🛠️ 開発環境のセットアップ

### 前提条件
- Node.js 20以上
- npm または yarn

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd shadowverse_stats
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数を設定
```bash
cp .env.example .env
```

必要な環境変数:
- `DATABASE_URL` - Neon PostgreSQL接続文字列
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk公開キー
- `CLERK_SECRET_KEY` - Clerkシークレットキー

4. データベースマイグレーション
```bash
npm run db:generate
npm run db:migrate
```

5. 開発サーバーを起動
```bash
npm run dev
```

## 📝 利用可能なスクリプト

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run start        # プロダクション実行
npm run lint         # ESLint実行
npm run typecheck    # TypeScript型チェック
npm run db:generate  # Drizzleマイグレーション生成
npm run db:migrate   # データベースマイグレーション実行
npm run db:studio    # Drizzle Studio起動
```

## 🔮 今後の実装予定

### 短期目標
- [ ] tRPC APIの実装
- [ ] データベース接続とCRUD操作
- [ ] リアルタイムデータ更新
- [ ] チャート・グラフコンポーネント

### 中期目標  
- [ ] PWA対応（サービスワーカー）
- [ ] オフライン機能
- [ ] プッシュ通知
- [ ] AI分析機能の実装

### 長期目標
- [ ] モバイルアプリ版
- [ ] 多言語対応
- [ ] ソーシャル機能
- [ ] 大会・トーナメント機能

## 🚀 デプロイ

### Vercelデプロイ
1. Vercelアカウントにサインアップ
2. GitHubリポジトリを接続
3. 環境変数を設定
4. 自動デプロイが開始

### 環境変数設定
- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`  
- `CLERK_SECRET_KEY`

## 📄 ライセンス

ISC

## 🤝 コントリビューション

プルリクエストやIssueでの貢献を歓迎します。

## 📞 サポート

質問やバグ報告は[Issues](https://github.com/your-repo/issues)までお願いします。