import request from 'supertest';

import { app } from '@/main/app';
import { generators, verifiers } from '@/tests/helpers';
import { data as dataSource } from '@/infra/sources';

type Fetch = (args: { username: string, password: string }) => Promise<{
  data?: any;
  errors?: any;
}>;

const fetch: Fetch = async ({ username, password }) => {
  const { body } = await request(app).post('/graphql/')
    .send({
      query: `mutation {
          user: createUser(
            username: "${username}",
            password: "${password}"
          ) {
            id
            username
            createdAt
            updatedAt
          }
        }`,
    });

  if (body.data) {
    body.data.user = {
      ...body.data.user,
      createdAt: new Date(body.data.user.createdAt),
      updatedAt: new Date(body.data.user.updatedAt),
    };
  }

  return body;
};

describe('createUser Mutation', () => {
  afterEach(() => { dataSource.users = []; });

  it('should create an User successfully', async () => {
    const { data } = await fetch({
      username: generators.username(),
      password: generators.password(),
    });

    expect(verifiers.isUser(data.user, false)).toBe(true);
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

  it('should fail because User is already registered', async () => {
    const username = generators.username();

    dataSource.users.push(generators.user({
      username,
    }));

    const { errors: [error] } = await fetch({
      username,
      password: generators.password(),
    });

    expect(error.name).toBe('UserExistsError');
  });
});
