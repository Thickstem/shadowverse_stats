import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, BarChart3, PieChart } from "lucide-react";

export default function StatisticsPage() {
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
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">今シーズン</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総合勝率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65.2%</div>
            <p className="text-xs text-muted-foreground">83勝 44敗</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">最多使用デッキ</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ドラゴン</div>
            <p className="text-xs text-muted-foreground">52対戦 (41%)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均ターン数</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.8</div>
            <p className="text-xs text-muted-foreground">ターン</p>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>ドラゴン</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">72.0%</div>
                  <div className="text-sm text-muted-foreground">36勝 14敗</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>ビショップ</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">68.2%</div>
                  <div className="text-sm text-muted-foreground">23勝 12敗</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span>ウィッチ</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">55.0%</div>
                  <div className="text-sm text-muted-foreground">11勝 9敗</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>ロイヤル</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">50.0%</div>
                  <div className="text-sm text-muted-foreground">8勝 8敗</div>
                </div>
              </div>
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
              <div className="flex items-center justify-between">
                <span>vs ネクロマンサー</span>
                <div className="text-right">
                  <div className="font-medium">78.6%</div>
                  <div className="text-sm text-muted-foreground">11勝 3敗</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span>vs ウィッチ</span>
                <div className="text-right">
                  <div className="font-medium">71.4%</div>
                  <div className="text-sm text-muted-foreground">15勝 6敗</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span>vs ロイヤル</span>
                <div className="text-right">
                  <div className="font-medium">62.5%</div>
                  <div className="text-sm text-muted-foreground">20勝 12敗</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span>vs ドラゴン</span>
                <div className="text-right">
                  <div className="font-medium">58.3%</div>
                  <div className="text-sm text-muted-foreground">14勝 10敗</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span>vs ビショップ</span>
                <div className="text-right">
                  <div className="font-medium">45.5%</div>
                  <div className="text-sm text-muted-foreground">10勝 12敗</div>
                </div>
              </div>
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