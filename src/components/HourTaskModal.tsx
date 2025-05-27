'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export interface HourTask {
  id: string
  task: string
  before: string
  after: string
  createdAt: string
  isShared: boolean
}

interface HourTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: HourTask) => void
}

export default function HourTaskModal({ isOpen, onClose, onSave }: HourTaskModalProps) {
  const [taskName, setTaskName] = useState('')
  const [beforeNote, setBeforeNote] = useState('')
  const [afterNote, setAfterNote] = useState('')
  const [isShared, setIsShared] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskName.trim()) return

    const newTask: HourTask = {
      id: crypto.randomUUID(),
      task: taskName.trim(),
      before: beforeNote.trim(),
      after: afterNote.trim(),
      createdAt: new Date().toISOString(),
      isShared,
    }

    onSave(newTask)
    handleClose()
  }

  const handleClose = () => {
    setTaskName('')
    setBeforeNote('')
    setAfterNote('')
    setIsShared(false)
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
        <div className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              時間タスクログを追加
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="taskName" className="block text-sm font-medium text-gray-300 mb-2">
                タスク名 *
              </label>
              <input
                id="taskName"
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="何に取り組みますか？"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="beforeNote" className="block text-sm font-medium text-gray-300 mb-2">
                開始前のメモ
              </label>
              <textarea
                id="beforeNote"
                value={beforeNote}
                onChange={(e) => setBeforeNote(e.target.value)}
                placeholder="開始前の気持ちや考えを記録..."
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400 resize-none"
              />
            </div>

            <div>
              <label htmlFor="afterNote" className="block text-sm font-medium text-gray-300 mb-2">
                完了後のメモ
              </label>
              <textarea
                id="afterNote"
                value={afterNote}
                onChange={(e) => setAfterNote(e.target.value)}
                placeholder="完了後の気持ちや学びを記録..."
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400 resize-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="isShared"
                type="checkbox"
                checked={isShared}
                onChange={(e) => setIsShared(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="isShared" className="text-sm text-gray-300 select-none">
                フレンドと共有する
              </label>
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
                disabled={!taskName.trim()}
                className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                タスクログを追加
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}