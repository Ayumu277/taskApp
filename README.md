# Face Yourself

12週間で人生を加速させる、戦略的タスク管理アプリ

## 概要

Face Yourselfは年間目標から時間単位のタスクまで、あらゆるレベルで生産性を追跡・管理できるWebアプリケーションです。12週間スパンでの目標設定、ポモドーロタイマー、認証機能、タスクログ機能、PWA対応、オフライン同期機能を備えた統合的な生産性向上ツールです。

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

### 📱 PWA対応
- **ホーム画面追加**: アプリのようにホーム画面に追加可能
- **オフライン対応**: Service Workerによるキャッシュ機能
- **インストールプロンプト**: 自動的なインストール案内
- **スタンドアロンモード**: ネイティブアプリのような体験
- **プッシュ通知**: タイマー終了時の通知（ブラウザ通知）

### 📶 オフライン同期機能
- **オフライン入力**: ネットワーク接続なしでもデータ入力可能
- **自動同期**: オンライン復帰時の自動データ同期
- **同期状態表示**: リアルタイムの同期状況を視覚的に表示
- **データ保護**: オフライン時のデータ損失防止
- **手動同期**: 必要に応じた手動同期機能

### 📱 モバイル最適化
- **レスポンシブデザイン**: あらゆる画面サイズに対応
- **タッチフレンドリー**: 44px以上のタッチターゲット
- **セーフエリア対応**: iPhone等のノッチ・ホームインジケーター対応
- **タッチジェスチャー**: スワイプ・タップの最適化
- **モバイルファースト**: モバイル体験を優先した設計

### 📊 分析とレビュー
- **週次レビュー**: 振り返りと学びの記録
- **実行スコア**: 週末の自動評価システム
- **フィード**: 共有タスクの活動履歴
- **ログ閲覧**: 過去の記録を日次・週次で表示

## 技術スタック

- **Frontend**: Next.js 15.0.0-rc.0 (App Router), React 19.1.0, TypeScript
- **Backend**: Supabase (認証・データベース)
- **Styling**: Tailwind CSS, @tailwindcss/line-clamp
- **Icons**: Heroicons
- **Charts**: カスタムDonutChart, Recharts
- **Drag & Drop**: react-beautiful-dnd
- **Storage**: localStorage + Supabase
- **PWA**: Service Worker, Web App Manifest
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
3. 「記録を残す」でSupabaseに保存（オフライン時は自動的にローカル保存）

### 4. ポモドーロタイマー
1. `/hour` でタイマーページにアクセス
2. 作業時間・休憩時間を設定
3. タスク名と開始前メモを入力
4. タイマーを開始して集中作業

### 5. PWAインストール
1. ブラウザでアプリを開く
2. インストールプロンプトが表示されたら「インストール」をクリック
3. ホーム画面にアプリアイコンが追加される
4. ネイティブアプリのような体験が可能

### 6. オフライン使用
1. ネットワーク接続がない状態でもデータ入力可能
2. 同期状態インジケーターで現在の状況を確認
3. オンライン復帰時に自動的にデータが同期される
4. 手動同期ボタンで強制同期も可能

### 7. ログの確認
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
│   ├── onboarding/       # 初期設定
│   ├── layout.tsx        # PWA対応メタタグ
│   └── globals.css       # モバイル最適化スタイル
├── components/            # 再利用可能コンポーネント
│   ├── AddGoalModal.tsx  # 目標追加モーダル
│   ├── DonutChart.tsx    # 進捗円グラフ
│   ├── HourTaskModal.tsx # 時間ログモーダル
│   ├── LoginForm.tsx     # ログインフォーム
│   ├── LogoutButton.tsx  # ログアウトボタン
│   ├── AuthGuard.tsx     # 認証ガード
│   ├── SyncStatusIndicator.tsx # 同期状態表示
│   ├── PWAInstaller.tsx  # PWAインストールプロンプト
│   └── BackToHomeButton.tsx
├── hooks/                 # カスタムフック
│   ├── useAuth.ts        # 認証フック
│   ├── useLogs.ts        # ログ管理フック（オフライン対応）
│   └── useOfflineSync.ts # オフライン同期フック
└── lib/                  # ユーティリティライブラリ
    ├── supabaseClient.ts # Supabase設定
    └── storage.ts        # localStorage管理
public/
├── manifest.json         # PWA マニフェスト
├── sw.js                # Service Worker
└── face-yourself-logo.png # アプリアイコン
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

### オフライン同期
```typescript
// オフライン同期フック
const { syncStatus, isOnline, pendingCount, saveOfflineData, forcSync } = useOfflineSync()

// オフラインデータの保存
saveOfflineData('daily_log', { date, tasks }, userId)

// 同期状態の表示
<SyncStatusIndicator showText={true} />
```

### タスクログ（オフライン対応）
```typescript
// ログの保存・取得（オフライン対応）
const { saveDailyLog, saveWeeklyLog, dailyLogs, weeklyLogs } = useLogs()

// 日次ログの保存（オフライン時は自動的にローカル保存）
await saveDailyLog(dateKey, tasks)

// 週次ログの保存（オフライン時は自動的にローカル保存）
await saveWeeklyLog(weekKey, tasks)
```

### PWA機能
```typescript
// PWAインストールプロンプト
<PWAInstaller />

// Service Worker登録（自動）
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}
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

## モバイル最適化

### タッチターゲット
- 最小44px×44pxのタッチエリア
- `min-h-[44px]` クラスの使用
- タッチフレンドリーなボタンサイズ

### レスポンシブデザイン
- モバイルファーストアプローチ
- `sm:`, `md:`, `lg:` ブレークポイントの活用
- フレキシブルなグリッドレイアウト

### セーフエリア対応
```css
/* セーフエリア対応 */
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
padding-right: env(safe-area-inset-right);
```

## PWA機能

### マニフェスト設定
```json
{
  "name": "Face Yourself",
  "short_name": "Face Yourself",
  "display": "standalone",
  "theme_color": "#0ea5e9",
  "background_color": "#111827"
}
```

### Service Worker
- 重要なページとリソースのキャッシュ
- オフライン時のフォールバック
- 自動的なキャッシュ更新

### インストール機能
- 自動的なインストールプロンプト表示
- 24時間のクールダウン期間
- ユーザーフレンドリーなUI

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

### PWA対応の確認
- Lighthouse PWAスコアの確認
- Service Workerの動作確認
- オフライン機能のテスト
- インストール機能のテスト

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

### オフライン同期アーキテクチャ
- `navigator.onLine` による接続状態の監視
- localStorage を使用したオフラインデータ保存
- オンライン復帰時の自動同期処理
- 同期状態の視覚的フィードバック

### PWAアーキテクチャ
- Service Worker による効率的なキャッシュ戦略
- Web App Manifest による ネイティブアプリ体験
- インストールプロンプトの UX 最適化

### モバイル最適化
- セーフエリア対応による iPhone X 以降の対応
- タッチターゲットサイズの最適化
- レスポンシブデザインの徹底
- タッチジェスチャーの最適化

### レスポンシブデザイン
- モバイルファーストのデザイン
- Tailwind CSSによる統一されたスタイリング
- ダークテーマ対応
- 高解像度ディスプレイ対応

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。

## サポート

質問や問題がある場合は、GitHubのIssuesページでお知らせください。