import { z } from 'zod';
import { router, protectedProcedure } from '../server';
import { decks, deckCards, battles } from '@/lib/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export const decksRouter = router({
  // Get all user's decks
  list: protectedProcedure.query(async ({ ctx }) => {
    const userDecks = await ctx.db
      .select({
        id: decks.id,
        name: decks.name,
        archetype: decks.archetype,
        leader: decks.leader,
        isActive: decks.isActive,
        createdAt: decks.createdAt,
        totalBattles: sql<number>`count(${battles.id})`,
        wins: sql<number>`count(case when ${battles.result} = 'win' then 1 end)`,
        losses: sql<number>`count(case when ${battles.result} = 'loss' then 1 end)`,
        draws: sql<number>`count(case when ${battles.result} = 'draw' then 1 end)`,
      })
      .from(decks)
      .leftJoin(battles, eq(decks.id, battles.playerDeckId))
      .where(eq(decks.userId, ctx.user.id))
      .groupBy(decks.id)
      .orderBy(desc(decks.createdAt));

    return userDecks.map((deck) => ({
      ...deck,
      winRate: deck.totalBattles > 0 ? (deck.wins / deck.totalBattles) * 100 : 0,
    }));
  }),

  // Get single deck with details
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const deck = await ctx.db.query.decks.findFirst({
        where: and(eq(decks.id, input.id), eq(decks.userId, ctx.user.id)),
        with: {
          deckCards: true,
        },
      });

      if (!deck) {
        throw new Error('Deck not found');
      }

      return deck;
    }),

  // Create new deck
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Deck name is required'),
        archetype: z.string().min(1, 'Archetype is required'),
        leader: z.string().min(1, 'Leader is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [deck] = await ctx.db
        .insert(decks)
        .values({
          userId: ctx.user.id,
          name: input.name,
          archetype: input.archetype,
          leader: input.leader,
        })
        .returning();

      return deck;
    }),

  // Update deck
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1, 'Deck name is required').optional(),
        archetype: z.string().min(1, 'Archetype is required').optional(),
        leader: z.string().min(1, 'Leader is required').optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updatedDeck] = await ctx.db
        .update(decks)
        .set(input)
        .where(and(eq(decks.id, input.id), eq(decks.userId, ctx.user.id)))
        .returning();

      if (!updatedDeck) {
        throw new Error('Deck not found');
      }

      return updatedDeck;
    }),

  // Delete deck
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const deletedDeck = await ctx.db
        .delete(decks)
        .where(and(eq(decks.id, input.id), eq(decks.userId, ctx.user.id)))
        .returning();

      if (deletedDeck.length === 0) {
        throw new Error('Deck not found');
      }

      return { success: true };
    }),

  // Get deck statistics
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const stats = await ctx.db
      .select({
        totalDecks: sql<number>`count(*)`,
        activeDecks: sql<number>`count(case when ${decks.isActive} = true then 1 end)`,
      })
      .from(decks)
      .where(eq(decks.userId, ctx.user.id));

    return stats[0];
  }),
});