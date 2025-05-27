'use client';

import { useState, useEffect } from 'react';
import { getItem, setItem } from '@/lib/storage';
import { PencilIcon, CheckIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import BackToHomeButton from '@/components/BackToHomeButton';

interface WeeklyReview {
  weekKey: string;
  dateRange: string;
  review: string;
  lastModified: string;
}

// Helper function to get ISO week number
const getISOWeek = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
};

// Get date range for a week (Monday to Sunday)
const getWeekDateRange = (year: number, week: number): string => {
  const jan4 = new Date(year, 0, 4);
  const jan4Day = jan4.getDay() || 7;
  const mondayOfWeek1 = new Date(jan4);
  mondayOfWeek1.setDate(jan4.getDate() - jan4Day + 1);

  const targetMonday = new Date(mondayOfWeek1);
  targetMonday.setDate(mondayOfWeek1.getDate() + (week - 1) * 7);

  const targetSunday = new Date(targetMonday);
  targetSunday.setDate(targetMonday.getDate() + 6);

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return `${formatDate(targetMonday)} - ${formatDate(targetSunday)}`;
};

// Generate week keys for the past 12 weeks
const generateRecentWeekKeys = (): string[] => {
  const keys: string[] = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (i * 7));
    const year = date.getFullYear();
    const week = getISOWeek(date);
    keys.push(`${year}-W${week.toString().padStart(2, '0')}`);
  }

  return keys;
};

export default function ReviewPage() {
  const [reviews, setReviews] = useState<WeeklyReview[]>([]);
  const [editingWeek, setEditingWeek] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    const weekKeys = generateRecentWeekKeys();
    const loadedReviews: WeeklyReview[] = [];

        weekKeys.forEach(weekKey => {
      const storageKey = `weeklyReview:${weekKey}`;
      const reviewData = getItem<{ review: string; lastModified: string } | null>(storageKey, null);

      if (reviewData && reviewData.review.trim()) {
        const [year, weekStr] = weekKey.split('-W');
        const week = parseInt(weekStr);
        const dateRange = getWeekDateRange(parseInt(year), week);

        loadedReviews.push({
          weekKey,
          dateRange,
          review: reviewData.review,
          lastModified: reviewData.lastModified
        });
      }
    });

    // Sort by week key (newest first)
    loadedReviews.sort((a, b) => b.weekKey.localeCompare(a.weekKey));
    setReviews(loadedReviews);
    setIsLoading(false);
  };

  const saveReview = (weekKey: string, reviewText: string) => {
    const storageKey = `weeklyReview:${weekKey}`;
    const reviewData = {
      review: reviewText,
      lastModified: new Date().toISOString()
    };
    setItem(storageKey, reviewData);
    loadReviews(); // Reload to update the list
  };

  const startEditing = (weekKey: string, currentText: string) => {
    setEditingWeek(weekKey);
    setEditText(currentText);
  };

  const cancelEditing = () => {
    setEditingWeek(null);
    setEditText('');
  };

  const saveEditing = () => {
    if (editingWeek && editText.trim()) {
      saveReview(editingWeek, editText.trim());
    }
    cancelEditing();
  };

  const createNewReview = () => {
    const now = new Date();
    const year = now.getFullYear();
    const week = getISOWeek(now);
    const weekKey = `${year}-W${week.toString().padStart(2, '0')}`;

    // Check if current week review already exists
    const existingReview = reviews.find(r => r.weekKey === weekKey);
    if (existingReview) {
      startEditing(weekKey, existingReview.review);
    } else {
      startEditing(weekKey, '');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">レビューを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gray-800/50 border-b border-gray-700 -mx-4 sm:-mx-6 lg:-mx-8 mb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <BackToHomeButton position="left" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
                  週次レビュー
                </h1>
                <p className="text-gray-400">
                  週ごとの振り返りと学びを記録しましょう
                </p>
              </div>
              <div></div>
            </div>
          </div>
        </div>

        {/* Add New Review Button */}
        <div className="mb-8">
          <button
            onClick={createNewReview}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <PlusIcon className="w-5 h-5" />
            今週のレビューを作成
          </button>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <PencilIcon className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              まだレビューがありません
            </h3>
            <p className="text-gray-500 mb-6">
              最初の週次レビューを作成して振り返りを始めましょう
            </p>
            <button
              onClick={createNewReview}
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              最初のレビューを作成
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.weekKey}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors duration-200"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {review.weekKey}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {review.dateRange}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {new Date(review.lastModified).toLocaleDateString('ja-JP')}
                    </span>
                    {editingWeek === review.weekKey ? (
                      <div className="flex gap-1">
                        <button
                          onClick={saveEditing}
                          disabled={!editText.trim()}
                          className="p-1 text-green-400 hover:text-green-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(review.weekKey, review.review)}
                        className="p-1 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                {editingWeek === review.weekKey ? (
                  <div>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      placeholder="今週の振り返り、学び、改善点などを記録してください..."
                      maxLength={300}
                      rows={6}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400 resize-none"
                      autoFocus
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        週の振り返りを詳しく記録しましょう
                      </span>
                      <span className="text-xs text-gray-400">
                        {editText.length}/300
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {review.review}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 bg-gray-800/30 border border-gray-600 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-accent mb-3">💡 効果的な週次レビューのコツ</h3>
          <ul className="text-gray-300 space-y-2">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>今週達成できたことを具体的に記録する</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>うまくいかなかった点とその原因を分析する</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>来週に向けた改善点や新しい取り組みを計画する</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>感情や気づきも含めて振り返る</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}