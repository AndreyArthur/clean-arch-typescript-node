import { Express } from 'express';

import { ControllerConverter } from '@/main/converters';
import { CreateSessionControllerFactory } from '@/infra/factories';

export const sessionsRouter = (app: Express): void => {
  app.post(
    '/sessions/',
    ControllerConverter.convert(CreateSessionControllerFactory.create()),
  );
};
