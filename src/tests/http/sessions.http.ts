import request from 'supertest';
import bcrypt from 'bcrypt';

import { date, uuid } from '@/helpers';
import { data } from '@/sources';
import { generators, verifiers } from '@/tests/helpers';
import { app } from '@/http';

describe('/sessions/ HTTP', () => {
  afterEach(() => {
    data.users = [];
    data.sessions = [];
  });

  it('should create a session successfully', async () => {
    const username = generators.username();
    const password = generators.password();

    data.users.push({
      id: uuid.v4(),
      username,
      password: await bcrypt.hash(password, 10),
      createdAt: date.utc(),
      updatedAt: date.utc(),
    });

    const { body, status } = await request(app)
      .post('/sessions/')
      .send({
        username,
        password,
      });

    const user = {
      ...body.user,
      createdAt: new Date(body.user.createdAt),
      updatedAt: new Date(body.user.updatedAt),
    };

    expect(status).toBe(201);
    expect(verifiers.isSha256(body.token)).toBe(true);
    expect(verifiers.isUser(user, false)).toBe(true);
  });

  it('should return an error because fields are missing', async () => {
    {
      const { body, status } = await request(app).post('/sessions/').send({});

      expect(status).toBe(400);
      expect(body.name).toBe('MissingFieldsError');
    }

    {
      const { body, status } = await request(app).post('/sessions/').send({
        username: generators.username(),
      });

      expect(status).toBe(400);
      expect(body.name).toBe('MissingFieldsError');
    }

    {
      const { body, status } = await request(app).post('/sessions/').send({
        password: generators.password(),
      });

      expect(status).toBe(400);
      expect(body.name).toBe('MissingFieldsError');
    }
  });

  it('should return an error because User does not exists', async () => {
    const { body, status } = await request(app)
      .post('/sessions/')
      .send({
        username: generators.username(),
        password: generators.password(),
      });

    expect(status).toBe(401);
    expect(body.name).toBe('LoginFailedError');
  });

  it('should return an error because User password is wrong', async () => {
    const username = generators.username();

    data.users.push({
      id: uuid.v4(),
      username,
      password: await bcrypt.hash(generators.password(), 10),
      createdAt: date.utc(),
      updatedAt: date.utc(),
    });

    const { body, status } = await request(app)
      .post('/sessions/')
      .send({
        username,
        password: generators.password(),
      });

    expect(status).toBe(401);
    expect(body.name).toBe('LoginFailedError');
  });
});
