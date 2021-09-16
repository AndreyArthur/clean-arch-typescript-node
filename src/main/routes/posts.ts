import { Express } from 'express';

import { data } from '@/infra/sources';
import { ensureAuthenticated } from '@/main/middlewares';
import { ControllerConverter } from '@/main/converters';
import {
  CreatePostControllerFactory,
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

  app.delete('/posts/:id', ensureAuthenticated, (req, res) => {
    const postId = req.params.id;
    const postToBeDeleted = data.posts
      .find((post) => (
        (post.userId === (req as any).user.id) && (postId === post.id)
      ));

    if (!postToBeDeleted) {
      return res.status(401).send({
        name: 'PostNotFoundError',
        message: 'Post not found or already deleted.',
      });
    }

    data.posts = data.posts
      .filter((currentPost) => currentPost.id !== postToBeDeleted.id);

    return res.status(204).send();
  });
};
