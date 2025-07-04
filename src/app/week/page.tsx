'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '@/lib/storage';
import DonutChart from '@/components/DonutChart';
import WeekScoreModal from '@/components/WeekScoreModal';
import BackToHomeButton from '@/components/BackToHomeButton';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { useLogs, TaskLog } from '@/hooks/useLogs';
import { useAuth } from '@/hooks/useAuth';

// Helper function to get ISO week number
const getISOWeek = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
};

const getCurrentWeekKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const week = getISOWeek(now);
  return `weekGoal:${year}-W${week.toString().padStart(2, '0')}`;
};

const getWeekScoreKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const week = getISOWeek(now);
  return `weekScore:${year}-W${week.toString().padStart(2, '0')}`;
};

// Check if it's Sunday 18:00 or later
const isWeekEndTime = (): boolean => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const hour = now.getHours();
  return day === 0 && hour >= 18;
};

export default function WeeklyGoalPage() {
  const [currentWeekGoal, setCurrentWeekGoal] = useState<string>('');
  const [weekKey, setWeekKey] = useState<string>('');
  const [weekScore, setWeekScore] = useState<number | null>(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [hasCheckedAutoModal, setHasCheckedAutoModal] = useState(false);

  const { saveWeeklyLog, loading: logLoading, error: logError } = useLogs();
  const { isAuthenticated } = useAuth();

  const getWeekStartDate = useCallback(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as start of week
    const monday = new Date(now.setDate(diff));
    return monday.toISOString().split('T')[0];
  }, []);

  useEffect(() => {
    const currentKey = getCurrentWeekKey();
    const scoreKey = getWeekScoreKey();
    setWeekKey(currentKey);

    // Load the current week's goal
    const savedWeekGoal = getItem<string>(currentKey, '');
    setCurrentWeekGoal(savedWeekGoal);

    // Load the current week's score
    const savedScore = getItem<number | null>(scoreKey, null);
    setWeekScore(savedScore);

    // Check for auto-modal on Sunday 18:00+
    if (!hasCheckedAutoModal && isWeekEndTime() && savedScore === null) {
      setIsScoreModalOpen(true);
    }
    setHasCheckedAutoModal(true);
  }, [hasCheckedAutoModal]);

  const handleSaveWeekGoal = () => {
    if (weekKey) {
      setItem<string>(weekKey, currentWeekGoal);
      alert('Weekly goal saved!');
    }
  };

  const handleSaveScore = (score: number) => {
    const scoreKey = getWeekScoreKey();
    setItem<number>(scoreKey, score);
    setWeekScore(score);
  };

  const openScoreModal = () => {
    setIsScoreModalOpen(true);
  };

  const handleSaveWeeklyLog = async () => {
    if (!isAuthenticated) {
      alert('ログインが必要です');
      return;
    }

    if (!currentWeekGoal.trim()) {
      alert('保存する週間目標がありません');
      return;
    }

    // Get focus tasks from daily storage for this week
    const weekStart = getWeekStartDate();
    const focusTasks: TaskLog[] = [];

    // Collect focus tasks from the past 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayFocusKey = `dayFocus:${dateStr}`;
      const dayTasks = getItem(dayFocusKey, []) as any[];

      dayTasks.forEach((task, index) => {
        if (task.text && task.text.trim()) {
          focusTasks.push({
            id: focusTasks.length + 1,
            text: task.text,
            completed: task.completed || false
          });
        }
      });
    }

    const success = await saveWeeklyLog(weekStart, currentWeekGoal, focusTasks);
    if (success) {
      alert('今週の記録を保存しました！');
    } else {
      alert(`保存に失敗しました: ${logError}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <BackToHomeButton position="left" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-white">
                週間ビュー
              </h1>
              <p className="text-gray-400 text-sm">
                {weekKey.split(':')[1]}
              </p>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-400 mb-8">
          今週の目標を設定し、実行スコアを記録しましょう
        </p>

        {/* Week Goal and Score Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Week Goal Input */}
          <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">今週の目標</h2>
            <div className="space-y-4">
              <textarea
                value={currentWeekGoal}
                onChange={(e) => setCurrentWeekGoal(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400 resize-none"
                placeholder="今週達成したい具体的な目標を入力してください..."
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleSaveWeekGoal}
                  className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  目標を保存
                </button>
                {isAuthenticated && (
                  <button
                    onClick={handleSaveWeeklyLog}
                    disabled={logLoading}
                    className="flex items-center bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    <BookmarkIcon className="w-4 h-4 mr-2" />
                    {logLoading ? '保存中...' : '週記録を残す'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Week Score */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-accent">実行スコア</h3>
              <button
                onClick={openScoreModal}
                className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
              >
                スコア入力
              </button>
            </div>

            {weekScore !== null ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <DonutChart completion={weekScore} />
                </div>
                <p className="text-sm text-gray-400 text-center">
                  今週の実行スコア: {weekScore}%
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  まだスコアが入力されていません
                </p>
                <button
                  onClick={openScoreModal}
                  className="bg-primary hover:bg-primary/90 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  スコアを入力
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gray-800/30 border border-gray-600 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-accent mb-3">💡 効果的な週間目標のコツ</h3>
          <ul className="text-gray-300 space-y-2">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>具体的で測定可能な目標を設定する</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>1週間で現実的に達成可能な範囲に設定する</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>12週間目標との関連性を意識する</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>日曜日の夕方に実行スコアを振り返る</span>
            </li>
          </ul>
        </div>

        {/* Week Score Modal */}
        <WeekScoreModal
          isOpen={isScoreModalOpen}
          onClose={() => setIsScoreModalOpen(false)}
          onSave={handleSaveScore}
          weekKey={weekKey}
        />
      </div>
    </div>
  );
}