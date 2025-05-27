import Link from 'next/link';
import { HomeIcon } from '@heroicons/react/24/outline';

interface BackToHomeButtonProps {
  position?: 'left' | 'right';
}

export default function BackToHomeButton({ position = 'right' }: BackToHomeButtonProps) {
  return (
    <Link
      href="/"
      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 rounded-lg transition-all duration-200 backdrop-blur-sm"
    >
      <HomeIcon className="w-4 h-4 mr-2" />
      ホーム
    </Link>
  );
}