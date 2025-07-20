import { z } from "zod";

export const battleSchema = z.object({
  playerDeckName: z.string().min(1, "使用デッキを選択してください"),
  playerArchetype: z.string().min(1, "使用アーキタイプを選択してください"),
  opponentArchetype: z.string().min(1, "対戦相手のアーキタイプを選択してください"),
  result: z.enum(["win", "loss", "draw"], {
    message: "勝敗を選択してください",
  }),
  turnCount: z.number().int().min(1, "ターン数は1以上で入力してください").optional(),
  damageDealt: z.number().int().min(0, "与えたダメージは0以上で入力してください").optional(),
  damageReceived: z.number().int().min(0, "受けたダメージは0以上で入力してください").optional(),
  notes: z.string().optional(),
});

export type BattleFormData = z.infer<typeof battleSchema>;