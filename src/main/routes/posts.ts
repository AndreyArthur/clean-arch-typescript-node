import { Express } from 'express';

import { ControllerConverter } from '@/main/converters';
import {
  CreatePostControllerFactory,
  DeletePostControllerFactory,
  ListPostsControllerFactory,
  UpdatePostControllerFactory,
} from '@/infra/factories';

export const postsRouter = (app: Express): void => {
  app.post(
    '/posts/',
    ControllerConverter.convert(CreatePostControllerFactory.create()),
  );

  app.get(
    '/posts/',
    ControllerConverter.convert(ListPostsControllerFactory.create()),
  );

  app.put(
    '/posts/:id',
    ControllerConverter.convert(UpdatePostControllerFactory.create()),
  );

  app.delete(
    '/posts/:id',
    ControllerConverter.convert(DeletePostControllerFactory.create()),
  );
};
