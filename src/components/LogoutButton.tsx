'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

interface LogoutButtonProps {
  variant?: 'primary' | 'secondary' | 'text'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
}

export default function LogoutButton({
  variant = 'primary',
  size = 'md',
  className = '',
  showIcon = true,
  children
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)

    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('ログアウトエラー:', error.message)
      } else {
        // ログアウト成功後はログインページにリダイレクト
        router.push('/login')
      }
    } catch (err) {
      console.error('予期しないエラー:', err)
    } finally {
      setLoading(false)
    }
  }

  // バリアントに応じたスタイル
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-red-600 hover:bg-red-700 text-white border-transparent'
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white border-transparent'
      case 'text':
        return 'bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white border-transparent'
      default:
        return 'bg-red-600 hover:bg-red-700 text-white border-transparent'
    }
  }

  // サイズに応じたスタイル
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'md':
        return 'px-4 py-2 text-sm'
      case 'lg':
        return 'px-6 py-3 text-base'
      default:
        return 'px-4 py-2 text-sm'
    }
  }

  // アイコンサイズ
  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4'
      case 'md':
        return 'h-4 w-4'
      case 'lg':
        return 'h-5 w-5'
      default:
        return 'h-4 w-4'
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`
        inline-flex items-center justify-center
        border rounded-lg font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center">
          <div className={`animate-spin rounded-full border-b-2 border-current mr-2 ${getIconSize()}`}></div>
          ログアウト中...
        </div>
      ) : (
        <div className="flex items-center">
          {showIcon && (
            <ArrowRightOnRectangleIcon className={`${getIconSize()} ${children ? 'mr-2' : ''}`} />
          )}
          {children || 'ログアウト'}
        </div>
      )}
    </button>
  )
}