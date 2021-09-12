import request from 'supertest';

import { generators, verifiers } from '@/tests/helpers';
import { app } from '@/main/app';
import { data } from '@/infra/sources';
import { date, uuid } from '@/infra/helpers';

describe('/users/ HTTP', () => {
  afterEach(() => { data.users = []; });

  it('should create an User successfully', async () => {
    const { body, status } = await request(app).post('/users/').send({
      username: generators.username(),
      password: generators.password(),
    });

    const user = {
      ...body,
      createdAt: new Date(body.createdAt),
      updatedAt: new Date(body.updatedAt),
    };

    expect(verifiers.isUser(user, false)).toBe(true);
    expect(status).toBe(201);
  });

  it('should return an error because fields are missing', async () => {
    {
      const { body, status } = await request(app).post('/users/').send({});

      expect(status).toBe(400);
      expect(body.name).toBe('MissingFieldsError');
    }

    {
      const { body, status } = await request(app).post('/users/').send({
        username: generators.username(),
      });

      expect(status).toBe(400);
      expect(body.name).toBe('MissingFieldsError');
    }

    {
      const { body, status } = await request(app).post('/users/').send({
        password: generators.password(),
      });

      expect(status).toBe(400);
      expect(body.name).toBe('MissingFieldsError');
    }
  });

  it('should return an error because User already exists', async () => {
    const username = generators.username();

    data.users.push({
      id: uuid.v4(),
      username,
      password: generators.password(),
      createdAt: date.utc(),
      updatedAt: date.utc(),
    });

    const { body, status } = await request(app).post('/users/').send({
      username,
      password: generators.password(),
    });

    expect(status).toBe(401);
    expect(body.name).toBe('UserExistsError');
  });
});
