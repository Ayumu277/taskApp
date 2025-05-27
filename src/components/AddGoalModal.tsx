'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface AddGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (title: string) => void
  quarterLabel: string
}

export default function AddGoalModal({ isOpen, onClose, onAdd, quarterLabel }: AddGoalModalProps) {
  const [title, setTitle] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title.trim())
      setTitle('')
    }
  }

  const handleClose = () => {
    setTitle('')
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
              新しい目標を追加
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Quarter Info */}
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-primary font-medium">
              {quarterLabel}の目標
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="goalTitle" className="block text-sm font-medium text-gray-300 mb-2">
                目標タイトル
              </label>
              <input
                type="text"
                id="goalTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例: 新しいスキルを習得する"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400"
                maxLength={50}
                required
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  具体的で測定可能な目標を設定しましょう
                </span>
                <span className="text-xs text-gray-400">
                  {title.length}/50
                </span>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-3">
              <h4 className="text-sm font-medium text-accent mb-2">💡 効果的な目標のコツ</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• 具体的で明確な内容にする</li>
                <li>• 3ヶ月で達成可能な範囲に設定</li>
                <li>• 進捗を測定できる要素を含める</li>
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
                disabled={!title.trim()}
                className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                目標を追加
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}