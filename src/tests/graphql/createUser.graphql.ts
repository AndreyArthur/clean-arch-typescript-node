import request from 'supertest';

import { app } from '@/main/app';
import { generators, verifiers } from '@/tests/helpers';
import { data as dataSource } from '@/infra/sources';

describe('createUser Mutation', () => {
  afterEach(() => { dataSource.users = []; });

  it('should create an User successfully', async () => {
    const { body: { data } } = await request(app).post('/graphql/').send({
      query: `mutation {
        user: createUser(
          username: "${generators.username()}",
          password: "${generators.password()}"
        ) {
          id
          username
          createdAt
          updatedAt
        }
      }`,
    });
    const user = {
      id: data.user.id,
      username: data.user.username,
      createdAt: new Date(data.user.createdAt),
      updatedAt: new Date(data.user.updatedAt),
    };

    expect(verifiers.isUser(user, false)).toBe(true);
  });

  it('should fail because fields are missing', async () => {
    {
      const { body: { errors: [error] } } = await request(app).post('/graphql/')
        .send({
          query: `mutation {
          createUser (
            username: "",
            password: ""
          ) {
            id
            username
            createdAt
            updatedAt
          }
        }`,
        });

      expect(error.name).toBe('MissingFieldsError');
    }

    {
      const { body: { errors: [error] } } = await request(app).post('/graphql/')
        .send({
          query: `mutation {
          createUser (
            username: "${generators.username()}",
            password: ""
          ) {
            id
            username
            createdAt
            updatedAt
          }
        }`,
        });

      expect(error.name).toBe('MissingFieldsError');
    }

    {
      const { body: { errors: [error] } } = await request(app).post('/graphql/')
        .send({
          query: `mutation {
          createUser (
            username: "",
            password: "${generators.password()}"
          ) {
            id
            username
            createdAt
            updatedAt
          }
        }`,
        });

      expect(error.name).toBe('MissingFieldsError');
    }
  });

  it('should fail because User is already registered', async () => {
    const username = generators.username();

    dataSource.users.push(generators.user({
      username,
    }));

    const { body: { errors: [error] } } = await request(app).post('/graphql/')
      .send({
        query: `mutation {
          createUser (
            username: "${username}",
            password: "${generators.password()}"
          ) {
            id
            username
            createdAt
            updatedAt
          }
        }`,
      });

    expect(error.name).toBe('UserExistsError');
  });
});
