"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export default function BattlesPage() {
  const { data: battlesData } = trpc.battles.list.useQuery({ limit: 20 });

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">対戦記録</h2>
          <p className="text-muted-foreground">すべての対戦結果を管理・分析</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/battles/new">
            <Plus className="mr-2 h-4 w-4" />
            新しい対戦を記録
          </Link>
        </Button>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          フィルター
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>対戦履歴</CardTitle>
          <CardDescription>最新の対戦記録から表示</CardDescription>
        </CardHeader>
        <CardContent>
          {battlesData && battlesData.battles.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-4 py-2 border-b font-medium text-sm">
                <div>日時</div>
                <div>使用デッキ</div>
                <div>対戦相手</div>
                <div>結果</div>
                <div>ターン数</div>
                <div>操作</div>
              </div>
              
              {battlesData.battles.map((battle) => (
                <div key={battle.id} className="grid grid-cols-6 gap-4 py-3 border-b">
                  <div className="text-sm text-muted-foreground">
                    {battle.playedAt && format(new Date(battle.playedAt), 'MM/dd HH:mm', { locale: ja })}
                  </div>
                  <div>
                    <div className="font-medium">{battle.deckName || 'デッキ'}</div>
                    <div className="text-sm text-muted-foreground">{battle.deckArchetype}</div>
                  </div>
                  <div>{battle.opponentArchetype}</div>
                  <div>
                    <span className={getResultBadge(battle.result)}>
                      {getResultText(battle.result)}
                    </span>
                  </div>
                  <div>{battle.turnCount || '-'}</div>
                  <div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/battles/${battle.id}`}>
                        詳細
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              対戦記録がありません。
              <Link href="/dashboard/battles/new" className="text-primary hover:underline ml-1">
                最初の対戦を記録
              </Link>
              してみましょう。
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}