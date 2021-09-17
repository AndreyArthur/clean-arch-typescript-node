import { Express } from 'express';

import { CreateUserControllerFactory } from '@/infra/factories';
import { ExpressHandlerControllerConverter } from '@/main/converters';

export const usersRouter = (app: Express): void => {
  app.post(
    '/users/',
    ExpressHandlerControllerConverter.convert(
      CreateUserControllerFactory.create(),
    ),
  );
};
