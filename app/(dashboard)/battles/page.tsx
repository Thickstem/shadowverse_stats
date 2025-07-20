import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";

export default function BattlesPage() {
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
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-4 py-2 border-b font-medium text-sm">
              <div>日時</div>
              <div>使用デッキ</div>
              <div>対戦相手</div>
              <div>結果</div>
              <div>ターン数</div>
              <div>操作</div>
            </div>
            
            <div className="grid grid-cols-6 gap-4 py-3 border-b">
              <div className="text-sm text-muted-foreground">2024-01-20 14:30</div>
              <div>ドラゴン</div>
              <div>ネクロマンサー</div>
              <div>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  勝利
                </span>
              </div>
              <div>7</div>
              <div>
                <Button variant="outline" size="sm">詳細</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-6 gap-4 py-3 border-b">
              <div className="text-sm text-muted-foreground">2024-01-20 13:15</div>
              <div>ドラゴン</div>
              <div>ロイヤル</div>
              <div>
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                  敗北
                </span>
              </div>
              <div>9</div>
              <div>
                <Button variant="outline" size="sm">詳細</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-6 gap-4 py-3 border-b">
              <div className="text-sm text-muted-foreground">2024-01-20 12:00</div>
              <div>ビショップ</div>
              <div>ウィッチ</div>
              <div>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  勝利
                </span>
              </div>
              <div>6</div>
              <div>
                <Button variant="outline" size="sm">詳細</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}