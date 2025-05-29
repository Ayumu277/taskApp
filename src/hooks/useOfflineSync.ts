'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline'

interface OfflineData {
  id: string
  type: 'daily_log' | 'weekly_log' | 'task' | 'goal'
  data: any
  timestamp: number
  userId?: string
}

export function useOfflineSync() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')
  const [isOnline, setIsOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)

  // オンライン状態の監視
  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)
      if (online && syncStatus === 'offline') {
        setSyncStatus('idle')
        syncPendingData()
      } else if (!online) {
        setSyncStatus('offline')
      }
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    updateOnlineStatus()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [syncStatus])

  // 保留中のデータ数を更新
  useEffect(() => {
    updatePendingCount()
  }, [])

  const updatePendingCount = () => {
    try {
      const pending = localStorage.getItem('offline_pending_data')
      if (pending) {
        const data: OfflineData[] = JSON.parse(pending)
        setPendingCount(data.length)
      } else {
        setPendingCount(0)
      }
    } catch (error) {
      console.error('Error reading pending data:', error)
      setPendingCount(0)
    }
  }

  // オフラインデータの保存
  const saveOfflineData = useCallback((type: OfflineData['type'], data: any, userId?: string) => {
    try {
      const offlineData: OfflineData = {
        id: crypto.randomUUID(),
        type,
        data,
        timestamp: Date.now(),
        userId
      }

      const existing = localStorage.getItem('offline_pending_data')
      const pendingData: OfflineData[] = existing ? JSON.parse(existing) : []
      pendingData.push(offlineData)

      localStorage.setItem('offline_pending_data', JSON.stringify(pendingData))
      updatePendingCount()

      if (isOnline) {
        syncPendingData()
      }
    } catch (error) {
      console.error('Error saving offline data:', error)
    }
  }, [isOnline])

  // 保留中のデータを同期
  const syncPendingData = useCallback(async () => {
    if (!isOnline) return

    try {
      setSyncStatus('syncing')

      const pending = localStorage.getItem('offline_pending_data')
      if (!pending) {
        setSyncStatus('synced')
        return
      }

      const pendingData: OfflineData[] = JSON.parse(pending)
      if (pendingData.length === 0) {
        setSyncStatus('synced')
        return
      }

      const syncedIds: string[] = []

      for (const item of pendingData) {
        try {
          let success = false

          switch (item.type) {
            case 'daily_log':
              const { error: dailyError } = await supabase
                .from('daily_logs')
                .upsert({
                  user_id: item.userId,
                  date: item.data.date,
                  tasks: item.data.tasks,
                  updated_at: new Date().toISOString()
                })
              success = !dailyError
              break

            case 'weekly_log':
              const { error: weeklyError } = await supabase
                .from('weekly_logs')
                .upsert({
                  user_id: item.userId,
                  week_start: item.data.week_start,
                  tasks: item.data.tasks,
                  updated_at: new Date().toISOString()
                })
              success = !weeklyError
              break

            default:
              // その他のタイプは後で実装
              success = true
              break
          }

          if (success) {
            syncedIds.push(item.id)
          }
        } catch (error) {
          console.error(`Error syncing item ${item.id}:`, error)
        }
      }

      // 同期済みのアイテムを削除
      const remainingData = pendingData.filter(item => !syncedIds.includes(item.id))
      localStorage.setItem('offline_pending_data', JSON.stringify(remainingData))
      updatePendingCount()

      setSyncStatus(remainingData.length === 0 ? 'synced' : 'error')

      // 3秒後にステータスをリセット
      setTimeout(() => {
        setSyncStatus('idle')
      }, 3000)

    } catch (error) {
      console.error('Error syncing pending data:', error)
      setSyncStatus('error')
      setTimeout(() => {
        setSyncStatus('idle')
      }, 3000)
    }
  }, [isOnline])

  // 手動同期
  const forcSync = useCallback(() => {
    if (isOnline) {
      syncPendingData()
    }
  }, [isOnline, syncPendingData])

  return {
    syncStatus,
    isOnline,
    pendingCount,
    saveOfflineData,
    syncPendingData,
    forcSync
  }
}