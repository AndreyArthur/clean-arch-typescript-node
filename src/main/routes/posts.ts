import { Express } from 'express';

import { ExpressHandlerControllerConverter } from '@/main/converters';
import {
  CreatePostControllerFactory,
  DeletePostControllerFactory,
  ListPostsControllerFactory,
  UpdatePostControllerFactory,
} from '@/infra/factories';

export const postsRouter = (app: Express): void => {
  app.post(
    '/posts/',
    ExpressHandlerControllerConverter.convert(
      CreatePostControllerFactory.create(),
    ),
  );

  app.get(
    '/posts/',
    ExpressHandlerControllerConverter.convert(
      ListPostsControllerFactory.create(),
    ),
  );

  app.put(
    '/posts/:id',
    ExpressHandlerControllerConverter.convert(
      UpdatePostControllerFactory.create(),
    ),
  );

  app.delete(
    '/posts/:id',
    ExpressHandlerControllerConverter.convert(
      DeletePostControllerFactory.create(),
    ),
  );
};
