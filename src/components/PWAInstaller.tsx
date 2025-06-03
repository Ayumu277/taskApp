'use client'

import { useEffect, useState } from 'react'
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Service Worker の登録
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration)

          // Service Worker の更新をチェック
          registration.addEventListener('updatefound', () => {
            console.log('Service Worker update found')
          })
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })

      // 既存のService Workerがある場合はリロード
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed')
      })
    } else {
      console.log('Service Worker is not supported in this browser')
    }

    // PWA インストールプロンプトの処理
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    // PWA がインストール済みかチェック
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    })

    checkIfInstalled()

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // 24時間後に再表示
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // 既にインストール済みまたは24時間以内に却下された場合は表示しない
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000

      if (now - dismissedTime < twentyFourHours) {
        setShowInstallPrompt(false)
      }
    }
  }, [])

  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <ArrowDownTrayIcon className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">アプリをインストール</h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-300 mb-4">
          Face Yourselfをホーム画面に追加して、より快適にご利用いただけます。
        </p>

        <div className="flex space-x-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
          >
            インストール
          </button>
          <button
            onClick={handleDismiss}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium py-2 px-3 rounded transition-colors"
          >
            後で
          </button>
        </div>
      </div>
    </div>
  )
}