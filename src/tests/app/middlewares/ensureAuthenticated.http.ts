import bcrypt from 'bcrypt';
import request from 'supertest';

import { app, ensureAuthenticated } from '@/http';
import { data } from '@/sources';
import { date, string, uuid } from '@/helpers';
import { generators } from '@/tests/helpers';

const createSession = async (expiration?: number): Promise<string> => {
  const user = {
    id: uuid.v4(),
    username: generators.username(),
    password: await bcrypt.hash(generators.password(), 10),
    createdAt: date.utc(),
    updatedAt: date.utc(),
  };
  const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
  const session = {
    id: uuid.v4(),
    userId: user.id,
    expirationTime: expiration
      || date.utc().getTime() + ONE_DAY_IN_MILLISECONDS,
    token: string.sha256(),
  };

  data.users.push(user);
  data.sessions.push(session);

  return session.token;
};

describe('ensureAuthenticated Middleware', () => {
  afterEach(() => {
    data.users = [];
    data.sessions = [];
  });

  it('should pass through middleware without error', async () => {
    const endpoint = '/test/pass_without_error/';
    const token = await createSession();

    app.get(endpoint, ensureAuthenticated, (req, res) => (
      res.send({ ok: true })
    ));

    const { body } = await request(app)
      .get(endpoint)
      .set('Session-Token', token);

    expect(body.ok).toBe(true);
  });

  it('should return an error because token is missing', async () => {
    const endpoint = '/test/missing_token_error/';

    app.get(endpoint, ensureAuthenticated, (req, res) => (
      res.send({ ok: true })
    ));

    const { body, status } = await request(app)
      .get(endpoint);

    expect(status).toBe(401);
    expect(body.name).toBe('MissingTokenError');
  });

  it('should return an error because token is invalid', async () => {
    const endpoint = '/test/invalid_token_error/';

    app.get(endpoint, ensureAuthenticated, (req, res) => (
      res.send({ ok: true })
    ));

    const { body, status } = await request(app)
      .get(endpoint)
      .set('Session-Token', generators.sha256());

    expect(status).toBe(401);
    expect(body.name).toBe('InvalidTokenError');
  });

  it('should return an error because token is expired', async () => {
    const endpoint = '/test/expired_token_error/';
    const token = await createSession(date.utc().getTime());

    app.get(endpoint, ensureAuthenticated, (req, res) => (
      res.send({ ok: true })
    ));

    const { body, status } = await request(app)
      .get(endpoint)
      .set('Session-Token', token);

    expect(status).toBe(401);
    expect(body.name).toBe('ExpiredTokenError');
  });

  it(
    'should return an error bacause Session User does not exists',
    async () => {
      const endpoint = '/test/missing_user_error/';
      const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      const session = {
        id: uuid.v4(),
        userId: uuid.v4(),
        expirationTime: date.utc().getTime() + ONE_DAY_IN_MILLISECONDS,
        token: string.sha256(),
      };

      data.sessions.push(session);

      app.get(endpoint, ensureAuthenticated, (req, res) => (
        res.send({ ok: true })
      ));

      const { body, status } = await request(app)
        .get(endpoint)
        .set('Session-Token', session.token);

      expect(status).toBe(401);
      expect(body.name).toBe('MissingUserError');
    },
  );
});
