import { Express } from 'express';
import bcrypt from 'bcrypt';

import { data } from '@/sources';
import { date, uuid } from '@/helpers';

export const usersRouter = (app: Express): void => {
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
};
