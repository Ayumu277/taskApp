'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getItem, setItem } from '@/lib/storage';
import BackToHomeButton from '@/components/BackToHomeButton';
import { PencilIcon, TrashIcon, PlayIcon, PauseIcon, StopIcon, ClockIcon } from '@heroicons/react/24/outline';

// Type definition for an individual hour task
export interface HourTask {
  id: string;
  task: string;
  before: string;
  after: string;
  createdAt: string; // ISO string for date and time
  isShared: boolean; // NEW FIELD
}

type TimerMode = 'work' | 'break';

const HourPage: React.FC = () => {
  const [taskName, setTaskName] = useState<string>('');
  const [beforeNote, setBeforeNote] = useState<string>('');
  const [afterNote, setAfterNote] = useState<string>('');
  const [tasks, setTasks] = useState<HourTask[]>([]);
  const [currentDateKey, setCurrentDateKey] = useState<string>('');
  const [isShared, setIsShared] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTaskName, setEditTaskName] = useState<string>('');
  const [editBeforeNote, setEditBeforeNote] = useState<string>('');
  const [editAfterNote, setEditAfterNote] = useState<string>('');

  // Timer states
  const [workMinutes, setWorkMinutes] = useState<number>(25);
  const [breakMinutes, setBreakMinutes] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // in seconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [cycles, setCycles] = useState<number>(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Function to get the storage key for the current date
  const getStorageKey = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `hourTasks:${today}`;
  }, []);

  // Effect to set the current date key and load tasks from storage on mount
  useEffect(() => {
    const key = getStorageKey();
    setCurrentDateKey(key);
    const loadedTasks = getItem<HourTask[]>(key, []);
    if (loadedTasks && Array.isArray(loadedTasks)) {
      setTasks(loadedTasks);
    }

    // Load timer state from localStorage
    const savedTimer = getItem('pomodoroTimer', {
      mode: 'work',
      isRunning: false,
      minutes: 25,
      seconds: 0,
      workMinutes: 25,
      breakMinutes: 5,
      cycles: 0
    });

    setMode(savedTimer.mode as TimerMode);
    setIsRunning(savedTimer.isRunning);
    setTimeLeft(savedTimer.minutes * 60 + savedTimer.seconds);
    setWorkMinutes(savedTimer.workMinutes);
    setBreakMinutes(savedTimer.breakMinutes);
    setCycles(savedTimer.cycles || 0);

    // Load current task info
    const savedTask = getItem('currentTask', {
      name: '',
      beforeNote: ''
    });
    setTaskName(savedTask.name);
    setBeforeNote(savedTask.beforeNote);

    // Initialize audio for notifications
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    }
  }, [getStorageKey]);

  // Effect to save tasks to storage whenever the tasks array changes
  useEffect(() => {
    if (currentDateKey) {
      setItem(currentDateKey, tasks);
    }
  }, [tasks, currentDateKey]);

  // Save timer state to localStorage
  useEffect(() => {
    const timerState = {
      mode,
      isRunning,
      minutes: Math.floor(timeLeft / 60),
      seconds: timeLeft % 60,
      workMinutes,
      breakMinutes,
      cycles
    };
    setItem('pomodoroTimer', timerState);
  }, [mode, isRunning, timeLeft, workMinutes, breakMinutes, cycles]);

  // Save current task info to localStorage
  useEffect(() => {
    const currentTask = {
      name: taskName,
      beforeNote: beforeNote
    };
    setItem('currentTask', currentTask);
  }, [taskName, beforeNote]);

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      handleTimerComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);

    // Play notification sound
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(
        mode === 'work' ? '作業時間終了！' : '休憩時間終了！',
        {
          body: mode === 'work' ? '休憩時間を開始しましょう' : '作業を再開しましょう',
          icon: '/favicon.ico'
        }
      );
    }

    // Switch mode
    if (mode === 'work') {
      setMode('break');
      setTimeLeft(breakMinutes * 60);
      setCycles(prev => prev + 1);
    } else {
      setMode('work');
      setTimeLeft(workMinutes * 60);
    }
  };

  const startTimer = () => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? workMinutes * 60 : breakMinutes * 60);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'work' ? workMinutes * 60 : breakMinutes * 60);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleWorkMinutesChange = (minutes: number) => {
    setWorkMinutes(minutes);
    if (mode === 'work' && !isRunning) {
      setTimeLeft(minutes * 60);
    }
  };

  const handleBreakMinutesChange = (minutes: number) => {
    setBreakMinutes(minutes);
    if (mode === 'break' && !isRunning) {
      setTimeLeft(minutes * 60);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!taskName.trim()) return;
    const newTask: HourTask = {
      id: crypto.randomUUID(),
      task: taskName.trim(),
      before: beforeNote.trim(),
      after: afterNote.trim(),
      createdAt: new Date().toISOString(),
      isShared, // NEW FIELD
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setTaskName('');
    setBeforeNote('');
    setAfterNote('');
    setIsShared(false); // Reset after submit
  };

  const deleteTask = (taskId: string) => {
    if (confirm('このタスクログを削除しますか？')) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    }
  };

  const startEditing = (task: HourTask) => {
    setEditingTask(task.id);
    setEditTaskName(task.task);
    setEditBeforeNote(task.before);
    setEditAfterNote(task.after);
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditTaskName('');
    setEditBeforeNote('');
    setEditAfterNote('');
  };

  const saveEdit = () => {
    if (editingTask && editTaskName.trim()) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === editingTask
            ? { ...task, task: editTaskName.trim(), before: editBeforeNote.trim(), after: editAfterNote.trim() }
            : task
        )
      );
      cancelEditing();
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
                時間ログ
        </h1>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pomodoro Timer Section */}
        <div className="mb-10 p-6 bg-gray-800 rounded-xl shadow-lg">
          <div className="flex items-center mb-6">
            <ClockIcon className="w-6 h-6 text-sky-400 mr-2" />
            <h2 className="text-2xl font-bold text-sky-300">ポモドーロタイマー</h2>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-6">
            <div className={`text-6xl font-mono font-bold mb-2 ${mode === 'work' ? 'text-sky-400' : 'text-green-400'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={() => switchMode('work')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  mode === 'work'
                    ? 'bg-sky-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                作業時間
              </button>
              <button
                onClick={() => switchMode('break')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  mode === 'break'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                休憩時間
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              {mode === 'work' ? '集中して作業しましょう' : 'リラックスして休憩しましょう'} | 完了サイクル: {cycles}
            </p>
          </div>

          {/* Timer Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            {!isRunning ? (
              <button
                onClick={startTimer}
                className="flex items-center px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors"
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                開始
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
              >
                <PauseIcon className="w-5 h-5 mr-2" />
                一時停止
              </button>
            )}
            <button
              onClick={resetTimer}
              className="flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              <StopIcon className="w-5 h-5 mr-2" />
              リセット
            </button>
          </div>

          {/* Timer Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                作業時間 (分)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={workMinutes}
                onChange={(e) => handleWorkMinutesChange(parseInt(e.target.value) || 25)}
                disabled={isRunning}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors text-white disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                休憩時間 (分)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={breakMinutes}
                onChange={(e) => handleBreakMinutesChange(parseInt(e.target.value) || 5)}
                disabled={isRunning}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-white disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Task Input Form */}
        <form onSubmit={handleSubmit} className="mb-10 p-6 bg-gray-800 rounded-xl shadow-lg space-y-4">
          <div>
            <label htmlFor="taskName" className="block text-lg font-semibold mb-1 text-sky-300">タスク名</label>
            <input
              id="taskName"
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="何に取り組んでいますか？"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="beforeNote" className="block text-lg font-semibold mb-1 text-sky-300">開始前メモ</label>
            <textarea
              id="beforeNote"
              value={beforeNote}
              onChange={(e) => setBeforeNote(e.target.value)}
              placeholder="開始前の気持ちや考えを記録..."
              rows={3}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="afterNote" className="block text-lg font-semibold mb-1 text-sky-300">完了後メモ</label>
            <textarea
              id="afterNote"
              value={afterNote}
              onChange={(e) => setAfterNote(e.target.value)}
              placeholder="完了後の気持ちや学びを記録..."
              rows={3}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="isShared"
              type="checkbox"
              checked={isShared}
              onChange={e => setIsShared(e.target.checked)}
              className="h-5 w-5 text-sky-500 focus:ring-sky-500 border-gray-600 rounded"
            />
            <label htmlFor="isShared" className="text-sky-300 text-lg font-medium select-none">
              フィードで共有
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-md transition-colors duration-150 ease-in-out"
          >
            タスクログを追加
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-6">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-400">今日はまだタスクログがありません。</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 group">
                {editingTask === task.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">タスク名</label>
                      <input
                        type="text"
                        value={editTaskName}
                        onChange={(e) => setEditTaskName(e.target.value)}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">開始前メモ</label>
                      <textarea
                        value={editBeforeNote}
                        onChange={(e) => setEditBeforeNote(e.target.value)}
                        rows={2}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">完了後メモ</label>
                      <textarea
                        value={editAfterNote}
                        onChange={(e) => setEditAfterNote(e.target.value)}
                        rows={2}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors text-white"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={cancelEditing}
                        className="px-3 py-1 text-gray-400 hover:text-white transition-colors"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded transition-colors"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-sky-300">{task.task}</h2>
                      <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 pt-1">
                    {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                          <button
                            onClick={() => startEditing(task)}
                            className="p-1 text-gray-400 hover:text-sky-300 transition-colors"
                            title="編集"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                            title="削除"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                </div>
                {task.before && (
                  <div className="mb-2">
                        <p className="text-sm font-medium text-gray-400">開始前:</p>
                    <p className="text-gray-300 whitespace-pre-wrap">{task.before}</p>
                  </div>
                )}
                {task.after && (
                  <div>
                        <p className="text-sm font-medium text-gray-400">完了後:</p>
                    <p className="text-gray-300 whitespace-pre-wrap">{task.after}</p>
                  </div>
                )}
                {!task.before && !task.after && (
                      <p className="italic text-gray-500">このタスクにはメモがありません。</p>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HourPage;