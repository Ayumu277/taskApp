# Face Yourself

12週間で人生を加速させる、戦略的タスク管理アプリ

## 概要

Face Yourselfは年間目標から時間単位のタスクまで、あらゆるレベルで生産性を追跡・管理できるWebアプリケーションです。12週間スパンでの目標設定、ポモドーロタイマー、認証機能、タスクログ機能を備えた統合的な生産性向上ツールです。

## 主な機能

### 🎯 12週間目標管理
- **スパンベース目標**: 自由に設定可能な12週間スパンでの目標管理
- **Kanbanボード**: タスクのドラッグ&ドロップ管理
- **進捗追跡**: DonutChartによる視覚的な進捗表示
- **期間カスタマイズ**: 各スパンの開始日・終了日を自由に設定

### 📅 多層的な時間管理
- **年間ビュー**: 長期的な目標設定と追跡
- **週間ビュー**: 週単位の目標管理と実行スコア
- **日間ビュー**: フォーカスタスクとセッション進捗
- **時間ビュー**: ポモドーロタイマーと詳細な時間ログ

### 🍅 ポモドーロタイマー機能
- **カスタマイズ可能**: 作業時間（1-120分）と休憩時間（1-60分）を設定
- **自動モード切り替え**: 作業↔休憩の自動切り替え
- **サイクル追跡**: 完了した作業サイクル数を表示
- **音声・ブラウザ通知**: タイマー終了時の通知機能
- **リアルタイム同期**: ホームページとタイマーページの完全同期

### 🔐 認証システム
- **Supabase認証**: メール・パスワードによる安全な認証
- **ユーザー管理**: サインアップ、ログイン、ログアウト機能
- **認証ガード**: 認証が必要なページの保護
- **セッション管理**: 自動的なセッション状態の監視

### 📝 タスクログ機能
- **日次ログ**: フォーカスタスクの記録と保存
- **週次ログ**: 週間目標と過去7日間のタスク記録
- **編集・削除**: 保存済みログの編集・削除機能
- **Supabase統合**: クラウドでの安全なデータ保存
- **Row Level Security**: ユーザーごとのデータ分離

### 📊 分析とレビュー
- **週次レビュー**: 振り返りと学びの記録
- **実行スコア**: 週末の自動評価システム
- **フィード**: 共有タスクの活動履歴
- **ログ閲覧**: 過去の記録を日次・週次で表示

## 技術スタック

- **Frontend**: Next.js 15.0.0-rc.0 (App Router), React 19.1.0, TypeScript
- **Backend**: Supabase (認証・データベース)
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Charts**: カスタムDonutChart, Recharts
- **Drag & Drop**: react-beautiful-dnd
- **Storage**: localStorage + Supabase
- **Package Manager**: pnpm

## セットアップ

### 1. 依存関係のインストール

```bash
# 依存関係のインストール
pnpm install
```

### 2. Supabase設定

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. 環境変数を設定:

```bash
# .env.local ファイルを作成
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. データベーステーブルを作成:

```sql
-- supabase_setup.sql の内容を実行
-- daily_logs と weekly_logs テーブルが作成されます
```

### 3. 開発サーバーの起動

```bash
# 開発サーバーの起動
pnpm run dev

