import { Express } from 'express';

import { CreateUserControllerFactory } from '@/infra/factories';
import { ControllerConverter } from '@/main/converters';

export const usersRouter = (app: Express): void => {
  app.post(
    '/users/',
    ControllerConverter.convert(CreateUserControllerFactory.create()),
  );
};
