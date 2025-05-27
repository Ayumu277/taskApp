'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '@/lib/storage'; // Assuming lib is aliased as @/lib

// Type definition for an individual hour task
export interface HourTask {
  id: string;
  task: string;
  before: string;
  after: string;
  createdAt: string; // ISO string for date and time
}

const HourPage: React.FC = () => {
  const [taskName, setTaskName] = useState<string>('');
  const [beforeNote, setBeforeNote] = useState<string>('');
  const [afterNote, setAfterNote] = useState<string>('');
  const [tasks, setTasks] = useState<HourTask[]>([]);
  const [currentDateKey, setCurrentDateKey] = useState<string>('');

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
    if (!taskName.trim()) return; // Basic validation

    const newTask: HourTask = {
      id: crypto.randomUUID(),
      task: taskName.trim(),
      before: beforeNote.trim(),
      after: afterNote.trim(),
      createdAt: new Date().toISOString(),
    };

    setTasks(prevTasks => [newTask, ...prevTasks]); // Add new task to the beginning of the array

    // Clear input fields
    setTaskName('');
    setBeforeNote('');
    setAfterNote('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-sky-400">
          Hourly Task Log ({new Date().toLocaleDateString()})
        </h1>

        {/* Task Input Form */}
        <form onSubmit={handleSubmit} className="mb-10 p-6 bg-gray-800 rounded-xl shadow-lg space-y-4">
          <div>
            <label htmlFor="taskName" className="block text-lg font-semibold mb-1 text-sky-300">Task Name</label>
            <input
              id="taskName"
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What are you working on?"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="beforeNote" className="block text-lg font-semibold mb-1 text-sky-300">Before Note</label>
            <textarea
              id="beforeNote"
              value={beforeNote}
              onChange={(e) => setBeforeNote(e.target.value)}
              placeholder="Thoughts or feelings before starting..."
              rows={3}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="afterNote" className="block text-lg font-semibold mb-1 text-sky-300">After Note</label>
            <textarea
              id="afterNote"
              value={afterNote}
              onChange={(e) => setAfterNote(e.target.value)}
              placeholder="Thoughts or feelings after completing..."
              rows={3}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-md transition-colors duration-150 ease-in-out"
          >
            Add Task Log
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-6">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-400">No tasks logged for today yet.</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-sky-300">{task.task}</h2>
                  <span className="text-xs text-gray-500 pt-1">
                    {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HourPage;