'use client'

import Link from 'next/link'
import {
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
  RssIcon,
  Squares2X2Icon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const navigationCards = [
  {
    title: '年間ビュー',
    description: '年間の目標と進捗を追跡',
    href: '/year',
    icon: CalendarIcon,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    title: '週間ビュー',
    description: '週単位でタスクを管理',
    href: '/week',
    icon: CalendarDaysIcon,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    title: '日間ビュー',
    description: '日々のタスクと習慣',
    href: '/day',
    icon: ClockIcon,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    title: '時間ビュー',
    description: '時間単位の詳細管理',
    href: '/hour',
    icon: ClockIcon,
    gradient: 'from-orange-500 to-red-500'
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
    title: '週次レビュー',
    description: '週ごとの振り返りと学び',
    href: '/review',
    icon: DocumentTextIcon,
    gradient: 'from-emerald-500 to-teal-500'
  }
]

export default function HomePage() {
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
            {/* App Logo/Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl shadow-xl">
                <div className="inline-flex h-8 w-8 items-center justify-center">
                  <Squares2X2Icon className="h-6 w-6 text-white flex-shrink-0 max-w-none" />
                </div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              <span className="inline-block hover:scale-110 transition-transform duration-300">T</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-75">a</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-150">s</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-225">k</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-300">A</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-375">p</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300 delay-450">p</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
              生産性を最大化する究極のタスク管理アプリ
            </p>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-xl mx-auto">
              年間目標から時間単位のタスクまで、あらゆるレベルで生産性を追跡・管理。
              データ駆動型のインサイトで、より効率的な毎日を実現しましょう。
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Cards Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            機能を探索
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            目的に応じて最適なビューを選択してください
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {navigationCards.map((card, index) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/20 hover:rotate-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-r ${card.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="inline-flex h-5 w-5 items-center justify-center">
                    <card.icon className="h-4 w-4 text-white flex-shrink-0 max-w-none" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-sky-400 transition-colors duration-300">
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
      </div>

      {/* Footer CTA Section */}
      <div className="bg-gray-800/30 border-t border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
              今すぐ生産性を向上させましょう
            </h3>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto text-sm sm:text-base">
              TaskAppで目標達成への道のりを明確にし、毎日の進歩を実感してください。
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
