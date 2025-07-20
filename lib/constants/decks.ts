export const DECK_ARCHETYPES = [
  "ロイヤル",
  "ウィッチ", 
  "ドラゴン",
  "ネクロマンサー",
  "ヴァンパイア",
  "ビショップ",
  "ネメシス",
  "エルフ",
] as const;

export const RESULT_OPTIONS = [
  { value: "win", label: "勝利" },
  { value: "loss", label: "敗北" },
  { value: "draw", label: "引き分け" },
] as const;

export type DeckArchetype = typeof DECK_ARCHETYPES[number];
export type BattleResult = typeof RESULT_OPTIONS[number]["value"];