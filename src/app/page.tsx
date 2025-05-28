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
  DocumentTextIcon,
  UserIcon,
  Cog6ToothIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { getItem, setItem } from '@/lib/storage'
import { useAuth } from '@/hooks/useAuth'
import LogoutButton from '@/components/LogoutButton'

const navigationCards = [
  {
    title: '12週間目標',
    description: '12週間スパンの目標管理',
    href: '/dashboard',
    icon: ChartBarIcon,
    gradient: 'from-sky-500 to-blue-500'
  },
  {
    title: '年間ビュー',
    description: '年間の目標と進捗を追跡',
    href: '/year',
    icon: CalendarIcon,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    title: 'タスクログ',
    description: '過去の記録を振り返り',
    href: '/logs',
    icon: DocumentTextIcon,
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    title: 'フィード',
    description: '活動履歴とアップデート',
    href: '/feed',
    icon: RssIcon,
    gradient: 'from-indigo-500 to-purple-500'
  }
]

interface TodayData {
  todayTask: string
  focusTasks: { id: number; text: string; completed: boolean }[]
  sessions: { id: number; label: string; value: number }[]
  logs: any[]
  yearGoal: string
  weekGoal: string
  // Timer data
  timerMode: 'work' | 'break'
  timerRunning: boolean
  timerMinutes: number
  timerSeconds: number
  currentTaskName: string
  currentBeforeNote: string
}

