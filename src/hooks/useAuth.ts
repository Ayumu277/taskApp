'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if Supabase is configured
    if (!supabase) {
      console.warn('Supabase is not configured. Authentication features will not work.')
      setLoading(false)
      return
    }

    // 現在のセッションを取得
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase!.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Failed to get session:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // 認証状態の変更を監視
    const authListener = supabase!.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => authListener.data.subscription.unsubscribe()
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user && !!supabase
  }
}