import { Suspense } from 'react'
import LoginForm from '@/components/LoginForm'

// Loading component for Suspense fallback
function LoginLoading() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
            <div className="w-6 h-6 animate-spin rounded-full border-b-2 border-white"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            ログイン
          </h2>
          <p className="text-gray-400">
            読み込み中...
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  )
}