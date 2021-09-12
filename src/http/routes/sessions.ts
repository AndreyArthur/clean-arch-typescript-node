import { Express } from 'express';

import { ControllerConverter } from '@/converters';
import { CreateSessionControllerFactory } from '@/factories';

export const sessionsRouter = (app: Express): void => {
  app.post(
    '/sessions/',
    ControllerConverter.convert(CreateSessionControllerFactory.create()),
  );
};
