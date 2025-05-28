'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import DonutChart from '@/components/DonutChart';
import AddGoalModal from '@/components/AddGoalModal';
import BackToHomeButton from '@/components/BackToHomeButton';

interface QuarterGoal {
  id: string;
  title: string;
  progress: number;
}

interface Span {
  id: string;
  label: string;
  key: string;
  startDate: string;
  endDate: string;
}

const getDefaultSpans = (): Span[] => [
  { id: 'SPAN1', label: 'スパン 1', key: 'span-1', startDate: '', endDate: '' },
  { id: 'SPAN2', label: 'スパン 2', key: 'span-2', startDate: '', endDate: '' },
  { id: 'SPAN3', label: 'スパン 3', key: 'span-3', startDate: '', endDate: '' },
  { id: 'SPAN4', label: 'スパン 4', key: 'span-4', startDate: '', endDate: '' },
];

export default function DashboardPage() {
  const [activeSpan, setActiveSpan] = useState('SPAN1');
  const [goals, setGoals] = useState<{ [key: string]: QuarterGoal[] }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spans, setSpans] = useState<Span[]>(getDefaultSpans());
  const [isSpanModalOpen, setIsSpanModalOpen] = useState(false);
  const [editingSpan, setEditingSpan] = useState<Span | null>(null);

  // Load spans and goals from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load spans
      const savedSpans = localStorage.getItem('spans');
      const loadedSpans = savedSpans ? JSON.parse(savedSpans) : getDefaultSpans();
      setSpans(loadedSpans);

      // Load goals
      const loadedGoals: { [key: string]: QuarterGoal[] } = {};
      loadedSpans.forEach((span: Span) => {
        const stored = localStorage.getItem(`spanGoals:${span.key}`);
        loadedGoals[span.id] = stored ? JSON.parse(stored) : [];
      });
      setGoals(loadedGoals);
    }
  }, []);

  // Save spans to localStorage
  const saveSpans = (newSpans: Span[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('spans', JSON.stringify(newSpans));
      setSpans(newSpans);
    }
  };

  // Save goals to localStorage
  const saveGoals = (spanId: string, spanGoals: QuarterGoal[]) => {
    if (typeof window !== 'undefined') {
      const span = spans.find((s) => s.id === spanId);
      if (span) {
        localStorage.setItem(`spanGoals:${span.key}`, JSON.stringify(spanGoals));
      }
    }
  };

  const addGoal = (title: string, startDate?: string, endDate?: string) => {
    const newGoal: QuarterGoal = {
      id: Date.now().toString(),
      title,
      progress: 0,
    };

    // If dates are provided, update the span
    if (startDate && endDate) {
      const updatedSpans = spans.map(s =>
        s.id === activeSpan ? { ...s, startDate, endDate } : s
      );
      saveSpans(updatedSpans);
    }

    const updatedGoals = [...(goals[activeSpan] || []), newGoal];
    setGoals((prev) => ({ ...prev, [activeSpan]: updatedGoals }));
    saveGoals(activeSpan, updatedGoals);
    setIsModalOpen(false);
  };

  const updateGoalProgress = (goalId: string, newProgress: number) => {
    const currentGoals = goals[activeSpan] || [];
    const updatedGoals = currentGoals.map((goal) =>
      goal.id === goalId ? { ...goal, progress: newProgress } : goal
    );
    setGoals((prev) => ({ ...prev, [activeSpan]: updatedGoals }));
    saveGoals(activeSpan, updatedGoals);
  };

  const currentGoals = goals[activeSpan] || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gray-800/50 border-b border-gray-700 -mx-4 sm:-mx-6 lg:-mx-8 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <BackToHomeButton position="left" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  12週間目標
                </h1>
                <p className="text-gray-400">
                  12週間スパンの目標を管理し、進捗を追跡しましょう
                </p>
              </div>
              <div></div>
            </div>
          </div>
        </div>

        {/* Span Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {spans.map((span) => (
                <div key={span.id} className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveSpan(span.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeSpan === span.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    {span.label}
                    {span.startDate && span.endDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        {span.startDate} ~ {span.endDate}
                      </div>
                    )}
                  </button>
                  {span.id === 'SPAN1' && (
                    <Link
                      href="/week"
                      className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
                    >
                      📅
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentGoals.slice(0, 3).map((goal) => (
            <div
              key={goal.id}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors duration-200 group"
            >
              <div className="flex flex-col items-center space-y-4">
                {/* Donut Chart */}
                <div className="relative">
                  <DonutChart completion={goal.progress} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {Math.round(goal.progress)}%
                    </span>
                  </div>
                </div>

                {/* Goal Title */}
                <h3 className="text-lg font-semibold text-center text-white mb-2">
                  {goal.title}
                </h3>

                {/* Kanban Link */}
                <Link
                  href={`/dashboard/${goal.id}`}
                  className="text-sm text-primary hover:text-primary/80 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                >
                  タスクを管理 →
                </Link>

                {/* Progress Controls */}
                <div className="w-full space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Goal Card */}
          {currentGoals.length < 3 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gray-800/30 border-2 border-dashed border-gray-600 rounded-xl p-6 hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-200 flex flex-col items-center justify-center space-y-4 min-h-[280px]"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <PlusIcon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-300 mb-1">
                  新しい目標を追加
                </h3>
                <p className="text-sm text-gray-500">
                  12週間スパンの目標を設定しましょう
                </p>
              </div>
            </button>
          )}
        </div>

        {/* Goals Limit Message */}
        {currentGoals.length >= 3 && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-center">
            <p className="text-accent font-medium">
              12週間スパンあたり最大3つの目標まで設定できます
            </p>
            <p className="text-sm text-gray-400 mt-1">
              集中して取り組むために、重要な目標に絞りましょう
            </p>
          </div>
        )}

        {/* Empty State */}
        {currentGoals.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusIcon className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              まだ目標が設定されていません
            </h3>
            <p className="text-gray-500 mb-6">
              {spans.find(s => s.id === activeSpan)?.label}の目標を追加して始めましょう
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              最初の目標を追加
            </button>
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addGoal}
        quarterLabel={spans.find(s => s.id === activeSpan)?.label || ''}
      />

      {/* Span Edit Modal */}
      {isSpanModalOpen && editingSpan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingSpan.label}の期間設定
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  開始日
                </label>
                <input
                  type="date"
                  value={editingSpan.startDate}
                  onChange={(e) => setEditingSpan({...editingSpan, startDate: e.target.value})}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  終了日（12週間後）
                </label>
                <input
                  type="date"
                  value={editingSpan.endDate}
                  onChange={(e) => setEditingSpan({...editingSpan, endDate: e.target.value})}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsSpanModalOpen(false);
                  setEditingSpan(null);
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  const updatedSpans = spans.map(s =>
                    s.id === editingSpan.id ? editingSpan : s
                  );
                  saveSpans(updatedSpans);
                  setIsSpanModalOpen(false);
                  setEditingSpan(null);
                }}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}