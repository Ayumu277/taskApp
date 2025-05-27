'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import DonutChart from '@/components/DonutChart';
import AddGoalModal from '@/components/AddGoalModal';

interface QuarterGoal {
  id: string;
  title: string;
  progress: number;
}

const quarters = [
  { id: 'Q1', label: 'Q1 2025', key: '2025-Q1' },
  { id: 'Q2', label: 'Q2 2025', key: '2025-Q2' },
  { id: 'Q3', label: 'Q3 2025', key: '2025-Q3' },
  { id: 'Q4', label: 'Q4 2025', key: '2025-Q4' },
];

export default function DashboardPage() {
  const [activeQuarter, setActiveQuarter] = useState('Q1');
  const [goals, setGoals] = useState<{ [key: string]: QuarterGoal[] }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load goals from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadedGoals: { [key: string]: QuarterGoal[] } = {};
      quarters.forEach((quarter) => {
        const stored = localStorage.getItem(`quarterGoals:${quarter.key}`);
        loadedGoals[quarter.id] = stored ? JSON.parse(stored) : [];
      });
      setGoals(loadedGoals);
    }
  }, []);

  // Save goals to localStorage
  const saveGoals = (quarterId: string, quarterGoals: QuarterGoal[]) => {
    if (typeof window !== 'undefined') {
      const quarter = quarters.find((q) => q.id === quarterId);
      if (quarter) {
        localStorage.setItem(`quarterGoals:${quarter.key}`, JSON.stringify(quarterGoals));
      }
    }
  };

  const addGoal = (title: string) => {
    const newGoal: QuarterGoal = {
      id: Date.now().toString(),
      title,
      progress: 0,
    };

    const updatedGoals = [...(goals[activeQuarter] || []), newGoal];
    setGoals((prev) => ({ ...prev, [activeQuarter]: updatedGoals }));
    saveGoals(activeQuarter, updatedGoals);
    setIsModalOpen(false);
  };

  const updateGoalProgress = (goalId: string, newProgress: number) => {
    const currentGoals = goals[activeQuarter] || [];
    const updatedGoals = currentGoals.map((goal) =>
      goal.id === goalId ? { ...goal, progress: newProgress } : goal
    );
    setGoals((prev) => ({ ...prev, [activeQuarter]: updatedGoals }));
    saveGoals(activeQuarter, updatedGoals);
  };

  const currentGoals = goals[activeQuarter] || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            ダッシュボード
          </h1>
          <p className="text-gray-400">
            四半期ごとの目標を管理し、進捗を追跡しましょう
          </p>
        </div>

        {/* Quarter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {quarters.map((quarter) => (
                <button
                  key={quarter.id}
                  onClick={() => setActiveQuarter(quarter.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeQuarter === quarter.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  {quarter.label}
                </button>
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
                  四半期の目標を設定しましょう
                </p>
              </div>
            </button>
          )}
        </div>

        {/* Goals Limit Message */}
        {currentGoals.length >= 3 && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-center">
            <p className="text-accent font-medium">
              四半期あたり最大3つの目標まで設定できます
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
              {quarters.find(q => q.id === activeQuarter)?.label}の目標を追加して始めましょう
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
        quarterLabel={quarters.find(q => q.id === activeQuarter)?.label || ''}
      />
    </div>
  );
}