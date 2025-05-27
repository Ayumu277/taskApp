'use client';

import React, { useEffect, useState } from 'react';
import BackToHomeButton from '@/components/BackToHomeButton';
import { TrashIcon } from '@heroicons/react/24/outline';

interface HourTask {
  id: string;
  task: string;
  before: string;
  after: string;
  createdAt: string;
  isShared: boolean;
}

const FeedPage: React.FC = () => {
  const [sharedTasks, setSharedTasks] = useState<HourTask[]>([]);

  const loadSharedTasks = () => {
    // Scan all hourTasks:* in localStorage
    const allKeys = Object.keys(localStorage);
    const hourTaskKeys = allKeys.filter(k => k.startsWith('hourTasks:'));
    let allShared: HourTask[] = [];
    hourTaskKeys.forEach(key => {
      try {
        const arr = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(arr)) {
          allShared = allShared.concat(arr.filter((t: any) => t && t.isShared));
        }
      } catch {}
    });
    // Newest first
    allShared.sort((a, b) => (b.createdAt.localeCompare(a.createdAt)));
    setSharedTasks(allShared);
  };

  useEffect(() => {
    loadSharedTasks();
  }, []);

  const deleteTask = (taskId: string) => {
    // Find and remove the task from localStorage
    const allKeys = Object.keys(localStorage);
    const hourTaskKeys = allKeys.filter(k => k.startsWith('hourTasks:'));

    hourTaskKeys.forEach(key => {
      try {
        const arr = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(arr)) {
          const updatedArr = arr.filter((t: any) => t.id !== taskId);
          localStorage.setItem(key, JSON.stringify(updatedArr));
        }
      } catch {}
    });

    // Reload shared tasks
    loadSharedTasks();
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
                フィード
              </h1>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sharedTasks.length === 0 ? (
          <p className="text-center text-gray-400">No shared tasks yet.</p>
        ) : (
          <div className="space-y-6">
            {sharedTasks.map(task => (
              <div key={task.id} className="bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 group">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-sky-300">{task.task}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 pt-1">
                      {new Date(task.createdAt).toLocaleString()}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all duration-200"
                      title="削除"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {task.before && (
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-400">Before:</p>
                    <p className="text-gray-300 whitespace-pre-wrap">{task.before}</p>
                  </div>
                )}
                {task.after && (
                  <div>
                    <p className="text-sm font-medium text-gray-400">After:</p>
                    <p className="text-gray-300 whitespace-pre-wrap">{task.after}</p>
                  </div>
                )}
                {!task.before && !task.after && (
                  <p className="italic text-gray-500">No notes for this task.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;