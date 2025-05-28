'use client';

import DonutChart from '../../components/DonutChart';
import HourTaskModal, { HourTask } from '../../components/HourTaskModal';
import BackToHomeButton from '@/components/BackToHomeButton';
import React, { useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '@/lib/storage';
import { PlusIcon, CheckIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { useLogs, TaskLog } from '@/hooks/useLogs';
import { useAuth } from '@/hooks/useAuth';

interface SessionProgress {
  id: number;
  label: string;
  value: number;
}

interface FocusTask {
  id: number;
  text: string;
  completed: boolean;
}

const DayPage = () => {
  const [todayKey, setTodayKey] = useState('');
  const [dailyGoal, setDailyGoal] = useState<string>('');
  const [focusTasks, setFocusTasks] = useState<FocusTask[]>([
    { id: 1, text: '', completed: false },
    { id: 2, text: '', completed: false },
    { id: 3, text: '', completed: false },
    { id: 4, text: '', completed: false },
  ]);
  const [sessions, setSessions] = useState<SessionProgress[]>([
    { id: 1, label: 'Session 1', value: 0 },
    { id: 2, label: 'Session 2', value: 0 },
    { id: 3, label: 'Session 3', value: 0 },
    { id: 4, label: 'Session 4', value: 0 },
  ]);
  const [hourTasks, setHourTasks] = useState<HourTask[]>([]);
  const [isHourModalOpen, setIsHourModalOpen] = useState(false);
  const [overallCompletion, setOverallCompletion] = useState<number>(0);

  const { saveDailyLog, loading: logLoading, error: logError } = useLogs();
  const { isAuthenticated } = useAuth();

  const getFormattedDate = useCallback(() => {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  }, []);

  useEffect(() => {
    const dateStr = getFormattedDate();
    setTodayKey(dateStr);

    const goalKey = `dayGoal:${dateStr}`;
    const progressKey = `dayProgress:${dateStr}`;
    const focusKey = `dayFocus:${dateStr}`;
    const hourKey = `hourTasks:${dateStr}`;

    // Load daily goal
    const loadedGoal = getItem<string>(goalKey, '');
    if (loadedGoal) {
      setDailyGoal(loadedGoal);
    }

    // Load focus tasks
    const loadedFocusTasks = getItem<FocusTask[]>(focusKey, []);
    if (loadedFocusTasks && loadedFocusTasks.length === 4) {
      setFocusTasks(loadedFocusTasks);
    }

    // Load session progress
    const loadedSessions = getItem<SessionProgress[]>(progressKey, []);
    if (loadedSessions && loadedSessions.length === 4) {
      setSessions(loadedSessions);
    } else {
      const initialSessions: SessionProgress[] = [
        { id: 1, label: 'Session 1', value: 0 },
        { id: 2, label: 'Session 2', value: 0 },
        { id: 3, label: 'Session 3', value: 0 },
        { id: 4, label: 'Session 4', value: 0 },
      ];
      setSessions(initialSessions);
      setItem(progressKey, initialSessions);
    }

    // Load hour tasks
    const loadedHourTasks = getItem<HourTask[]>(hourKey, []);
    if (loadedHourTasks && Array.isArray(loadedHourTasks)) {
      setHourTasks(loadedHourTasks);
    }
  }, [getFormattedDate]);

  // Save daily goal
  useEffect(() => {
    if (todayKey) {
      const goalKey = `dayGoal:${todayKey}`;
      setItem(goalKey, dailyGoal);
    }
  }, [dailyGoal, todayKey]);

  // Save focus tasks
  useEffect(() => {
    if (todayKey) {
      const focusKey = `dayFocus:${todayKey}`;
      setItem(focusKey, focusTasks);
    }
  }, [focusTasks, todayKey]);

  // Save session progress
  useEffect(() => {
    if (todayKey) {
      const progressKey = `dayProgress:${todayKey}`;
      setItem(progressKey, sessions);
    }
    // Calculate overall completion
    const totalValue = sessions.reduce((sum, session) => sum + session.value, 0);
    setOverallCompletion(sessions.length > 0 ? totalValue / sessions.length : 0);
  }, [sessions, todayKey]);

  // Save hour tasks
  useEffect(() => {
    if (todayKey) {
      const hourKey = `hourTasks:${todayKey}`;
      setItem(hourKey, hourTasks);
    }
  }, [hourTasks, todayKey]);

  const handleGoalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDailyGoal(event.target.value);
  };

  const handleFocusTaskChange = (taskId: number, text: string) => {
    setFocusTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, text } : task
      )
    );
  };

  const handleFocusTaskToggle = (taskId: number) => {
    setFocusTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleSliderChange = (sessionId: number, value: number) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === sessionId ? { ...session, value } : session
      )
    );
  };

  const handleAddHourTask = (newTask: HourTask) => {
    setHourTasks(prev => [newTask, ...prev]);
  };

  const handleSaveDailyLog = async () => {
    if (!isAuthenticated) {
      alert('ログインが必要です');
      return;
    }

    const tasksToSave: TaskLog[] = focusTasks
      .filter(task => task.text.trim())
      .map(task => ({
        id: task.id,
        text: task.text,
        completed: task.completed
      }));

    if (tasksToSave.length === 0) {
      alert('保存するタスクがありません');
      return;
    }

    const success = await saveDailyLog(todayKey, tasksToSave);
    if (success) {
      alert('今日の記録を保存しました！');
    } else {
      alert(`保存に失敗しました: ${logError}`);
    }
  };

  const completedFocusTasks = focusTasks.filter(task => task.completed && task.text.trim()).length;
  const totalFocusTasks = focusTasks.filter(task => task.text.trim()).length;

  if (!todayKey) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <BackToHomeButton position="left" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-white">
                今日のタスク
              </h1>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <p className="text-gray-400 mb-8">
          今日の目標を設定し、セッションと時間ログを管理しましょう
        </p>

        {/* Daily Goal */}
        <div className="mb-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <label htmlFor="dailyGoal" className="block text-lg font-semibold mb-3 text-primary">
            今日の目標
          </label>
          <input
            type="text"
            id="dailyGoal"
            value={dailyGoal}
            onChange={handleGoalChange}
            placeholder="今日の主要な目標は何ですか？"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors text-white placeholder-gray-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section A: Focus Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-accent">フォーカスタスク</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">
                    {completedFocusTasks}/{totalFocusTasks} 完了
                  </span>
                  {isAuthenticated && (
                    <button
                      onClick={handleSaveDailyLog}
                      disabled={logLoading}
                      className="flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm rounded-lg transition-colors duration-200"
                    >
                      <BookmarkIcon className="w-4 h-4 mr-1" />
                      {logLoading ? '保存中...' : '記録を残す'}
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {focusTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3">
                    <button
                      onClick={() => handleFocusTaskToggle(task.id)}
                      className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                        task.completed
                          ? 'bg-accent border-accent text-white'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      {task.completed && <CheckIcon className="w-3 h-3" />}
                    </button>
                    <input
                      type="text"
                      value={task.text}
                      onChange={(e) => handleFocusTaskChange(task.id, e.target.value)}
                      placeholder={`フォーカスタスク ${task.id}`}
                      className={`flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors text-white placeholder-gray-400 ${
                        task.completed ? 'line-through opacity-60' : ''
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Section B: Session Sliders */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-accent mb-4">セッション進捗</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.map((session) => {
                  const relatedTask = focusTasks.find(task => task.id === session.id);
                  const taskName = relatedTask?.text || `フォーカスタスク ${session.id}`;
                  return (
                    <div key={session.id} className="bg-gray-700/30 rounded-lg p-4">
                      <label htmlFor={`session-${session.id}`} className="block text-sm font-medium mb-2 text-primary">
                        {taskName} ({session.value}%)
                      </label>
                      <input
                        type="range"
                        id={`session-${session.id}`}
                        min="0"
                        max="100"
                        value={session.value}
                        onChange={(e) => handleSliderChange(session.id, parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section C: Hour Tasks + Overall Progress */}
          <div className="space-y-6">
            {/* Overall Progress */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-accent mb-4 text-center">全体進捗</h2>
              <div className="flex justify-center">
                <DonutChart completion={overallCompletion} />
              </div>
            </div>

            {/* Hour Tasks */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-accent">時間ログ</h2>
                <button
                  onClick={() => setIsHourModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg transition-colors duration-200"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>

              {hourTasks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <PlusIcon className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    まだタスクログがありません
                  </p>
                  <button
                    onClick={() => setIsHourModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    最初のログを追加
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {hourTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="bg-gray-700/30 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-medium text-white truncate">
                          {task.task}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(task.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {(task.before || task.after) && (
                        <p className="text-xs text-gray-400 truncate">
                          {task.before || task.after}
                        </p>
                      )}
                    </div>
                  ))}
                  {hourTasks.length > 5 && (
                    <p className="text-xs text-gray-500 text-center">
                      他 {hourTasks.length - 5} 件のログ
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hour Task Modal */}
        <HourTaskModal
          isOpen={isHourModalOpen}
          onClose={() => setIsHourModalOpen(false)}
          onSave={handleAddHourTask}
        />
      </div>
    </div>
  );
};

export default DayPage;