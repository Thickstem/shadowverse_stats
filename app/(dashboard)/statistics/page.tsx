"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, BarChart3, PieChart } from "lucide-react";
import { trpc } from "@/lib/trpc/client";

export default function StatisticsPage() {
  const { data: overview } = trpc.statistics.getOverview.useQuery();
  const { data: deckStats } = trpc.statistics.getDeckStats.useQuery();
  const { data: matchupStats } = trpc.statistics.getMatchupStats.useQuery();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">統計・分析</h2>
        <p className="text-muted-foreground">詳細な戦績データと分析結果</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総対戦数</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totalBattles || 0}</div>
            <p className="text-xs text-muted-foreground">今シーズン</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総合勝率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.winRate ? `${overview.winRate.toFixed(1)}%` : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              {overview?.wins || 0}勝 {overview?.losses || 0}敗
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
              {overview?.mostUsedDeck?.deckArchetype || 'なし'}
            </div>
            <p className="text-xs text-muted-foreground">
              {overview?.mostUsedDeck?.battleCount || 0}対戦
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">現在の連勝</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.currentWinStreak || 0}</div>
            <p className="text-xs text-muted-foreground">連勝</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>デッキ別勝率</CardTitle>
            <CardDescription>各デッキタイプの勝率統計</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deckStats && deckStats.length > 0 ? (
                deckStats.map((deck) => (
                  <div key={deck.deckId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>{deck.deckName}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{deck.winRate.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">
                        {deck.wins}勝 {deck.losses}敗
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  データがありません
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>対戦相手別勝率</CardTitle>
            <CardDescription>相手デッキタイプ別の勝率</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {matchupStats && matchupStats.length > 0 ? (
                matchupStats.map((matchup) => (
                  <div key={matchup.opponentArchetype} className="flex items-center justify-between">
                    <span>vs {matchup.opponentArchetype}</span>
                    <div className="text-right">
                      <div className="font-medium">{matchup.winRate.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">
                        {matchup.wins}勝 {matchup.losses}敗
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  データがありません
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>月別戦績推移</CardTitle>
          <CardDescription>過去6ヶ月の勝率とゲーム数の推移</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            グラフコンポーネント（今後実装予定）
          </div>
        </CardContent>
      </Card>
    </div>
  );
}