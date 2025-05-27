'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface WeekScoreModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (score: number) => void
  weekKey: string
}

export default function WeekScoreModal({ isOpen, onClose, onSave, weekKey }: WeekScoreModalProps) {
  const [score, setScore] = useState(50)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(score)
    onClose()
  }

  const handleClose = () => {
    setScore(50)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900/75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              週の実行スコア
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Week Info */}
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-primary font-medium">
              {weekKey.split(':')[1]}の実行スコア
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="weekScore" className="block text-sm font-medium text-gray-300 mb-2">
                今週の実行スコアは何点でしたか？
              </label>

              {/* Score Display */}
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-primary">{score}</span>
                <span className="text-xl text-gray-400 ml-1">/ 100</span>
              </div>

              {/* Slider */}
              <input
                type="range"
                id="weekScore"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />

              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>

            {/* Score Guide */}
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-3">
              <h4 className="text-sm font-medium text-accent mb-2">📊 スコアガイド</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• <strong>90-100:</strong> 完璧な実行、目標を上回った</li>
                <li>• <strong>70-89:</strong> 良好な実行、ほぼ計画通り</li>
                <li>• <strong>50-69:</strong> 普通の実行、改善の余地あり</li>
                <li>• <strong>30-49:</strong> 不十分な実行、見直しが必要</li>
                <li>• <strong>0-29:</strong> 実行できなかった</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                スコアを保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}