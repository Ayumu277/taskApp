import './globals.css'
import { StagewiseToolbar } from '@stagewise/toolbar-next'

export const metadata = {
  title: 'Face Yourself',
  description:
    '年間目標から時間単位のタスクまで、あらゆるレベルで生産性を追跡・管理する究極のタスク管理アプリ',
  icons: {
    icon: '/face-yourself-logo.png',
    apple: '/face-yourself-logo.png',
  },
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Face Yourself',
  },
}

const stagewiseConfig = {
  plugins: [],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Face Yourself" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/face-yourself-logo.png" />
      </head>
      <body className="bg-gray-900 text-white antialiased">
        {children}
        {process.env.NODE_ENV === 'development' && (
          <StagewiseToolbar config={stagewiseConfig} />
        )}
      </body>
    </html>
  )
}
