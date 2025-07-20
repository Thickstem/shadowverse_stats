import { initTRPC, TRPCError } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function createTRPCContext(opts: FetchCreateContextFnOptions) {
  const { userId } = await auth();
  
  return {
    db,
    userId,
    ...opts,
  };
}

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    // Get or create user in database
    let user = await ctx.db.query.users.findFirst({
      where: eq(users.clerkId, ctx.userId),
    });

    if (!user) {
      [user] = await ctx.db
        .insert(users)
        .values({
          clerkId: ctx.userId,
          username: 'User', // Will be updated via webhook
        })
        .returning();
    }

    return next({
      ctx: {
        ...ctx,
        userId: ctx.userId,
        user,
      },
    });
  })
);