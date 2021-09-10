import { Express } from 'express';
import bcrypt from 'bcrypt';

import { data } from '@/sources';
import { ensureAuthenticated } from '@/middlewares';
import { date, string, uuid } from '@/helpers';

export const router = (app: Express) => {
  app.post('/users/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({
        name: 'MissingFieldsError',
        message: 'Fields \'username\' and \'password\' are required.',
      });
    }

    const userExists = data.users.find((currentUser) => (
      currentUser.username === username
    ));

    if (userExists) {
      return res.status(401).send({
        name: 'UserExistsError',
        message: 'User already exists.',
      });
    }

    const user = {
      id: uuid.v4(),
      username,
      password: await bcrypt.hash(password, 10),
      createdAt: date.utc(),
      updatedAt: date.utc(),
    };

    data.users.push(user);

    return res.status(201).send({
      ...user,
      password: undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  });

  app.post('/sessions/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({
        name: 'MissingFieldsError',
        message: 'Fields \'username\' and \'password\' are required.',
      });
    }

    const user = data.users.find((currentUser) => (
      currentUser.username === username
    ));

    if (!user) {
      return res.status(401).send({
        name: 'LoginFailedError',
        message: 'Incorrect username/password combination.',
      });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      return res.status(401).send({
        name: 'LoginFailedError',
        message: 'Incorrect username/password combination.',
      });
    }

    data.sessions = data.sessions.filter((currentSession) => (
      currentSession.userId !== user.id
    ));

    const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

    const session = {
      id: uuid.v4(),
      userId: user.id,
      token: string.sha256(),
      expirationTime: date.utc().getTime() + ONE_DAY_IN_MILLISECONDS,
    };

    data.sessions.push(session);

    return res.status(201).send({
      user: {
        ...user,
        password: undefined,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      token: session.token,
    });
  });

  app.post('/posts/', ensureAuthenticated, (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).send({
        name: 'MissingFieldsError',
        message: 'Fields \'title\' and \'content\' are required.',
      });
    }

    const post = {
      id: uuid.v4(),
      title,
      content,
      userId: (req as any).user.id,
      createdAt: date.utc(),
      updatedAt: date.utc(),
    };

    data.posts.push(post)

    return res.status(201).send({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    });
  });

  app.get('/posts/', ensureAuthenticated, (req, res) => {
    const userPosts = data.posts
      .filter((post) => post.userId === (req as any).user.id)
      .sort((postA, postB) => (
        postB.createdAt.getTime() - postA.createdAt.getTime()
      ))
      .map((post) => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      }));

    return res.status(200).send(userPosts);
  });

  app.put('/posts/:id', ensureAuthenticated, (req, res) => {
    const postId = req.params.id;
    const postToBeUpdated = data.posts
      .find((post) => (
        (post.userId === (req as any).user.id) && (postId === post.id)
      ));

    if (!postToBeUpdated) {
      return res.status(401).send({
        name: 'PostNotFoundError',
        message: 'Post not found or deleted.',
      });
    }

    const { title, content } = req.body;

    const updatedPost = {
      ...postToBeUpdated,
      title: title || postToBeUpdated.title,
      content: content || postToBeUpdated.content,
      updatedAt: date.utc(),
    };

    data.posts = data.posts
      .filter((currentPost) => currentPost.id !== postToBeUpdated.id);

    data.posts.push(updatedPost);

    return res.status(200).send({
      ...updatedPost,
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
    });
  });

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
  })
};
