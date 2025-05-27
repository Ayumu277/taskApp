'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '@/lib/storage';
import BackToHomeButton from '@/components/BackToHomeButton';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// Type definition for an individual hour task
export interface HourTask {
  id: string;
  task: string;
  before: string;
  after: string;
  createdAt: string; // ISO string for date and time
  isShared: boolean; // NEW FIELD
}

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
  }, [getStorageKey]);

  // Effect to save tasks to storage whenever the tasks array changes
  useEffect(() => {
    if (currentDateKey) {
      setItem(currentDateKey, tasks);
    }
  }, [tasks, currentDateKey]);

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
                時間ビュー
        </h1>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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