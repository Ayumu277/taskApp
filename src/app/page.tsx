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
  todayTask: string;
  focusTasks: string[];
  sessions: { [key: string]: number };
  logs: any[];
}

export default function HomePage() {
  const [todayData, setTodayData] = useState<TodayData>({
    todayTask: '',
    focusTasks: [],
    sessions: {},
    logs: []
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const todayTask = getItem('todayTask', '');
      const focusTasks = getItem('focusTasks', []);
      const sessions = getItem('sessions', {});
      const logs = getItem('logs', []);

      setTodayData({
        todayTask,
        focusTasks,
        sessions,
        logs
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-transparent to-indigo-500/10"></div>

        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-sky-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              <span className="inline-block hover:scale-110 transition-transform duration-300">F</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-75">a</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-150">c</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-225">e</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-300 mx-2"> </span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-375">Y</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-450">o</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-525">u</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-600">r</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-675">s</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-750">e</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-825">l</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-900">f</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
              12週間で人生を加速させる、戦略的タスク管理アプリ。
            </p>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-xl mx-auto">
              目標を年間ではなく12週単位で設計。集中・実行・達成のループで、最高の自分を更新し続ける。
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Cards Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Top Row - Daily and Weekly (Large Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Today's Tasks - Enhanced with localStorage data */}
          <div className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 hover:rotate-1 animate-fade-in-up min-h-[400px]">
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
                  {/* Today's Goal */}
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">✅</span>
                      <span className="text-sm font-medium text-gray-300">今日の目標</span>
                    </div>
                    <p className="text-white text-sm">
                      {todayData.todayTask || '未設定'}
                    </p>
                  </div>

                  {/* Focus Tasks */}
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">📋</span>
                      <span className="text-sm font-medium text-gray-300">フォーカスタスク</span>
                    </div>
                    {todayData.focusTasks.length > 0 ? (
                      <ul className="space-y-1">
                        {todayData.focusTasks.slice(0, 3).map((task, index) => (
                          <li key={index} className="text-white text-sm">
                            • {task}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm">まだタスクがありません</p>
                    )}
                  </div>

                  {/* Session Progress */}
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <div className="flex items-center mb-3">
                      <span className="text-lg mr-2">🕒</span>
                      <span className="text-sm font-medium text-gray-300">セッション進捗</span>
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((sessionNum) => (
                        <div key={sessionNum} className="flex items-center space-x-3">
                          <span className="text-xs text-gray-400 w-16">Session {sessionNum}</span>
                          <div className="flex-1 bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${todayData.sessions[`session${sessionNum}`] || 0}%`
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400 w-8">
                            {todayData.sessions[`session${sessionNum}`] || 0}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time Logs */}
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">⏱</span>
                      <span className="text-sm font-medium text-gray-300">時間ログ</span>
                    </div>
                    <p className="text-white text-sm">
                      {todayData.logs.length > 0
                        ? `${todayData.logs.length}件のログ`
                        : '記録なし'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          {/* Weekly Goals */}
          <Link
            href="/week"
            className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 hover:rotate-1 animate-fade-in-up min-h-[400px]"
            style={{ animationDelay: '100ms' }}
          >
            <div className="p-8 h-full flex flex-col justify-center">
              <div className="inline-flex p-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 mb-6 group-hover:scale-110 transition-transform duration-300 w-fit">
                <CalendarDaysIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                週間目標
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                週単位で目標を設定し、実行スコアで振り返り
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
          </Link>
        </div>

        {/* Other Cards - 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 12-Week Goals */}
          <Link
            href="/dashboard"
            className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/20 hover:rotate-1 animate-fade-in-up h-64"
            style={{ animationDelay: '200ms' }}
          >
            <div className="p-6 h-full flex flex-col justify-center">
              <div className="inline-flex p-3 rounded-lg bg-gradient-to-r from-sky-500 to-blue-500 mb-4 group-hover:scale-110 transition-transform duration-300 w-fit">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-400 transition-colors duration-300">
                12週間目標
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed text-sm">
                四半期ごとの戦略的目標を設定し、カンバンボードで進捗管理
              </p>
              <div className="mt-auto">
                <span className="text-xs font-medium text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  ダッシュボードを開く →
                </span>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
          </Link>

          {/* Navigation Cards */}
          {navigationCards.map((card, index) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/20 hover:rotate-1 animate-fade-in-up h-64"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <div className="p-6 h-full flex flex-col justify-center">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${card.gradient} mb-4 group-hover:scale-110 transition-transform duration-300 w-fit`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-sky-400 transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                  {card.description}
                </p>

                <div className="mt-4 flex items-center text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-medium">詳細を見る</span>
                  <div className="inline-flex h-3 w-3 items-center justify-center ml-1.5">
                    <svg className="h-2.5 w-2.5 transform group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            </Link>
          ))}
        </div>

        {/* Weekly Review Link */}
        <div className="mt-6">
          <Link
            href="/review"
            className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 hover:rotate-1 animate-fade-in-up block"
            style={{ animationDelay: '700ms' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
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
                <div className="flex items-center text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-medium">レビューを開く</span>
                  <div className="inline-flex h-3 w-3 items-center justify-center ml-1.5">
                    <svg className="h-2.5 w-2.5 transform group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>

      {/* Footer CTA Section */}
      <div className="bg-gray-800/30 border-t border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
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
              <div className="inline-flex h-4 w-4 items-center justify-center ml-2">
                <ChartBarIcon className="h-3.5 w-3.5 text-white flex-shrink-0 max-w-none" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
