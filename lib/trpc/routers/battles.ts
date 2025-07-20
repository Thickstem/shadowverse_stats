import { z } from 'zod';
import { router, protectedProcedure } from '../server';
import { battles, decks } from '@/lib/db/schema';
import { eq, and, desc, sql, count, avg } from 'drizzle-orm';

export const battlesRouter = router({
  // Get all user's battles with pagination
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().uuid().optional(),
        deckId: z.string().uuid().optional(),
        result: z.enum(['win', 'loss', 'draw']).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(battles.userId, ctx.user.id)];
      
      if (input.deckId) {
        conditions.push(eq(battles.playerDeckId, input.deckId));
      }
      
      if (input.result) {
        conditions.push(eq(battles.result, input.result));
      }

      if (input.cursor) {
        conditions.push(sql`${battles.id} < ${input.cursor}`);
      }

      const userBattles = await ctx.db
        .select({
          id: battles.id,
          playerDeckId: battles.playerDeckId,
          opponentArchetype: battles.opponentArchetype,
          result: battles.result,
          turnCount: battles.turnCount,
          damageDealt: battles.damageDealt,
          damageReceived: battles.damageReceived,
          playedAt: battles.playedAt,
          deckName: decks.name,
          deckArchetype: decks.archetype,
        })
        .from(battles)
        .leftJoin(decks, eq(battles.playerDeckId, decks.id))
        .where(and(...conditions))
        .orderBy(desc(battles.playedAt))
        .limit(input.limit + 1);

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (userBattles.length > input.limit) {
        const nextItem = userBattles.pop();
        nextCursor = nextItem!.id;
      }

      return {
        battles: userBattles,
        nextCursor,
      };
    }),

  // Get single battle
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const battle = await ctx.db
        .select({
          id: battles.id,
          playerDeckId: battles.playerDeckId,
          opponentArchetype: battles.opponentArchetype,
          result: battles.result,
          turnCount: battles.turnCount,
          damageDealt: battles.damageDealt,
          damageReceived: battles.damageReceived,
          playedAt: battles.playedAt,
          deckName: decks.name,
          deckArchetype: decks.archetype,
        })
        .from(battles)
        .leftJoin(decks, eq(battles.playerDeckId, decks.id))
        .where(and(eq(battles.id, input.id), eq(battles.userId, ctx.user.id)))
        .limit(1);

      if (battle.length === 0) {
        throw new Error('Battle not found');
      }

      return battle[0];
    }),

  // Create new battle
  create: protectedProcedure
    .input(
      z.object({
        playerDeckId: z.string().uuid(),
        opponentArchetype: z.string().min(1, 'Opponent archetype is required'),
        result: z.enum(['win', 'loss', 'draw']),
        turnCount: z.number().int().min(1).optional(),
        damageDealt: z.number().int().min(0).optional(),
        damageReceived: z.number().int().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify deck belongs to user
      const deck = await ctx.db.query.decks.findFirst({
        where: and(eq(decks.id, input.playerDeckId), eq(decks.userId, ctx.user.id)),
      });

      if (!deck) {
        throw new Error('Deck not found');
      }

      const [battle] = await ctx.db
        .insert(battles)
        .values({
          userId: ctx.user.id,
          playerDeckId: input.playerDeckId,
          opponentArchetype: input.opponentArchetype,
          result: input.result,
          turnCount: input.turnCount,
          damageDealt: input.damageDealt,
          damageReceived: input.damageReceived,
        })
        .returning();

      return battle;
    }),

  // Update battle
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        opponentArchetype: z.string().min(1).optional(),
        result: z.enum(['win', 'loss', 'draw']).optional(),
        turnCount: z.number().int().min(1).optional(),
        damageDealt: z.number().int().min(0).optional(),
        damageReceived: z.number().int().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updatedBattle] = await ctx.db
        .update(battles)
        .set(input)
        .where(and(eq(battles.id, input.id), eq(battles.userId, ctx.user.id)))
        .returning();

      if (!updatedBattle) {
        throw new Error('Battle not found');
      }

      return updatedBattle;
    }),

  // Delete battle
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const deletedBattle = await ctx.db
        .delete(battles)
        .where(and(eq(battles.id, input.id), eq(battles.userId, ctx.user.id)))
        .returning();

      if (deletedBattle.length === 0) {
        throw new Error('Battle not found');
      }

      return { success: true };
    }),

  // Get battle statistics
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const totalStats = await ctx.db
      .select({
        totalBattles: count(),
        wins: sql<number>`count(case when ${battles.result} = 'win' then 1 end)`,
        losses: sql<number>`count(case when ${battles.result} = 'loss' then 1 end)`,
        draws: sql<number>`count(case when ${battles.result} = 'draw' then 1 end)`,
        avgTurns: avg(battles.turnCount),
      })
      .from(battles)
      .where(eq(battles.userId, ctx.user.id));

    const stats = totalStats[0];
    const winRate = stats.totalBattles > 0 ? (stats.wins / stats.totalBattles) * 100 : 0;

    return {
      ...stats,
      winRate,
    };
  }),

  // Get recent battles for dashboard
  getRecent: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(10).default(5) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          id: battles.id,
          result: battles.result,
          opponentArchetype: battles.opponentArchetype,
          playedAt: battles.playedAt,
          deckName: decks.name,
          deckArchetype: decks.archetype,
        })
        .from(battles)
        .leftJoin(decks, eq(battles.playerDeckId, decks.id))
        .where(eq(battles.userId, ctx.user.id))
        .orderBy(desc(battles.playedAt))
        .limit(input.limit);
    }),
});