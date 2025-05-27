'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OnboardingVision() {
  const [vision, setVision] = useState('')
  const router = useRouter()

  const handleNext = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vision', JSON.stringify(vision))
    }
    router.push('/onboarding/outcome')
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 bg-gray-700 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full w-1/3"></div>
        </div>
        <span className="text-sm text-gray-400">1 / 3</span>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          あなたのビジョンは？
        </h1>
        <p className="text-gray-300 text-lg">
          理想の未来を描いてください。どんな人生を送りたいですか？
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div>
          <label htmlFor="vision" className="block text-sm font-medium text-gray-300 mb-2">
            あなたのビジョン
          </label>
          <textarea
            id="vision"
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            maxLength={200}
            rows={6}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-white placeholder-gray-400"
            placeholder="例: 健康で充実した毎日を送り、家族と過ごす時間を大切にしながら、自分の夢を実現したい..."
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">
              あなたの理想の未来を自由に表現してください
            </span>
            <span className="text-xs text-gray-400">
              {vision.length}/200
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={handleNext}
            disabled={!vision.trim()}
            className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            次へ進む
          </button>
          <button
            onClick={handleSkip}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            後でスキップ
          </button>
        </div>
      </div>

      {/* Skip Link */}
      <div className="text-center">
        <Link
          href="/dashboard"
          className="text-gray-400 hover:text-gray-300 text-sm underline"
        >
          今はスキップして、ダッシュボードへ
        </Link>
      </div>
    </div>
  )
}