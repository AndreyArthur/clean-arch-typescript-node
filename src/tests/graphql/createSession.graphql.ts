import request from 'supertest';

import { app } from '@/main/app';
import { data as dataSource } from '@/infra/sources';
import { generators, verifiers } from '@/tests/helpers';
import { EncrypterAdapter } from '@/infra/adapters';

type Fetch = (args: { username: string, password: string }) => Promise<{
  data?: any;
  errors?: any;
}>;

const fetch: Fetch = async ({ username, password }) => {
  const { body } = await request(app).post('/graphql/')
    .send({
      query: `mutation {
          session: createSession(
            username: "${username}",
            password: "${password}"
          ) {
            user {
              id
              username
              createdAt
              updatedAt
            }
            token
          }
        }`,
    });

  if (body.data) {
    body.data.session.user = {
      ...body.data.session.user,
      createdAt: new Date(body.data.session.user.createdAt),
      updatedAt: new Date(body.data.session.user.updatedAt),
    };
  }

  return body;
};

describe('createSession Mutation', () => {
  afterEach(() => {
    dataSource.users = [];
    dataSource.sessions = [];
  });

  it('should create a Session sucessfully', async () => {
    const username = generators.username();
    const password = generators.password();

    dataSource.users.push(generators.user({
      username,
      password: await new EncrypterAdapter().hash(password),
    }));

    const { data: { session } } = await fetch({ username, password });

    expect(verifiers.isUser(session.user, false)).toBe(true);
    expect(verifiers.isSha256(session.token)).toBe(true);
  });

  it('should fail because fields are missing', async () => {
    {
      const { errors: [error] } = await fetch({
        username: '',
        password: '',
      });

      expect(error.name).toBe('MissingFieldsError');
    }

    {
      const { errors: [error] } = await fetch({
        username: generators.username(),
        password: '',
      });

      expect(error.name).toBe('MissingFieldsError');
    }

    {
      const { errors: [error] } = await fetch({
        username: '',
        password: generators.password(),
      });

      expect(error.name).toBe('MissingFieldsError');
    }
  });

  it('should fail because User not exists', async () => {
    const { errors: [error] } = await fetch({
      username: generators.username(),
      password: generators.password(),
    });

    expect(error.name).toBe('LoginFailedError');
  });

  it('should fail because User not exists', async () => {
    const { errors: [error] } = await fetch({
      username: generators.username(),
      password: generators.password(),
    });

    expect(error.name).toBe('LoginFailedError');
  });

  it('should fail because User password is wrong', async () => {
    const username = generators.username();

    dataSource.users.push(generators.user({
      username,
    }));
    const { errors: [error] } = await fetch({
      username,
      password: generators.password(),
    });

    expect(error.name).toBe('LoginFailedError');
  });
});
