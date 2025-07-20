import { pgTable, uuid, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const resultEnum = pgEnum('result', ['win', 'loss', 'draw']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  username: text('username').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const decks = pgTable('decks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  name: text('name').notNull(),
  archetype: text('archetype').notNull(),
  leader: text('leader').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const deckCards = pgTable('deck_cards', {
  deckId: uuid('deck_id').references(() => decks.id),
  cardName: text('card_name').notNull(),
  quantity: integer('quantity').notNull(),
  cost: integer('cost').notNull(),
});

export const battles = pgTable('battles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  playerDeckId: uuid('player_deck_id').references(() => decks.id),
  opponentArchetype: text('opponent_archetype').notNull(),
  result: resultEnum('result').notNull(),
  turnCount: integer('turn_count'),
  damageDealt: integer('damage_dealt'),
  damageReceived: integer('damage_received'),
  playedAt: timestamp('played_at').defaultNow(),
});

export const deckArchetypes = pgTable('deck_archetypes', {
  name: text('name').primaryKey(),
  description: text('description'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Deck = typeof decks.$inferSelect;
export type NewDeck = typeof decks.$inferInsert;
export type Battle = typeof battles.$inferSelect;
export type NewBattle = typeof battles.$inferInsert;