// src/app/page.tsx
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
  RssIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { getItem } from '@/lib/storage'

const navigationCards = [
  {
    title: '年間ビュー',
    description: '年間の目標と進捗を追跡',
    href: '/year',
    icon: CalendarIcon,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    title: 'フィード',
    description: '活動履歴とアップデート',
    href: '/feed',
    icon: RssIcon,
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    title: 'ダッシュボード',
    description: '統計と分析データ',
    href: '/dashboard',
    icon: ChartBarIcon,
    gradient: 'from-sky-500 to-blue-500'
  },
  {
    title: '時間ビュー',
    description: '時間単位の詳細管理',
    href: '/hour',
    icon: ClockIcon,
    gradient: 'from-orange-500 to-red-500'
  }
]

interface TodayData {
  todayTask: string
  focusTasks: { id: number; text: string; completed: boolean }[]
  sessions: { id: number; label: string; value: number }[]
  logs: any[]
  yearGoal: string
  weekGoal: string
}

export default function HomePage() {
  const [todayData, setTodayData] = useState<TodayData>({
    todayTask: '',
    focusTasks: [],
    sessions: [],
    logs: [],
    yearGoal: '',
    weekGoal: ''
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      const goalKey = `dayGoal:${dateStr}`;
      const focusKey = `dayFocus:${dateStr}`;
      const progressKey = `dayProgress:${dateStr}`;
      const hourKey = `hourTasks:${dateStr}`;

      // Get current week key for week goal
      const now = new Date();
      const year = now.getFullYear();
      const getISOWeek = (date: Date): number => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
      };
      const week = getISOWeek(now);
      const weekGoalKey = `weekGoal:${year}-W${week.toString().padStart(2, '0')}`;

      const todayTask = getItem(goalKey, '')
      const focusTasks = getItem(focusKey, [])
      const sessions = getItem(progressKey, [])
      const logs = getItem(hourKey, [])

      // Get 12-week goal from current span
      const spans = getItem('spans', []) as any[]
      const currentSpan = spans.find((span: any) => span.id === 'SPAN1') || spans[0]
      const spanGoals = currentSpan ? getItem(`spanGoals:${currentSpan.key}`, []) as any[] : []
      const yearGoal = spanGoals.length > 0 ? spanGoals[0].title : ''

      const weekGoal = getItem(weekGoalKey, '')
      setTodayData({ todayTask, focusTasks, sessions, logs, yearGoal, weekGoal })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-transparent to-indigo-500/10" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Face Yourself
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
              12週間で人生を加速させる、戦略的タスク管理アプリ。
            </p>
            <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-xl mx-auto">
              目標を年間ではなく12週単位で設計。集中・実行・達成のループで、最高の自分を更新し続ける。
            </p>
          </div>
        </div>
      </div>

      {/* Top Row — 今日のタスク & 目標カード */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 今日のタスク */}
          <div className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 min-h-[400px]">
            <Link href="/day" className="block h-full">
              <div className="p-8 h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="inline-flex p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 group-hover:scale-110 transition-transform duration-300 w-fit mr-4">
                    <ClockIcon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                    今日のタスク
                  </h3>
                </div>
                <div className="flex-1 space-y-4">
                  {/* 今日の目標 */}
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">✅</span>
                      <span className="text-sm font-medium text-gray-300">
                        今日の目標
                      </span>
                    </div>
                    <p className="text-white text-sm">
                      {todayData.todayTask || '未設定'}
                    </p>
                  </div>
                  {/* フォーカスタスク */}
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">📋</span>
                      <span className="text-sm font-medium text-gray-300">
                        フォーカスタスク
                      </span>
                    </div>
                    {todayData.focusTasks.length > 0 ? (
                      <ul className="space-y-1">
                        {todayData.focusTasks.slice(0, 4).map((task, i) => (
                          task.text.trim() && (
                            <li key={i} className="text-white text-sm">
                              • {task.text} {task.completed && '✓'}
                            </li>
                          )
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        まだタスクがありません
                      </p>
                    )}
                  </div>
                  {/* セッション進捗 */}
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <div className="flex items-center mb-3">
                      <span className="text-lg mr-2">🕒</span>
                      <span className="text-sm font-medium text-gray-300">
                        セッション進捗
                      </span>
                    </div>
                    <div className="space-y-2">
                      {todayData.sessions.map((session, index) => {
                        const relatedTask = todayData.focusTasks.find(task => task.id === session.id);
                        const taskName = relatedTask?.text || `フォーカスタスク ${session.id}`;
                        return (
                          <div key={session.id} className="flex items-center space-x-3">
                            <span className="text-xs text-gray-400 w-16 truncate">
                              {taskName}
                            </span>
                            <div className="flex-1 bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${session.value}%`
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 w-8">
                              {session.value}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* 時間ログ */}
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">⏱</span>
                      <span className="text-sm font-medium text-gray-300">
                        時間ログ
                      </span>
                    </div>
                    <p className="text-white text-sm">
                      {todayData.logs.length > 0
                        ? `${todayData.logs.length}件のログ`
                        : '記録なし'}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
          </div>

          {/* 右側の目標カード（2段） */}
          <div className="flex flex-col gap-4 min-h-[400px]">
            {/* 12週間目標 */}
            <Link
              href="/dashboard"
              className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/20 flex-1 block"
            >
              <div className="p-6 h-full flex flex-col justify-center">
                <div className="inline-flex p-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-500 mb-3 group-hover:scale-110 transition-transform duration-300 w-fit">
                  <ChartBarIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-400 transition-colors duration-300">
                  12週間目標
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-sm mb-2 line-clamp-3">
                  {todayData.yearGoal || '12週間目標がまだ設定されていません'}
                </p>
                <p className="text-gray-500 text-xs">
                  クリックして目標を設定・編集
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
            </Link>

            {/* 週間目標 */}
            <Link
              href="/week"
              className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 flex-1 block"
            >
              <div className="p-6 h-full flex flex-col justify-center">
                <div className="inline-flex p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 mb-3 group-hover:scale-110 transition-transform duration-300 w-fit">
                  <CalendarDaysIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                  週間目標
                </h3>
                <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {todayData.weekGoal ? (
                    <p className="text-sm leading-relaxed line-clamp-3 mb-2">
                      {todayData.weekGoal}
                    </p>
                  ) : (
                    <p className="text-sm leading-relaxed mb-2">
                      今週の目標がまだ設定されていません
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    クリックして目標を設定・編集
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
            </Link>
          </div>
        </div>

        {/* その他のカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* その他ナビゲーション */}
          {navigationCards.map((card, index) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/20 h-64"
            >
              <div className="p-6 h-full flex flex-col justify-center">
                <div
                  className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${card.gradient} mb-4 group-hover:scale-110 transition-transform duration-300 w-fit`}
                >
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-sky-400 transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                  {card.description}
                </p>
                <span className="mt-4 flex items-center text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-medium">
                  詳細を見る →
                </span>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
            </Link>
          ))}
        </div>

        {/* 週次レビュー */}
        <div className="mt-6">
          <Link
            href="/review"
            className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="inline-flex p-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:scale-110 transition-transform duration-300">
                  <DocumentTextIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">
                    週次レビュー
                  </h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    週ごとの振り返りと学びを記録
                  </p>
                </div>
              </div>
              <div className="flex items-center text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-1 text-xs font-medium">
                <span>レビューを開く</span>
                <svg className="h-3 w-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
          </Link>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-800/30 border-t border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
            今すぐ生産性を向上させましょう
          </h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto text-sm sm:text-base">
            Face Yourselfで目標達成への道のりを明確にし、毎日の進歩を実感してください。
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-500/25 text-sm sm:text-base"
          >
            ダッシュボードを開く
            <ChartBarIcon className="ml-2 h-3.5 w-3.5 text-white flex-shrink-0 max-w-none" />
          </Link>
        </div>
      </div>
    </div>
  )
}
