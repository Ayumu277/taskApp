# TaskApp

生産性を最大化する究極のタスク管理アプリ

## 概要

TaskAppは年間目標から時間単位のタスクまで、あらゆるレベルで生産性を追跡・管理できるWebアプリケーションです。データ駆動型のインサイトで、より効率的な毎日を実現します。

## 主な機能

### 📅 多層的な時間管理
- **年間ビュー**: 12週間の長期目標設定
- **週間ビュー**: 週単位の目標管理と実行スコア
- **日間ビュー**: フォーカスタスクとセッション進捗
- **時間ビュー**: 詳細な時間ログと振り返り

### 🎯 目標管理
- **四半期目標**: 最大3つの重要な目標設定
- **Kanbanボード**: タスクのドラッグ&ドロップ管理
- **進捗追跡**: DonutChartによる視覚的な進捗表示

### 📊 分析とレビュー
- **週次レビュー**: 振り返りと学びの記録
- **実行スコア**: 週末の自動評価システム
- **フィード**: 共有タスクの活動履歴

### 🔔 通知システム
- **ブラウザ通知**: リマインダーとアラート
- **スケジュール通知**: 遅延実行機能
- **テンプレート**: 一般的な用途向けプリセット

## 技術スタック

- **Frontend**: Next.js 15.0.0-rc.0, React 19.1.0, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Charts**: カスタムDonutChart
- **Drag & Drop**: react-beautiful-dnd
- **Storage**: localStorage
- **Package Manager**: pnpm

## セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm run dev

# ブラウザで http://localhost:3000 を開く
```

## 通知ライブラリの使用例

TaskAppには強力な通知システムが組み込まれています。

### 基本的な使用方法

```typescript
import { scheduleNotification, showNotification } from '@/lib/notify';

// 即座に通知を表示
await showNotification('タスク完了', 'おめでとうございます！');

// 5分後に通知をスケジュール
const timerId = scheduleNotification(
  'タスクリマインダー',
  '次のタスクを開始してください',
  5 * 60 * 1000 // 5分 = 300,000ms
);

// 通知をキャンセル
cancelScheduledNotification(timerId);
```

### 高度な使用例

```typescript
import {
  scheduleNotification,
  NotificationTemplates,
  getNotificationStatus
} from '@/lib/notify';

// 通知の対応状況を確認
const status = getNotificationStatus();
console.log('通知対応:', status.canNotify);

// テンプレートを使用
NotificationTemplates.reminder('プレゼン準備', 30 * 60 * 1000); // 30分後
NotificationTemplates.break(25 * 60 * 1000); // 25分後に休憩リマインダー

// カスタムオプション付き通知
scheduleNotification(
  '重要なミーティング',
  '5分後に開始します',
  5 * 60 * 1000,
  {
    requireInteraction: true, // ユーザーが閉じるまで表示
    tag: 'meeting-reminder',  // 重複防止用タグ
    vibrate: [200, 100, 200]  // バイブレーションパターン
  }
);

// 複数の通知を一括スケジュール
const timerIds = scheduleMultipleNotifications([
  {
    title: '作業開始',
    body: 'フォーカスタイムを始めましょう',
    delayMs: 0
  },
  {
    title: '休憩時間',
    body: '25分経過しました',
    delayMs: 25 * 60 * 1000
  },
  {
    title: 'セッション終了',
    body: 'お疲れ様でした！',
    delayMs: 30 * 60 * 1000
  }
]);
```

### 実際の使用シーン

```typescript
// ポモドーロタイマーの実装例
const startPomodoroSession = () => {
  // 作業開始通知
  showNotification('ポモドーロ開始', '25分間集中しましょう！');

  // 25分後の休憩リマインダー
  scheduleNotification(
    '休憩時間',
    '25分お疲れ様でした。5分休憩しましょう。',
    25 * 60 * 1000,
    { requireInteraction: true }
  );
};

// 週次レビューのリマインダー
const scheduleWeeklyReview = () => {
  const now = new Date();
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + (7 - now.getDay()));
  nextSunday.setHours(18, 0, 0, 0);

  const delayMs = nextSunday.getTime() - now.getTime();

  scheduleNotification(
    '週次レビュー',
    '今週の振り返りを記録しましょう',
    delayMs,
    { requireInteraction: true, tag: 'weekly-review' }
  );
};
```

## ディレクトリ構造

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # 四半期目標管理
│   ├── day/              # 日間プラン
│   ├── feed/             # 活動フィード
│   ├── hour/             # 時間ログ
│   ├── onboarding/       # 初期設定
│   ├── review/           # 週次レビュー
│   ├── week/             # 週間目標
│   └── year/             # 年間目標
├── components/            # 再利用可能コンポーネント
│   ├── AddGoalModal.tsx
│   ├── DonutChart.tsx
│   ├── HourTaskModal.tsx
│   └── WeekScoreModal.tsx
└── lib/                  # ユーティリティライブラリ
    ├── notify.ts         # 通知システム
    └── storage.ts        # localStorage管理
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
```

## ライセンス

MIT License