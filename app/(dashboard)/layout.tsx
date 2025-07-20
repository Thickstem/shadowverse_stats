import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">
                シャドウバース EVOLVE 戦績管理
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                ダッシュボード
              </Link>
              <Link href="/dashboard/battles" className="text-gray-700 hover:text-gray-900">
                対戦記録
              </Link>
              <Link href="/dashboard/decks" className="text-gray-700 hover:text-gray-900">
                デッキ管理
              </Link>
              <Link href="/dashboard/statistics" className="text-gray-700 hover:text-gray-900">
                統計
              </Link>
              <Link href="/dashboard/insights" className="text-gray-700 hover:text-gray-900">
                AIインサイト
              </Link>
              <UserButton />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}