'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '@/lib/storage'; // Assuming lib is aliased as @/lib

interface SessionProgress {
  id: number;
  label: string;
  value: number;
}

const DayPage = () => {
  const [todayKey, setTodayKey] = useState('');
  const [dailyGoal, setDailyGoal] = useState<string>('');
  const [sessions, setSessions] = useState<SessionProgress[]>([
    { id: 1, label: 'Session 1', value: 0 },
    { id: 2, label: 'Session 2', value: 0 },
    { id: 3, label: 'Session 3', value: 0 },
    { id: 4, label: 'Session 4', value: 0 },
  ]);

  const [overallCompletion, setOverallCompletion] = useState<number>(0);

  const getFormattedDate = useCallback(() => {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  }, []);

  useEffect(() => {
    const dateStr = getFormattedDate();
    setTodayKey(dateStr);

    const goalKey = `dayGoal:${dateStr}`;
    const progressKey = `dayProgress:${dateStr}`;

    const loadedGoal = getItem<string>(goalKey, '');
    if (loadedGoal) {
      setDailyGoal(loadedGoal);
    }

    const loadedSessions = getItem<SessionProgress[]>(progressKey, []);
    if (loadedSessions && loadedSessions.length === 4) {
      setSessions(loadedSessions);
    } else {
      // Initialize if not found or malformed
      const initialSessions: SessionProgress[] = [
        { id: 1, label: 'Session 1', value: 0 },
        { id: 2, label: 'Session 2', value: 0 },
        { id: 3, label: 'Session 3', value: 0 },
        { id: 4, label: 'Session 4', value: 0 },
      ];
      setSessions(initialSessions);
      setItem(progressKey, initialSessions);
    }
  }, [getFormattedDate]);

  useEffect(() => {
    if (todayKey) {
      const goalKey = `dayGoal:${todayKey}`;
      setItem(goalKey, dailyGoal);
    }
  }, [dailyGoal, todayKey]);

  useEffect(() => {
    if (todayKey) {
      const progressKey = `dayProgress:${todayKey}`;
      setItem(progressKey, sessions);
    }
    // Calculate overall completion
    const totalValue = sessions.reduce((sum, session) => sum + session.value, 0);
    setOverallCompletion(sessions.length > 0 ? totalValue / sessions.length : 0);
  }, [sessions, todayKey]);

  const handleGoalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDailyGoal(event.target.value);
  };

  const handleSliderChange = (sessionId: number, value: number) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === sessionId ? { ...session, value } : session
      )
    );
  };

  if (!todayKey) {
    return <div className="p-4">Loading...</div>; // Or some other loading state
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-sky-400">
          Daily Plan: {todayKey}
        </h1>

        {/* Daily Goal Input */}
        <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-md">
          <label htmlFor="dailyGoal" className="block text-xl font-semibold mb-2 text-sky-300">
            Today's Goal
          </label>
          <input
            type="text"
            id="dailyGoal"
            value={dailyGoal}
            onChange={handleGoalChange}
            placeholder="What's your main goal for today?"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
          />
        </div>

        {/* Session Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {sessions.map((session) => (
            <div key={session.id} className="p-6 bg-gray-800 rounded-lg shadow-md">
              <label htmlFor={`session-${session.id}`} className="block text-lg font-medium mb-3 text-sky-300">
                {session.label} ({session.value}%)
              </label>
              <input
                type="range"
                id={`session-${session.id}`}
                min="0"
                max="100"
                value={session.value}
                onChange={(e) => handleSliderChange(session.id, parseInt(e.target.value, 10))}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>
          ))}
        </div>

        {/* Overall Completion */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold mb-2 text-sky-300">Overall Completion</h2>
          <div className="relative w-32 h-32 mx-auto mb-2">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-700"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3.8"
              />
              <path
                className="text-sky-500 transition-all duration-500 ease-out"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3.8"
                strokeDasharray={`${overallCompletion}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-sky-400">
                {Math.round(overallCompletion)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayPage;