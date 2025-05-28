'use client';

import React, { useState, useEffect } from 'react';
import { useLogs, DailyLog, WeeklyLog, TaskLog } from '@/hooks/useLogs';
import { useAuth } from '@/hooks/useAuth';
import BackToHomeButton from '@/components/BackToHomeButton';
import { CalendarDaysIcon, ClockIcon, CheckIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [weeklyLogs, setWeeklyLogs] = useState<WeeklyLog[]>([]);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editingTasks, setEditingTasks] = useState<TaskLog[]>([]);
  const [editingGoal, setEditingGoal] = useState<string>('');

  const {
    getDailyLogs,
    getWeeklyLogs,
    updateDailyLog,
    updateWeeklyLog,
    deleteDailyLog,
    deleteWeeklyLog,
    loading,
    error
  } = useLogs();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadLogs();
    }
  }, [isAuthenticated]);

  const loadLogs = async () => {
    const [daily, weekly] = await Promise.all([
      getDailyLogs(),
      getWeeklyLogs()
    ]);
    setDailyLogs(daily);
    setWeeklyLogs(weekly);
  };

  const startEditingDaily = (log: DailyLog) => {
    setEditingLogId(log.id);
    setEditingTasks([...log.tasks]);
  };

  const startEditingWeekly = (log: WeeklyLog) => {
    setEditingLogId(log.id);
    setEditingGoal(log.tasks.goal);
    setEditingTasks([...log.tasks.focusTasks]);
  };

  const cancelEditing = () => {
    setEditingLogId(null);
    setEditingTasks([]);
    setEditingGoal('');
  };

  const saveEditDaily = async (logId: string) => {
    const success = await updateDailyLog(logId, editingTasks);
    if (success) {
      await loadLogs();
      cancelEditing();
      alert('ログを更新しました');
    } else {
      alert('更新に失敗しました');
    }
  };

  const saveEditWeekly = async (logId: string) => {
    const success = await updateWeeklyLog(logId, editingGoal, editingTasks);
    if (success) {
      await loadLogs();
      cancelEditing();
      alert('ログを更新しました');
    } else {
      alert('更新に失敗しました');
    }
  };

  const handleDeleteDaily = async (logId: string, date: string) => {
    if (confirm(`${formatDate(date)}の日次ログを削除しますか？`)) {
      const success = await deleteDailyLog(logId);
      if (success) {
        await loadLogs();
        alert('ログを削除しました');
      } else {
        alert('削除に失敗しました');
      }
    }
  };

  const handleDeleteWeekly = async (logId: string, weekStart: string) => {
    if (confirm(`${formatWeekRange(weekStart)}の週次ログを削除しますか？`)) {
      const success = await deleteWeeklyLog(logId);
      if (success) {
        await loadLogs();
        alert('ログを削除しました');
      } else {
        alert('削除に失敗しました');
      }
    }
  };

  const updateEditingTask = (taskId: number, field: 'text' | 'completed', value: string | boolean) => {
    setEditingTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, [field]: value }
          : task
      )
    );
  };

  const addEditingTask = () => {
    const newId = Math.max(...editingTasks.map(t => t.id), 0) + 1;
    setEditingTasks(prev => [...prev, { id: newId, text: '', completed: false }]);
  };

  const removeEditingTask = (taskId: number) => {
    setEditingTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatWeekRange = (weekStart: string) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return `${start.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p className="text-gray-400">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-300 mb-4">ログインが必要です</h1>
          <p className="text-gray-400 mb-6">ログを閲覧するにはログインしてください</p>
          <a
            href="/login"
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            ログインページへ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <BackToHomeButton position="left" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-white">
                タスクログ
              </h1>
              <p className="text-gray-400 text-sm">
                過去の記録を振り返りましょう
              </p>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'daily'
                ? 'bg-sky-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <ClockIcon className="w-4 h-4 mr-2" />
            日次ログ
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'weekly'
                ? 'bg-sky-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <CalendarDaysIcon className="w-4 h-4 mr-2" />
            週次ログ
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 animate-spin rounded-full border-b-2 border-sky-400 mx-auto mb-4"></div>
            <p className="text-gray-400">ログを読み込み中...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">エラー: {error}</p>
          </div>
        )}

        {/* Daily Logs */}
        {activeTab === 'daily' && (
          <div className="space-y-6">
            {dailyLogs.length === 0 ? (
              <div className="text-center py-12">
                <ClockIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  日次ログがありません
                </h3>
                <p className="text-gray-500">
                  日々のタスクを記録して振り返りましょう
                </p>
              </div>
            ) : (
              dailyLogs.map((log) => (
                <div key={log.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {formatDate(log.date)}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">
                        {editingLogId === log.id ? editingTasks.length : log.tasks.length}個のタスク
                      </span>
                      {editingLogId === log.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => saveEditDaily(log.id)}
                            className="p-1 text-green-400 hover:text-green-300 transition-colors"
                            title="保存"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                            title="キャンセル"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditingDaily(log)}
                            className="p-1 text-sky-400 hover:text-sky-300 transition-colors"
                            title="編集"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDaily(log.id, log.date)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            title="削除"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {editingLogId === log.id ? (
                    // 編集モード
                    <div className="space-y-3">
                      {editingTasks.map((task) => (
                        <div key={task.id} className="flex items-center space-x-3">
                          <button
                            onClick={() => updateEditingTask(task.id, 'completed', !task.completed)}
                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                              task.completed
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-600'
                            }`}
                          >
                            {task.completed && <CheckIcon className="w-3 h-3" />}
                          </button>
                          <input
                            type="text"
                            value={task.text}
                            onChange={(e) => updateEditingTask(task.id, 'text', e.target.value)}
                            className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                            placeholder="タスク内容"
                          />
                          <button
                            onClick={() => removeEditingTask(task.id)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            title="削除"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addEditingTask}
                        className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
                      >
                        + タスクを追加
                      </button>
                    </div>
                  ) : (
                    // 表示モード
                    <div className="space-y-2">
                      {log.tasks.map((task) => (
                        <div key={task.id} className="flex items-center space-x-3">
                          <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                            task.completed
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-600'
                          }`}>
                            {task.completed && <CheckIcon className="w-3 h-3" />}
                          </div>
                          <span className={`text-sm ${
                            task.completed
                              ? 'text-gray-300 line-through'
                              : 'text-white'
                          }`}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Weekly Logs */}
        {activeTab === 'weekly' && (
          <div className="space-y-6">
            {weeklyLogs.length === 0 ? (
              <div className="text-center py-12">
                <CalendarDaysIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  週次ログがありません
                </h3>
                <p className="text-gray-500">
                  週間目標を記録して振り返りましょう
                </p>
              </div>
            ) : (
              weeklyLogs.map((log) => (
                <div key={log.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {formatWeekRange(log.week_start)}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">
                        {editingLogId === log.id ? editingTasks.length : log.tasks.focusTasks.length}個のフォーカスタスク
                      </span>
                      {editingLogId === log.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => saveEditWeekly(log.id)}
                            className="p-1 text-green-400 hover:text-green-300 transition-colors"
                            title="保存"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                            title="キャンセル"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditingWeekly(log)}
                            className="p-1 text-sky-400 hover:text-sky-300 transition-colors"
                            title="編集"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteWeekly(log.id, log.week_start)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            title="削除"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {editingLogId === log.id ? (
                    // 編集モード
                    <div className="space-y-4">
                      {/* Weekly Goal */}
                      <div>
                        <h4 className="text-sm font-medium text-sky-400 mb-2">週間目標</h4>
                        <textarea
                          value={editingGoal}
                          onChange={(e) => setEditingGoal(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          rows={3}
                          placeholder="週間目標を入力"
                        />
                      </div>

                      {/* Focus Tasks */}
                      <div>
                        <h4 className="text-sm font-medium text-sky-400 mb-2">フォーカスタスク</h4>
                        <div className="space-y-2">
                          {editingTasks.map((task) => (
                            <div key={task.id} className="flex items-center space-x-3">
                              <button
                                onClick={() => updateEditingTask(task.id, 'completed', !task.completed)}
                                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  task.completed
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-gray-600'
                                }`}
                              >
                                {task.completed && <CheckIcon className="w-3 h-3" />}
                              </button>
                              <input
                                type="text"
                                value={task.text}
                                onChange={(e) => updateEditingTask(task.id, 'text', e.target.value)}
                                className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                placeholder="タスク内容"
                              />
                              <button
                                onClick={() => removeEditingTask(task.id)}
                                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                title="削除"
                              >
                                <TrashIcon className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={addEditingTask}
                            className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
                          >
                            + タスクを追加
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // 表示モード
                    <div>
                      {/* Weekly Goal */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-sky-400 mb-2">週間目標</h4>
                        <p className="text-gray-300 bg-gray-700/30 rounded-lg p-3">
                          {log.tasks.goal}
                        </p>
                      </div>

                      {/* Focus Tasks */}
                      {log.tasks.focusTasks.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-sky-400 mb-2">フォーカスタスク</h4>
                          <div className="space-y-2">
                            {log.tasks.focusTasks.map((task) => (
                              <div key={task.id} className="flex items-center space-x-3">
                                <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  task.completed
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-gray-600'
                                }`}>
                                  {task.completed && <CheckIcon className="w-3 h-3" />}
                                </div>
                                <span className={`text-sm ${
                                  task.completed
                                    ? 'text-gray-300 line-through'
                                    : 'text-white'
                                }`}>
                                  {task.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}