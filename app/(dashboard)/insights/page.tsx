import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Target, AlertCircle, Lightbulb } from "lucide-react";

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AIインサイト</h2>
          <p className="text-muted-foreground">AIによる戦績分析と改善提案</p>
        </div>
        <Button>
          <Brain className="mr-2 h-4 w-4" />
          新しい分析を生成
        </Button>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-900">最新のAI分析結果</CardTitle>
          </div>
          <CardDescription className="text-blue-700">
            過去30日間の戦績データに基づく分析（生成日時: 2024-01-20 15:30）
          </CardDescription>
        </CardHeader>
        <CardContent className="text-blue-900">
          <p className="leading-relaxed">
            あなたの戦績を分析した結果、ドラゴンデッキでの勝率が非常に高く（72%）、特にネクロマンサー相手では78.6%の高勝率を維持しています。
            一方、ビショップ相手では45.5%と苦戦傾向にあります。進化タイミングの最適化により、さらなる勝率向上が期待できます。
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-900">強みの分析</CardTitle>
            </div>
            <CardDescription>あなたの戦績での優れている点</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-green-900">ドラゴンデッキの運用</h4>
                <p className="text-sm text-green-700">
                  72%の勝率で安定した結果を残している。特に中盤以降の展開力が優秀。
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-green-900">対ネクロマンサー</h4>
                <p className="text-sm text-green-700">
                  78.6%の高勝率。相手の展開を予測した先手の取り方が的確。
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-green-900">序盤の安定性</h4>
                <p className="text-sm text-green-700">
                  平均ターン数7.8で効率的な勝利を重ねている。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900">改善点の分析</CardTitle>
            </div>
            <CardDescription>改善が期待できる領域</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-medium text-orange-900">対ビショップ戦略</h4>
                <p className="text-sm text-orange-700">
                  45.5%と苦戦中。回復とプレッシャーのバランス見直しが必要。
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-medium text-orange-900">ウィッチデッキの活用</h4>
                <p className="text-sm text-orange-700">
                  55%の勝率に留まる。秘術の発動タイミング最適化で向上の余地あり。
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-medium text-orange-900">長期戦への対応</h4>
                <p className="text-sm text-orange-700">
                  10ターン以上の対戦での勝率が低下傾向。フィニッシャーの見直しを推奨。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-yellow-900">具体的な改善提案</CardTitle>
          </div>
          <CardDescription>AIが推奨する次のステップ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">デッキ構築の提案</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>ビショップ対策として、長期戦を見据えた大型フォロワーの追加</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>ウィッチデッキに土の秘術を活用したコンボパーツの組み込み</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>ドラゴンデッキのフィニッシャー多様化による安定性向上</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">プレイスタイルの提案</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>対ビショップ戦では序盤からの積極的なダメージレースを意識</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>ウィッチデッキ使用時は土の印の管理により注意を払う</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>進化権の使用タイミングをより計画的に行う</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-purple-900">目標設定の提案</CardTitle>
          </div>
          <CardDescription>次の30日間で目指すべき目標</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">70%</div>
              <div className="text-sm text-purple-700">総合勝率目標</div>
              <div className="text-xs text-muted-foreground mt-1">現在: 65.2%</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">55%</div>
              <div className="text-sm text-purple-700">対ビショップ勝率</div>
              <div className="text-xs text-muted-foreground mt-1">現在: 45.5%</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">65%</div>
              <div className="text-sm text-purple-700">ウィッチデッキ勝率</div>
              <div className="text-xs text-muted-foreground mt-1">現在: 55.0%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}