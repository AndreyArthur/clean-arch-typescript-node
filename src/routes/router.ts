import { Express } from 'express';

import { usersRouter, postsRouter, sessionsRouter } from '@/routes';

export const router = (app: Express): void => {
  usersRouter(app);
  sessionsRouter(app);
  postsRouter(app);
};
