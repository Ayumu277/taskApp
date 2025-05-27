'use client';

import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
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
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-sky-400">Shared Hour Tasks Feed</h1>
        {sharedTasks.length === 0 ? (
          <p className="text-center text-gray-400">No shared tasks yet.</p>
        ) : (
          <div className="space-y-6">
            {sharedTasks.map(task => (
              <div key={task.id} className="bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-sky-300">{task.task}</h2>
                  <span className="text-xs text-gray-500 pt-1">
                    {new Date(task.createdAt).toLocaleString()}
                  </span>
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