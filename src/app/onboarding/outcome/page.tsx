'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OnboardingOutcome() {
  const [outcome, setOutcome] = useState('')
  const router = useRouter()

  const handleNext = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('outcome12', JSON.stringify(outcome))
    }
    router.push('/onboarding/image')
  }

  const handleBack = () => {
    router.push('/onboarding')
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 bg-gray-700 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full w-2/3"></div>
        </div>
        <span className="text-sm text-gray-400">2 / 3</span>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          12週間後の成果は？
        </h1>
        <p className="text-gray-300 text-lg">
          3ヶ月後、どんな具体的な成果を手に入れていたいですか？
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div>
          <label htmlFor="outcome" className="block text-sm font-medium text-gray-300 mb-2">
            12週間後の目標成果
          </label>
          <textarea
            id="outcome"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            maxLength={120}
            rows={4}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-white placeholder-gray-400"
            placeholder="例: 毎日30分の運動習慣を身につけ、5kg減量して健康的な体型になる"
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">
              測定可能で具体的な成果を書いてください
            </span>
            <span className="text-xs text-gray-400">
              {outcome.length}/120
            </span>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-accent mb-2">💡 効果的な目標のコツ</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• 数値で測定できる具体的な成果</li>
            <li>• 12週間で達成可能な現実的な目標</li>
            <li>• あなたのビジョンに繋がる重要な一歩</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={handleBack}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            戻る
          </button>
          <button
            onClick={handleNext}
            disabled={!outcome.trim()}
            className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            次へ進む
          </button>
          <button
            onClick={handleSkip}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            スキップ
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