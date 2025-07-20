import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function DecksPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">デッキ管理</h2>
          <p className="text-muted-foreground">使用するデッキを管理・編集</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新しいデッキを追加
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">進化ドラゴン</CardTitle>
                <CardDescription>ドラゴン</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>総対戦数</span>
                <span className="font-medium">52</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>勝率</span>
                <span className="font-medium text-green-600">72.0%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>勝数</span>
                <span className="font-medium">36勝 16敗</span>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  アクティブ
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">秘術ウィッチ</CardTitle>
                <CardDescription>ウィッチ</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>総対戦数</span>
                <span className="font-medium">25</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>勝率</span>
                <span className="font-medium text-yellow-600">60.0%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>勝数</span>
                <span className="font-medium">15勝 10敗</span>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  非アクティブ
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">進化ビショップ</CardTitle>
                <CardDescription>ビショップ</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>総対戦数</span>
                <span className="font-medium">35</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>勝率</span>
                <span className="font-medium text-green-600">68.6%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>勝数</span>
                <span className="font-medium">24勝 11敗</span>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  アクティブ
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>デッキ統計</CardTitle>
          <CardDescription>全デッキの統計情報</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">総デッキ数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">2</div>
              <div className="text-sm text-muted-foreground">アクティブデッキ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">68.8%</div>
              <div className="text-sm text-muted-foreground">平均勝率</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">112</div>
              <div className="text-sm text-muted-foreground">総対戦数</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}