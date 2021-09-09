import bcrypt from 'bcrypt';

import { data } from './sources/index.js';
import { date, string, uuid } from './helpers/index.js';

export const router = (app) => {
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

    return res.status(201).send({ ...user, password: undefined });
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

    console.log(data.sessions);

    return res.status(201).send({
      user: { ...user, password: undefined },
      token: session.token,
    });
  });
};
