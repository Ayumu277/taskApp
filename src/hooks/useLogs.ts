import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from './useAuth'

export interface TaskLog {
  id: number
  text: string
  completed: boolean
}

export interface DailyLog {
  id: string
  user_id: string
  date: string
  tasks: TaskLog[]
  created_at: string
}

export interface WeeklyLog {
  id: string
  user_id: string
  week_start: string
  tasks: {
    goal: string
    focusTasks: TaskLog[]
  }
  created_at: string
}

export const useLogs = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const saveDailyLog = async (date: string, tasks: TaskLog[]) => {
    if (!user) {
      setError('ユーザーがログインしていません')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('daily_logs')
        .upsert({
          user_id: user.id,
          date,
          tasks,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
      return false
    } finally {
      setLoading(false)
    }
  }

  const saveWeeklyLog = async (weekStart: string, goal: string, focusTasks: TaskLog[]) => {
    if (!user) {
      setError('ユーザーがログインしていません')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('weekly_logs')
        .upsert({
          user_id: user.id,
          week_start: weekStart,
          tasks: {
            goal,
            focusTasks
          },
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
      return false
    } finally {
      setLoading(false)
    }
  }

  const getDailyLogs = async (limit = 30) => {
    if (!user) return []

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data as DailyLog[]
    } catch (err) {
      setError(err instanceof Error ? err.message : '取得に失敗しました')
      return []
    } finally {
      setLoading(false)
    }
  }

  const getWeeklyLogs = async (limit = 12) => {
    if (!user) return []

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('weekly_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('week_start', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data as WeeklyLog[]
    } catch (err) {
      setError(err instanceof Error ? err.message : '取得に失敗しました')
      return []
    } finally {
      setLoading(false)
    }
  }

  const updateDailyLog = async (logId: string, tasks: TaskLog[]) => {
    if (!user) {
      setError('ユーザーがログインしていません')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('daily_logs')
        .update({
          tasks,
          updated_at: new Date().toISOString()
        })
        .eq('id', logId)
        .eq('user_id', user.id)

      if (error) throw error
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました')
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateWeeklyLog = async (logId: string, goal: string, focusTasks: TaskLog[]) => {
    if (!user) {
      setError('ユーザーがログインしていません')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('weekly_logs')
        .update({
          tasks: {
            goal,
            focusTasks
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', logId)
        .eq('user_id', user.id)

      if (error) throw error
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました')
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteDailyLog = async (logId: string) => {
    if (!user) {
      setError('ユーザーがログインしていません')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('daily_logs')
        .delete()
        .eq('id', logId)
        .eq('user_id', user.id)

      if (error) throw error
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました')
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteWeeklyLog = async (logId: string) => {
    if (!user) {
      setError('ユーザーがログインしていません')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('weekly_logs')
        .delete()
        .eq('id', logId)
        .eq('user_id', user.id)

      if (error) throw error
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    saveDailyLog,
    saveWeeklyLog,
    getDailyLogs,
    getWeeklyLogs,
    updateDailyLog,
    updateWeeklyLog,
    deleteDailyLog,
    deleteWeeklyLog
  }
}