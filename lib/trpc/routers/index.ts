import { router } from '../server';
import { usersRouter } from './users';
import { decksRouter } from './decks';
import { battlesRouter } from './battles';
import { statisticsRouter } from './statistics';

export const appRouter = router({
  users: usersRouter,
  decks: decksRouter,
  battles: battlesRouter,
  statistics: statisticsRouter,
});

export type AppRouter = typeof appRouter;