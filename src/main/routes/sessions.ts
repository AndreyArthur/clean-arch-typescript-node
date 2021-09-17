import { Express } from 'express';

import { ExpressHandlerControllerConverter } from '@/main/converters';
import { CreateSessionControllerFactory } from '@/infra/factories';

export const sessionsRouter = (app: Express): void => {
  app.post(
    '/sessions/',
    ExpressHandlerControllerConverter.convert(
      CreateSessionControllerFactory.create(),
    ),
  );
};
