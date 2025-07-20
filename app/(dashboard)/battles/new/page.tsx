"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { battleSchema, type BattleFormData } from "@/lib/validations/battle";
import { DECK_ARCHETYPES, RESULT_OPTIONS } from "@/lib/constants/decks";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

export default function NewBattlePage() {
  const router = useRouter();
  
  const { data: decks } = trpc.decks.list.useQuery();
  const createBattleMutation = trpc.battles.create.useMutation({
    onSuccess: () => {
      router.push('/dashboard/battles');
    },
    onError: (error) => {
      console.error('Error creating battle:', error);
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BattleFormData>({
    resolver: zodResolver(battleSchema),
  });

  const onSubmit = async (data: BattleFormData) => {
    try {
      const selectedDeck = decks?.find(deck => deck.name === data.playerDeckName);
      if (!selectedDeck) {
        throw new Error('Selected deck not found');
      }

      await createBattleMutation.mutateAsync({
        playerDeckId: selectedDeck.id,
        opponentArchetype: data.opponentArchetype,
        result: data.result,
        turnCount: data.turnCount,
        damageDealt: data.damageDealt,
        damageReceived: data.damageReceived,
      });
    } catch (error) {
      console.error("Error submitting battle:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/battles">
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">新しい対戦を記録</h2>
          <p className="text-muted-foreground">対戦結果を入力してください</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>対戦情報</CardTitle>
          <CardDescription>必要な情報を入力して対戦記録を保存します</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="playerDeckName">使用デッキ名</Label>
                <Input
                  id="playerDeckName"
                  placeholder="例: 進化ドラゴン"
                  {...register("playerDeckName")}
                />
                {errors.playerDeckName && (
                  <p className="text-sm text-destructive">{errors.playerDeckName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>使用アーキタイプ</Label>
                <Controller
                  name="playerArchetype"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="アーキタイプを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {DECK_ARCHETYPES.map((archetype) => (
                          <SelectItem key={archetype} value={archetype}>
                            {archetype}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.playerArchetype && (
                  <p className="text-sm text-destructive">{errors.playerArchetype.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>対戦相手のアーキタイプ</Label>
                <Controller
                  name="opponentArchetype"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="相手のアーキタイプを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {DECK_ARCHETYPES.map((archetype) => (
                          <SelectItem key={archetype} value={archetype}>
                            {archetype}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.opponentArchetype && (
                  <p className="text-sm text-destructive">{errors.opponentArchetype.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>勝敗</Label>
                <Controller
                  name="result"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="勝敗を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {RESULT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.result && (
                  <p className="text-sm text-destructive">{errors.result.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="turnCount">ターン数（任意）</Label>
                <Input
                  id="turnCount"
                  type="number"
                  min="1"
                  placeholder="7"
                  {...register("turnCount", { valueAsNumber: true })}
                />
                {errors.turnCount && (
                  <p className="text-sm text-destructive">{errors.turnCount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="damageDealt">与えたダメージ（任意）</Label>
                <Input
                  id="damageDealt"
                  type="number"
                  min="0"
                  placeholder="20"
                  {...register("damageDealt", { valueAsNumber: true })}
                />
                {errors.damageDealt && (
                  <p className="text-sm text-destructive">{errors.damageDealt.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="damageReceived">受けたダメージ（任意）</Label>
                <Input
                  id="damageReceived"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register("damageReceived", { valueAsNumber: true })}
                />
                {errors.damageReceived && (
                  <p className="text-sm text-destructive">{errors.damageReceived.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">メモ（任意）</Label>
              <Input
                id="notes"
                placeholder="対戦中の気づきやコメント"
                {...register("notes")}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "保存中..." : "対戦記録を保存"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/battles">キャンセル</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}