# ブラウザで http://localhost:3000 を開く
```

## 使用方法

### 1. アカウント作成・ログイン
1. `/signup` でアカウントを作成
2. `/login` でログイン
3. 認証後、ダッシュボードにアクセス可能

### 2. 12週間目標の設定
1. ダッシュボードでスパンを選択
2. 期間を設定（開始日・終了日）
3. 目標を追加し、Kanbanボードで管理

### 3. 日次タスク管理
1. `/day` で今日の目標とフォーカスタスクを設定
2. セッション進捗をスライダーで更新
3. 「記録を残す」でSupabaseに保存

### 4. ポモドーロタイマー
1. `/hour` でタイマーページにアクセス
2. 作業時間・休憩時間を設定
3. タスク名と開始前メモを入力
4. タイマーを開始して集中作業

### 5. ログの確認
1. `/logs` で過去の記録を確認
2. 日次・週次ログをタブで切り替え
3. 編集・削除も可能

## ディレクトリ構造

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # 12週間目標管理
│   │   └── [goalId]/     # 個別目標のKanbanボード
│   ├── day/              # 日間プラン
│   ├── week/             # 週間目標
│   ├── hour/             # 時間ログ・ポモドーロタイマー
│   ├── year/             # 年間目標
│   ├── review/           # 週次レビュー
│   ├── feed/             # 活動フィード
│   ├── logs/             # タスクログ閲覧
│   ├── login/            # ログインページ
│   ├── signup/           # サインアップページ
│   └── onboarding/       # 初期設定
├── components/            # 再利用可能コンポーネント
│   ├── AddGoalModal.tsx  # 目標追加モーダル
│   ├── DonutChart.tsx    # 進捗円グラフ
│   ├── HourTaskModal.tsx # 時間ログモーダル
│   ├── LoginForm.tsx     # ログインフォーム
│   ├── LogoutButton.tsx  # ログアウトボタン
│   ├── AuthGuard.tsx     # 認証ガード
│   └── BackToHomeButton.tsx
├── hooks/                 # カスタムフック
│   ├── useAuth.ts        # 認証フック
│   └── useLogs.ts        # ログ管理フック
└── lib/                  # ユーティリティライブラリ
    ├── supabaseClient.ts # Supabase設定
    └── storage.ts        # localStorage管理
```

## 主要コンポーネント

### 認証システム
```typescript
// 認証状態の監視
const { user, loading, isAuthenticated } = useAuth()

// ログアウト
<LogoutButton variant="text" size="sm">
  ログアウト
</LogoutButton>

// 認証ガード
<AuthGuard>
  <ProtectedComponent />
</AuthGuard>
```

### タスクログ
```typescript
// ログの保存・取得
const { saveDailyLog, saveWeeklyLog, dailyLogs, weeklyLogs } = useLogs()

// 日次ログの保存
await saveDailyLog(dateKey, tasks)

// 週次ログの保存
await saveWeeklyLog(weekKey, tasks)
```

### ポモドーロタイマー
```typescript
// タイマー状態の管理
const [timeLeft, setTimeLeft] = useState(25 * 60) // 25分
const [isRunning, setIsRunning] = useState(false)
const [mode, setMode] = useState<'work' | 'break'>('work')

// 通知機能
if ('Notification' in window && Notification.permission === 'granted') {
  new Notification('作業時間終了！', {
    body: '休憩時間を開始しましょう'
  })
}
```

## 開発

```bash
# 型チェック
pnpm run type-check

# リンター実行
pnpm run lint

# ビルド
pnpm run build

# テスト実行
pnpm run test

# テストUI
pnpm run test:ui
```

## デプロイ

### Vercel（推奨）
1. GitHubリポジトリをVercelに接続
2. 環境変数を設定:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. 自動デプロイが実行されます

### その他のプラットフォーム
- Next.js 15のApp Routerに対応したプラットフォームで動作
- 静的エクスポートには対応していません（認証・データベース機能のため）

## 特徴的な実装

### Next.js 15 App Router対応
- サーバーコンポーネントとクライアントコンポーネントの適切な分離
- `Suspense`を使用したローディング状態の管理
- `useSearchParams`のSuspense境界エラー対策

### Supabase統合
- Row Level Security (RLS) による安全なデータアクセス
- リアルタイムデータ同期
- 認証状態の自動管理

### レスポンシブデザイン
- モバイルファーストのデザイン
- Tailwind CSSによる統一されたスタイリング
- ダークテーマ対応

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。

## サポート

質問や問題がある場合は、GitHubのIssuesページでお知らせください。