"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TrendingUp, Trophy, Calendar, Target } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

export default function Dashboard() {
  const { data: stats } = trpc.statistics.getDashboard.useQuery();
  const { data: recentBattles } = trpc.battles.getRecent.useQuery({ limit: 5 });

  const getResultBadge = (result: string) => {
    const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
    switch (result) {
      case 'win':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'loss':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'draw':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'win':
        return '勝利';
      case 'loss':
        return '敗北';
      case 'draw':
        return '引き分け';
      default:
        return result;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">ダッシュボード</h2>
        <p className="text-muted-foreground">あなたの戦績概要とパフォーマンス</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総合勝率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.winRate ? `${stats.winRate.toFixed(1)}%` : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.wins || 0}勝 {stats?.losses || 0}敗
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今月の対戦数</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.monthlyBattles || 0}</div>
            <p className="text-xs text-muted-foreground">
              勝率 {stats?.monthlyWinRate ? `${stats.monthlyWinRate.toFixed(1)}%` : '0%'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">現在の連勝</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.currentWinStreak || 0}</div>
            <p className="text-xs text-muted-foreground">
              最新の連勝記録
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">最多使用デッキ</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.mostUsedDeck?.deckArchetype || 'なし'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.mostUsedDeck?.battleCount || 0}回使用
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>最近の対戦</CardTitle>
            <CardDescription>直近の対戦結果</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBattles && recentBattles.length > 0 ? (
                recentBattles.map((battle) => (
                  <div key={battle.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {battle.deckArchetype || 'デッキ'} vs {battle.opponentArchetype}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {battle.playedAt && formatDistanceToNow(new Date(battle.playedAt), { 
                          addSuffix: true, 
                          locale: ja 
                        })}
                      </p>
                    </div>
                    <span className={getResultBadge(battle.result)}>
                      {getResultText(battle.result)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  まだ対戦記録がありません
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
            <CardDescription>よく使う機能へのショートカット</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/dashboard/battles/new">
                新しい対戦を記録
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/statistics">
                統計を確認
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/decks">
                デッキ管理
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}