export default function HomePage() {
  const [todayData, setTodayData] = useState<TodayData>({
    todayTask: '',
    focusTasks: [],
    sessions: [],
    logs: [],
    yearGoal: '',
    weekGoal: '',
    // Timer data
    timerMode: 'work',
    timerRunning: false,
    timerMinutes: 0,
    timerSeconds: 0,
    currentTaskName: '',
    currentBeforeNote: ''
  })
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, loading, isAuthenticated } = useAuth()

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

      // Load timer data
      const timerState = getItem('pomodoroTimer', {
        mode: 'work',
        isRunning: false,
        minutes: 25,
        seconds: 0,
        workMinutes: 25,
        breakMinutes: 5
      })
      const currentTask = getItem('currentTask', {
        name: '',
        beforeNote: ''
      })

      setTodayData({
        todayTask,
        focusTasks,
        sessions,
        logs,
        yearGoal,
        weekGoal,
        timerMode: (timerState.mode === 'break' ? 'break' : 'work') as 'work' | 'break',
        timerRunning: timerState.isRunning,
        timerMinutes: timerState.minutes,
        timerSeconds: timerState.seconds,
        currentTaskName: currentTask.name,
        currentBeforeNote: currentTask.beforeNote
      })
    }
  }, [])

  // Real-time timer update
  useEffect(() => {
    const updateTimerData = () => {
      if (typeof window !== 'undefined') {
        const timerState = getItem('pomodoroTimer', {
          mode: 'work',
          isRunning: false,
          minutes: 25,
          seconds: 0,
          workMinutes: 25,
          breakMinutes: 5
        })
        const currentTask = getItem('currentTask', {
          name: '',
          beforeNote: ''
        })

        // If timer is running, decrement time
        if (timerState.isRunning && (timerState.minutes > 0 || timerState.seconds > 0)) {
          let newMinutes = timerState.minutes
          let newSeconds = timerState.seconds

          if (newSeconds > 0) {
            newSeconds--
          } else if (newMinutes > 0) {
            newMinutes--
            newSeconds = 59
          }

          // Update localStorage with new time
          const updatedTimer = {
            ...timerState,
            minutes: newMinutes,
            seconds: newSeconds
          }
          setItem('pomodoroTimer', updatedTimer)

          // If timer reaches 0, handle completion
          if (newMinutes === 0 && newSeconds === 0) {
            const completedTimer = {
              ...updatedTimer,
              isRunning: false,
              mode: timerState.mode === 'work' ? 'break' : 'work',
              minutes: timerState.mode === 'work' ? (timerState.breakMinutes || 5) : (timerState.workMinutes || 25),
              seconds: 0
            }
            setItem('pomodoroTimer', completedTimer)
          }
        }

        setTodayData(prev => ({
          ...prev,
          timerMode: (timerState.mode === 'break' ? 'break' : 'work') as 'work' | 'break',
          timerRunning: timerState.isRunning,
          timerMinutes: timerState.minutes,
          timerSeconds: timerState.seconds,
          currentTaskName: currentTask.name,
          currentBeforeNote: currentTask.beforeNote
        }))
      }
    }

    // Update immediately
    updateTimerData()

    // Set up interval for real-time updates
    const interval = setInterval(updateTimerData, 1000)

    return () => clearInterval(interval)
  }, [])

  // Timer control functions
  const startTimer = () => {
    const currentTimer = getItem('pomodoroTimer', {
      mode: 'work',
      isRunning: false,
      minutes: 25,
      seconds: 0,
      workMinutes: 25,
      breakMinutes: 5
    })
    setItem('pomodoroTimer', { ...currentTimer, isRunning: true })
  }

  const pauseTimer = () => {
    const currentTimer = getItem('pomodoroTimer', {
      mode: 'work',
      isRunning: false,
      minutes: 25,
      seconds: 0,
      workMinutes: 25,
      breakMinutes: 5
    })
    setItem('pomodoroTimer', { ...currentTimer, isRunning: false })
  }

  const resetTimer = () => {
    const currentTimer = getItem('pomodoroTimer', {
      mode: 'work',
      isRunning: false,
      minutes: 25,
      seconds: 0,
      workMinutes: 25,
      breakMinutes: 5
    })
    const resetMinutes = currentTimer.mode === 'work' ? (currentTimer.workMinutes || 25) : (currentTimer.breakMinutes || 5)
    setItem('pomodoroTimer', {
      ...currentTimer,
      isRunning: false,
      minutes: resetMinutes,
      seconds: 0
    })
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-transparent to-indigo-500/10" />

        {/* Header with User Menu */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex justify-end">
            {loading ? (
              <div className="w-8 h-8 animate-spin rounded-full border-b-2 border-sky-400"></div>
            ) : isAuthenticated ? (
              /* Authenticated User Menu */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 rounded-lg px-3 py-2 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-sm font-medium hidden sm:block">
                    {user?.email?.split('@')[0] || 'ユーザー'}
                  </span>
                  <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm text-gray-300 truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Cog6ToothIcon className="w-4 h-4 mr-3" />
                        設定
                      </Link>
                      <div className="px-4 py-2">
                        <LogoutButton
                          variant="text"
                          size="sm"
                          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          showIcon={true}
                        >
                          ログアウト
                        </LogoutButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated User Buttons */
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="bg-gray-800/50 hover:bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  ログイン
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  新規登録
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
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
            {/* 時間ビュー */}
            <div
              onClick={() => window.location.href = '/hour'}
              className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 flex-1 cursor-pointer"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="inline-flex p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 group-hover:scale-110 transition-transform duration-300 w-fit mr-3">
                    <ClockIcon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
                    時間ログ
                  </h3>
                </div>

                <div className="flex-1 space-y-4">
                  {/* メインタイマー表示 */}
                  <div className="relative bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 border border-gray-600/30">
                    {/* タイマー状態インジケーター */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${todayData.timerRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                        <span className={`text-sm font-medium ${todayData.timerMode === 'work' ? 'text-orange-400' : 'text-green-400'}`}>
                          {todayData.timerMode === 'work' ? '🍅 作業中' : '☕ 休憩中'}
                        </span>
                      </div>
                      {todayData.timerRunning && (
                        <span className="text-xs text-gray-400 animate-pulse">実行中</span>
                      )}
                    </div>

                    {/* 大きなタイマー表示 */}
                    <div className="text-center">
                      <div className={`text-3xl font-mono font-bold mb-2 ${todayData.timerMode === 'work' ? 'text-orange-400' : 'text-green-400'} ${todayData.timerRunning ? 'animate-pulse' : ''}`}>
                        {String(todayData.timerMinutes).padStart(2, '0')}:{String(todayData.timerSeconds).padStart(2, '0')}
                      </div>

                      {/* プログレスバー */}
                      {todayData.timerRunning && (
                        <div className="w-full bg-gray-600 rounded-full h-1.5 mb-2">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-1000 ${todayData.timerMode === 'work' ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}
                            style={{
                              width: `${Math.max(0, Math.min(100, ((todayData.timerMode === 'work' ? 25 : 5) * 60 - (todayData.timerMinutes * 60 + todayData.timerSeconds)) / ((todayData.timerMode === 'work' ? 25 : 5) * 60) * 100))}%`
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* タイマーコントロールボタン */}
                    <div className="flex justify-center space-x-2 mt-3">
                      {!todayData.timerRunning ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            startTimer()
                          }}
                          className="flex items-center px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md font-medium transition-colors"
                        >
                          ▶ 開始
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            pauseTimer()
                          }}
                          className="flex items-center px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded-md font-medium transition-colors"
                        >
                          ⏸ 停止
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          resetTimer()
                        }}
                        className="flex items-center px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded-md font-medium transition-colors"
                      >
                        ⏹ リセット
                      </button>
                    </div>
                  </div>

                  {/* 現在のタスクと開始前メモ */}
                  <div className="grid grid-cols-1 gap-3">
                    {/* 現在のタスク */}
                    <div className="bg-gray-700/30 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <span className="text-base mr-2">📝</span>
                        <span className="text-sm font-medium text-gray-300">現在のタスク</span>
                      </div>
                      <p className="text-white text-sm font-medium break-words">
                        {todayData.currentTaskName || 'タスクが設定されていません'}
                      </p>
                    </div>

                    {/* 開始前メモ */}
                    {todayData.currentBeforeNote && (
                      <div className="bg-gray-700/30 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <span className="text-base mr-2">💭</span>
                          <span className="text-sm font-medium text-gray-300">開始前メモ</span>
                        </div>
                        <p className="text-gray-300 text-sm break-words line-clamp-3">
                          {todayData.currentBeforeNote}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700/50">
                  <span className="text-gray-500 text-xs">
                    詳細ページへ →
                  </span>
                </div>
              </div>

              {/* ホバーエフェクト */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />

              {/* 実行中の場合のグロー効果 */}
              {todayData.timerRunning && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 animate-pulse pointer-events-none rounded-xl" />
              )}
            </div>

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
