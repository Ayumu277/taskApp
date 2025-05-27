'use client';

import { useState, useEffect } from 'react';
import { getItem, setItem } from '@/lib/storage'; // Assuming @ is configured for src

const YEAR_GOAL_KEY = 'yearGoal';

// Helper function to get ISO week number
const getISOWeek = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
};

const getCurrentWeekKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const week = getISOWeek(now);
  return `weekGoal:${year}-W${week.toString().padStart(2, '0')}`;
};

export default function WeeklyGoalPage() {
  const [currentWeekGoal, setCurrentWeekGoal] = useState<string>('');
  const [yearGoal, setYearGoal] = useState<string>('');
  const [weekKey, setWeekKey] = useState<string>('');

  useEffect(() => {
    const currentKey = getCurrentWeekKey();
    setWeekKey(currentKey);

    // Load the 12-week year goal
    const savedYearGoal = getItem<string>(YEAR_GOAL_KEY, '');
    setYearGoal(savedYearGoal);

    // Load the current week's goal
    const savedWeekGoal = getItem<string>(currentKey, '');
    setCurrentWeekGoal(savedWeekGoal);
  }, []);

  const handleSaveWeekGoal = () => {
    if (weekKey) {
      setItem<string>(weekKey, currentWeekGoal);
      alert('Weekly goal saved!');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">
        My Goal for Week: {weekKey.split(':')[1]}
      </h1>

      <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-600 mb-2">Current 12-Week Goal (Read-only):</h2>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">
          {yearGoal || 'No 12-week goal set yet.'}
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="weeklyGoalInput" className="block text-sm font-medium text-gray-700 mb-1">
          Enter your goal for this week:
        </label>
        <textarea
          id="weeklyGoalInput"
          value={currentWeekGoal}
          onChange={(e) => setCurrentWeekGoal(e.target.value)}
          rows={6}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="My main objective for this week is..."
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveWeekGoal}
          className="px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Weekly Goal
        </button>
      </div>
    </div>
  );
}