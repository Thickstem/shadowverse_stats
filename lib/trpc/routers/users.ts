import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../server';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const usersRouter = router({
  // Get current user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1, 'Username is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updatedUser] = await ctx.db
        .update(users)
        .set({
          username: input.username,
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id))
        .returning();

      return updatedUser;
    }),

  // Create user (for webhook)
  create: publicProcedure
    .input(
      z.object({
        clerkId: z.string(),
        username: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .insert(users)
        .values({
          clerkId: input.clerkId,
          username: input.username,
        })
        .returning();

      return user;
    }),

  // Update user (for webhook)
  update: publicProcedure
    .input(
      z.object({
        clerkId: z.string(),
        username: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updatedUser] = await ctx.db
        .update(users)
        .set({
          username: input.username,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, input.clerkId))
        .returning();

      return updatedUser;
    }),

  // Delete user (for webhook)
  delete: publicProcedure
    .input(
      z.object({
        clerkId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(users).where(eq(users.clerkId, input.clerkId));
      return { success: true };
    }),
});