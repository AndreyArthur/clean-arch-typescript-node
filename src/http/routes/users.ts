import { Express } from 'express';

import { CreateUserService } from '@/services';
import { User } from '@/entities';

export const usersRouter = (app: Express): void => {
  app.post('/users/', async (req, res) => {
    const { username, password } = req.body;

    let user: User;

    try {
      user = await new CreateUserService().execute({
        username,
        password,
      });
    } catch (err: any) {
      if (err.type === 'validation') {
        return res.status(400).send({
          type: err.type,
          name: err.name,
          message: err.message,
        });
      }
      if (err.type === 'authorization') {
        return res.status(401).send({
          type: err.type,
          name: err.name,
          message: err.message,
        });
      }
      return res.status(500).send({
        type: 'unexpected',
        name: 'InternalServerError',
        message: 'An internal server error has occured, try again later.',
      });
    }

    return res.status(201).send({
      ...user,
      password: undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  });
};
