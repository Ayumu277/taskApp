'use client'

import { useOfflineSync, SyncStatus } from '@/hooks/useOfflineSync'
import {
  CloudIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  WifiIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline'

interface SyncStatusIndicatorProps {
  className?: string
  showText?: boolean
}

export default function SyncStatusIndicator({
  className = '',
  showText = true
}: SyncStatusIndicatorProps) {
  const { syncStatus, isOnline, pendingCount, forcSync } = useOfflineSync()

  const getStatusConfig = (status: SyncStatus) => {
    switch (status) {
      case 'offline':
        return {
          icon: NoSymbolIcon,
          color: 'text-red-400',
          bgColor: 'bg-red-900/20',
          text: 'オフライン',
          description: `${pendingCount}件のデータが同期待ち`
        }
      case 'syncing':
        return {
          icon: CloudArrowUpIcon,
          color: 'text-blue-400',
          bgColor: 'bg-blue-900/20',
          text: '同期中...',
          description: 'データを同期しています'
        }
      case 'synced':
        return {
          icon: CheckCircleIcon,
          color: 'text-green-400',
          bgColor: 'bg-green-900/20',
          text: '同期済み',
          description: 'すべてのデータが同期されました'
        }
      case 'error':
        return {
          icon: ExclamationTriangleIcon,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-900/20',
          text: '同期エラー',
          description: '同期に失敗しました。再試行してください'
        }
      default:
        return {
          icon: isOnline ? WifiIcon : NoSymbolIcon,
          color: isOnline ? 'text-gray-400' : 'text-red-400',
          bgColor: isOnline ? 'bg-gray-900/20' : 'bg-red-900/20',
          text: isOnline ? 'オンライン' : 'オフライン',
          description: pendingCount > 0 ? `${pendingCount}件のデータが同期待ち` : ''
        }
    }
  }

  const config = getStatusConfig(syncStatus)
  const Icon = config.icon

  const isSyncing = syncStatus === 'syncing'
  const showRetryButton = syncStatus === 'error' || (pendingCount > 0 && isOnline && !isSyncing)

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${config.bgColor} border border-gray-700/50 transition-all duration-200`}
        title={config.description}
      >
        <Icon
          className={`w-4 h-4 ${config.color} ${isSyncing ? 'animate-pulse' : ''}`}
        />
        {showText && (
          <span className={`text-sm font-medium ${config.color}`}>
            {config.text}
          </span>
        )}
        {pendingCount > 0 && !isSyncing && (
          <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
            {pendingCount}
          </span>
        )}
      </div>

      {showRetryButton && (
        <button
          onClick={forcSync}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors duration-200"
          disabled={isSyncing}
        >
          再同期
        </button>
      )}
    </div>
  )
}