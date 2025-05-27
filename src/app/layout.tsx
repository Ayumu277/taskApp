import './globals.css'
import { StagewiseToolbar } from '@stagewise/toolbar-next'

export const metadata = {
  title: 'TaskApp – 生産性追跡アプリ',
  description: '年間目標から時間単位のタスクまで、あらゆるレベルで生産性を追跡・管理する究極のタスク管理アプリ',
}

const stagewiseConfig = {
  plugins: []
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-900 text-white antialiased">
        {children}
        {process.env.NODE_ENV === 'development' && (
          <StagewiseToolbar config={stagewiseConfig} />
        )}
      </body>
    </html>
  )
}