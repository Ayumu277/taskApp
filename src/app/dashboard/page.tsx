'use client';

import React, { useEffect, useState } from 'react';
import DonutChart from '../../components/DonutChart';
import Link from 'next/link';

interface WeekSummary {
  key: string;
  label: string;
  completion: number;
}

// Helper to extract week label from key
function getWeekLabel(key: string) {
  // key format: weekGoal:YYYY-Www
  return key.replace('weekGoal:', '');
}

export default function DashboardPage() {
  const [weeks, setWeeks] = useState<WeekSummary[]>([]);
  const [overall, setOverall] = useState<number>(0);

  useEffect(() => {
    // Get all weekGoal:* keys from localStorage
    const allKeys = Object.keys(localStorage);
    const weekKeys = allKeys.filter((k) => k.startsWith('weekGoal:'));
    // For each week, try to get completion rate from localStorage (e.g. weekCompletion:YYYY-Www)
    const weekSummaries: WeekSummary[] = weekKeys.map((key) => {
      // Try to get completion from weekCompletion:YYYY-Www (number 0-100)
      const label = getWeekLabel(key);
      let completion = 0;
      const completionKey = `weekCompletion:${label}`;
      const stored = localStorage.getItem(completionKey);
      if (stored) {
        try {
          completion = Math.round(Number(JSON.parse(stored)));
        } catch {
          completion = 0;
        }
      }
      return { key, label, completion };
    });
    setWeeks(weekSummaries);
    // Calculate overall average
    if (weekSummaries.length > 0) {
      const avg = weekSummaries.reduce((sum, w) => sum + w.completion, 0) / weekSummaries.length;
      setOverall(Math.round(avg));
    } else {
      setOverall(0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-sky-400">Weekly Dashboard</h1>
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-10 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-sky-300 mb-4">Overall Progress</h2>
          <DonutChart completion={overall} />
        </div>
        <div className="space-y-4">
          {weeks.slice(0, 12).map((week) => (
            <Link
              key={week.key}
              href={`/week?w=${encodeURIComponent(week.label)}`}
              className="block bg-gray-800 rounded-lg shadow-md p-4 flex items-center hover:bg-gray-700 transition-colors"
            >
              <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center">
                <DonutChart completion={week.completion} />
              </div>
              <div className="ml-6 text-xl font-semibold text-sky-200">{week.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}