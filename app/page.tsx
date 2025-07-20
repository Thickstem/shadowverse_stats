import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          シャドウバース EVOLVE 戦績管理
        </h1>
        <p className="text-center text-lg text-gray-600 mb-8">
          対戦記録・統計分析Webアプリケーション
        </p>
        
        <div className="flex flex-col items-center space-y-4">
          <SignedOut>
            <SignInButton>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                ログイン
              </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <Link href="/dashboard">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                ダッシュボードへ
              </button>
            </Link>
          </SignedIn>
        </div>
      </div>
    </main>
  );
}