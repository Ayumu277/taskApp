'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OnboardingImage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setSelectedImage(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFinish = () => {
    if (typeof window !== 'undefined' && selectedImage) {
      localStorage.setItem('visionImage', JSON.stringify(selectedImage))
    }
    router.push('/dashboard')
  }

  const handleBack = () => {
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
          <div className="bg-primary h-2 rounded-full w-full"></div>
        </div>
        <span className="text-sm text-gray-400">3 / 3</span>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          モチベーション画像
        </h1>
        <p className="text-gray-300 text-lg">
          あなたのビジョンを表現する画像をアップロードしてください
        </p>
      </div>

      {/* Image Upload Area */}
      <div className="space-y-6">
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            isDragging
              ? 'border-primary bg-primary/10'
              : selectedImage
              ? 'border-accent bg-accent/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {selectedImage ? (
            <div className="space-y-4">
              <img
                src={selectedImage}
                alt="Selected vision"
                className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
              />
              <div className="space-y-2">
                <p className="text-accent font-medium">画像が選択されました！</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-gray-400 hover:text-gray-300 underline"
                >
                  別の画像を選択
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl text-gray-500">📸</div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-300">
                  画像をドラッグ&ドロップ
                </p>
                <p className="text-sm text-gray-400">
                  または
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary hover:text-primary/80 underline ml-1"
                  >
                    ファイルを選択
                  </button>
                </p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* Tips */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-accent mb-2">💡 効果的な画像の選び方</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• あなたのビジョンを視覚的に表現する画像</li>
            <li>• 見るたびにモチベーションが上がる写真</li>
            <li>• 理想の自分や達成したい状態を表すもの</li>
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
            onClick={handleFinish}
            className="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {selectedImage ? '完了してダッシュボードへ' : '画像なしで完了'}
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