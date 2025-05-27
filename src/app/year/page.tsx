'use client';

import { useState, useEffect } from 'react';
import { getItem, setItem } from '@/lib/storage';
import BackToHomeButton from '@/components/BackToHomeButton';
import { CheckCircleIcon, CalendarIcon, TrophyIcon, SparklesIcon } from '@heroicons/react/24/outline';
import DonutChart from '@/components/DonutChart';

const YEAR_GOAL_KEY = 'yearGoal';
const YEAR_PROGRESS_KEY = 'yearProgress';

interface WeekData {
  week: number;
  completed: boolean;
  score: number;
}

export default function YearGoalPage() {
  const [goal, setGoal] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [weekData, setWeekData] = useState<WeekData[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const savedGoal = getItem<string>(YEAR_GOAL_KEY, '');
    const savedProgress = getItem<number>(YEAR_PROGRESS_KEY, 0);
    setGoal(savedGoal);
    setProgress(savedProgress);

    // Initialize 12 weeks data
    const weeks: WeekData[] = Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      completed: i < Math.floor(savedProgress / 8.33), // Roughly 8.33% per week
      score: Math.random() * 100 // Placeholder for actual scores
    }));
    setWeekData(weeks);
  }, []);

  const handleSave = () => {
    setItem<string>(YEAR_GOAL_KEY, goal);
    setItem<number>(YEAR_PROGRESS_KEY, progress);
    setIsEditing(false);
  };

  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
    setItem<number>(YEAR_PROGRESS_KEY, newProgress);
  };

  const completedWeeks = Math.floor(progress / 8.33);
  const currentWeek = Math.min(completedWeeks + 1, 12);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <BackToHomeButton position="left" />
            <div className="flex items-center space-x-4">
              <CalendarIcon className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                12週間年間目標
              </h1>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Progress Chart */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">年間進捗</h3>
                <div className="relative inline-block">
                  <DonutChart completion={progress} />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">現在の週</span>
                    <span className="text-white font-medium">第{currentWeek}週</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">完了週数</span>
                    <span className="text-white font-medium">{completedWeeks}/12週</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Goal Card */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <TrophyIcon className="w-6 h-6 text-accent" />
                  <h3 className="text-lg font-semibold text-white">12週間目標</h3>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  {isEditing ? 'キャンセル' : '編集'}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="今後12週間で達成したい主要な目標を入力してください..."
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                    >
                      保存
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center">
                  {goal ? (
                    <p className="text-gray-300 leading-relaxed text-lg">{goal}</p>
                  ) : (
                    <div className="text-center w-full py-8">
                      <SparklesIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 mb-4">まだ目標が設定されていません</p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        目標を設定する
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Control */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">進捗を更新</h3>
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => updateProgress(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Weekly Progress Grid */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">週別進捗</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {weekData.map((week) => (
              <div
                key={week.week}
                className={`relative p-4 rounded-lg border transition-all duration-200 ${
                  week.week <= currentWeek
                    ? week.completed
                      ? 'bg-green-500/20 border-green-500/50 text-green-400'
                      : 'bg-primary/20 border-primary/50 text-primary'
                    : 'bg-gray-700/50 border-gray-600 text-gray-500'
                }`}
              >
                <div className="text-center">
                  <div className="text-sm font-medium mb-1">第{week.week}週</div>
                  {week.week <= currentWeek && (
                    <div className="flex justify-center">
                      {week.completed ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-current rounded-full"></div>
                      )}
                    </div>
                  )}
                </div>
                {week.week === currentWeek && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Motivational Section */}
        {progress > 0 && (
          <div className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6">
            <div className="text-center">
              <TrophyIcon className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                素晴らしい進歩です！
              </h3>
              <p className="text-gray-300">
                {progress < 25 && "良いスタートを切りました。この調子で続けましょう！"}
                {progress >= 25 && progress < 50 && "順調に進んでいます。目標達成まであと半分です！"}
                {progress >= 50 && progress < 75 && "折り返し地点を過ぎました。ゴールが見えてきています！"}
                {progress >= 75 && progress < 100 && "もう少しで完了です。最後まで頑張りましょう！"}
                {progress >= 100 && "おめでとうございます！12週間の目標を達成しました！"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}