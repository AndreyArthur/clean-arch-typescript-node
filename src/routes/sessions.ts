import { Express } from 'express';
import bcrypt from 'bcrypt';

import { data } from '@/sources';
import { date, string, uuid } from '@/helpers';

export const sessionsRouter = (app: Express): void => {
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
};
