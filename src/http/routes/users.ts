import { Express } from 'express';

import { ControllerConverter } from '@/converters';
import { CreateUserController } from '@/presentation/controllers';

export const usersRouter = (app: Express): void => {
  app.post('/users/', ControllerConverter.convert(new CreateUserController()));
};
