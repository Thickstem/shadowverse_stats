import { z } from 'zod';
import { router, protectedProcedure } from '../server';
import { battles, decks } from '@/lib/db/schema';
import { eq, and, desc, sql, count } from 'drizzle-orm';

export const statisticsRouter = router({
  // Get overall statistics
  getOverview: protectedProcedure.query(async ({ ctx }) => {
    // Total battles and win rate
    const totalStats = await ctx.db
      .select({
        totalBattles: count(),
        wins: sql<number>`count(case when ${battles.result} = 'win' then 1 end)`,
        losses: sql<number>`count(case when ${battles.result} = 'loss' then 1 end)`,
        draws: sql<number>`count(case when ${battles.result} = 'draw' then 1 end)`,
      })
      .from(battles)
      .where(eq(battles.userId, ctx.user.id));

    const stats = totalStats[0];
    const winRate = stats.totalBattles > 0 ? (stats.wins / stats.totalBattles) * 100 : 0;

    // Most used deck
    const mostUsedDeck = await ctx.db
      .select({
        deckName: decks.name,
        deckArchetype: decks.archetype,
        battleCount: count(),
      })
      .from(battles)
      .leftJoin(decks, eq(battles.playerDeckId, decks.id))
      .where(eq(battles.userId, ctx.user.id))
      .groupBy(decks.id, decks.name, decks.archetype)
      .orderBy(desc(count()))
      .limit(1);

    // Win streak calculation (simplified)
    const recentBattles = await ctx.db
      .select({ result: battles.result })
      .from(battles)
      .where(eq(battles.userId, ctx.user.id))
      .orderBy(desc(battles.playedAt))
      .limit(50);

    let currentStreak = 0;
    for (const battle of recentBattles) {
      if (battle.result === 'win') {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalBattles: stats.totalBattles,
      wins: stats.wins,
      losses: stats.losses,
      draws: stats.draws,
      winRate,
      mostUsedDeck: mostUsedDeck[0] || null,
      currentWinStreak: currentStreak,
    };
  }),

  // Get deck-wise statistics
  getDeckStats: protectedProcedure.query(async ({ ctx }) => {
    const deckStats = await ctx.db
      .select({
        deckId: decks.id,
        deckName: decks.name,
        deckArchetype: decks.archetype,
        totalBattles: count(),
        wins: sql<number>`count(case when ${battles.result} = 'win' then 1 end)`,
        losses: sql<number>`count(case when ${battles.result} = 'loss' then 1 end)`,
        draws: sql<number>`count(case when ${battles.result} = 'draw' then 1 end)`,
      })
      .from(decks)
      .leftJoin(battles, eq(decks.id, battles.playerDeckId))
      .where(eq(decks.userId, ctx.user.id))
      .groupBy(decks.id, decks.name, decks.archetype)
      .orderBy(desc(count()));

    return deckStats.map((deck) => ({
      ...deck,
      winRate: deck.totalBattles > 0 ? (deck.wins / deck.totalBattles) * 100 : 0,
    }));
  }),

  // Get matchup statistics
  getMatchupStats: protectedProcedure.query(async ({ ctx }) => {
    const matchupStats = await ctx.db
      .select({
        opponentArchetype: battles.opponentArchetype,
        totalBattles: count(),
        wins: sql<number>`count(case when ${battles.result} = 'win' then 1 end)`,
        losses: sql<number>`count(case when ${battles.result} = 'loss' then 1 end)`,
        draws: sql<number>`count(case when ${battles.result} = 'draw' then 1 end)`,
      })
      .from(battles)
      .where(eq(battles.userId, ctx.user.id))
      .groupBy(battles.opponentArchetype)
      .orderBy(desc(count()));

    return matchupStats.map((matchup) => ({
      ...matchup,
      winRate: matchup.totalBattles > 0 ? (matchup.wins / matchup.totalBattles) * 100 : 0,
    }));
  }),

  // Get time-based statistics
  getTimeStats: protectedProcedure
    .input(
      z.object({
        period: z.enum(['week', 'month', 'year']).default('month'),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      let startDate: Date;

      switch (input.period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }

      const timeStats = await ctx.db
        .select({
          date: sql<string>`DATE(${battles.playedAt})`,
          totalBattles: count(),
          wins: sql<number>`count(case when ${battles.result} = 'win' then 1 end)`,
          losses: sql<number>`count(case when ${battles.result} = 'loss' then 1 end)`,
        })
        .from(battles)
        .where(
          and(
            eq(battles.userId, ctx.user.id),
            sql`${battles.playedAt} >= ${startDate}`
          )
        )
        .groupBy(sql`DATE(${battles.playedAt})`)
        .orderBy(sql`DATE(${battles.playedAt})`);

      return timeStats.map((stat) => ({
        ...stat,
        winRate: stat.totalBattles > 0 ? (stat.wins / stat.totalBattles) * 100 : 0,
      }));
    }),

  // Get dashboard statistics
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    // This month's battles
    const thisMonth = new Date();
    const startOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);

    const monthlyStats = await ctx.db
      .select({
        monthlyBattles: count(),
        monthlyWins: sql<number>`count(case when ${battles.result} = 'win' then 1 end)`,
      })
      .from(battles)
      .where(
        and(
          eq(battles.userId, ctx.user.id),
          sql`${battles.playedAt} >= ${startOfMonth}`
        )
      );

    const monthly = monthlyStats[0];
    const monthlyWinRate = monthly.monthlyBattles > 0 ? (monthly.monthlyWins / monthly.monthlyBattles) * 100 : 0;

    // Overall stats - get basic stats directly
    const totalStats = await ctx.db
      .select({
        totalBattles: count(),
        wins: sql<number>`count(case when ${battles.result} = 'win' then 1 end)`,
        losses: sql<number>`count(case when ${battles.result} = 'loss' then 1 end)`,
        draws: sql<number>`count(case when ${battles.result} = 'draw' then 1 end)`,
      })
      .from(battles)
      .where(eq(battles.userId, ctx.user.id));

    const stats = totalStats[0];
    const winRate = stats.totalBattles > 0 ? (stats.wins / stats.totalBattles) * 100 : 0;

    // Most used deck
    const mostUsedDeck = await ctx.db
      .select({
        deckName: decks.name,
        deckArchetype: decks.archetype,
        battleCount: count(),
      })
      .from(battles)
      .leftJoin(decks, eq(battles.playerDeckId, decks.id))
      .where(eq(battles.userId, ctx.user.id))
      .groupBy(decks.id, decks.name, decks.archetype)
      .orderBy(desc(count()))
      .limit(1);

    // Win streak calculation (simplified)
    const recentBattles = await ctx.db
      .select({ result: battles.result })
      .from(battles)
      .where(eq(battles.userId, ctx.user.id))
      .orderBy(desc(battles.playedAt))
      .limit(50);

    let currentWinStreak = 0;
    for (const battle of recentBattles) {
      if (battle.result === 'win') {
        currentWinStreak++;
      } else {
        break;
      }
    }

    return {
      totalBattles: stats.totalBattles,
      wins: stats.wins,
      losses: stats.losses,
      draws: stats.draws,
      winRate,
      mostUsedDeck: mostUsedDeck[0] || null,
      currentWinStreak,
      monthlyBattles: monthly.monthlyBattles,
      monthlyWinRate,
    };
  }),
});