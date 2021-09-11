import { Express } from 'express';

import { CreateUserControllerFactory } from '@/factories';
import { ControllerConverter } from '@/converters';

export const usersRouter = (app: Express): void => {
  app.post(
    '/users/',
    ControllerConverter.convert(CreateUserControllerFactory.create()),
  );
};
