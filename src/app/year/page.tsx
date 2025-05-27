'use client';

import { useState, useEffect } from 'react';
import { getItem, setItem } from '@/lib/storage'; // Assuming @ is configured for src

const YEAR_GOAL_KEY = 'yearGoal';

export default function YearGoalPage() {
  const [goal, setGoal] = useState<string>('');

  useEffect(() => {
    // Load the goal from localStorage when the component mounts
    const savedGoal = getItem<string>(YEAR_GOAL_KEY, '');
    setGoal(savedGoal);
  }, []);

  const handleSave = () => {
    setItem<string>(YEAR_GOAL_KEY, goal);
    alert('Goal saved!'); // Show toast/alert
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        My 12-Week Year Goal
      </h1>
      <div className="mb-6">
        <label htmlFor="yearGoalInput" className="block text-sm font-medium text-gray-700 mb-1">
          Enter your 12-week goal:
        </label>
        <textarea
          id="yearGoalInput"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows={10}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="My primary focus for the next 12 weeks is..."
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Goal
        </button>
      </div>
    </div>
  );
}