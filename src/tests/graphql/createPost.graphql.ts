import request from 'supertest';

import { EncrypterAdapter } from '@/infra/adapters';
import { date } from '@/infra/helpers';
import { data } from '@/infra/sources';
import { generators, verifiers } from '@/tests/helpers';
import { app } from '@/main/app';

type Fetch = (
  args: { title: string, content: string }, token: string
) => Promise<{
  data?: any;
  errors?: any;
}>;

const fetch: Fetch = async ({ title, content }, token) => {
  const { body } = await request(app).post('/graphql/')
    .send({
      query: `mutation {
          post: createPost(
            title: "${title}",
            content: "${content}"
          ) {
            id
            title
            content
            createdAt
            updatedAt
          }
        }`,
    }).set('Session-Token', token);

  if (body.data) {
    body.data.post = {
      ...body.data.post,
      createdAt: new Date(body.data.post.createdAt),
      updatedAt: new Date(body.data.post.updatedAt),
    };
  }

  return body;
};

const createSession = async (): Promise<Record<string, any>> => {
  const user = generators.user({
    password: await new EncrypterAdapter().hash(generators.password()),
  });
  const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
  const session = generators.session({
    userId: user.id,
    expirationTime: date.utc().getTime() + ONE_DAY_IN_MILLISECONDS,
  });

  data.users.push(user);
  data.sessions.push(session);

  return { user, session };
};

describe('createPost Mutation', () => {
  afterEach(() => {
    data.users = [];
    data.sessions = [];
    data.posts = [];
  });

  it('should create a post successfully', async () => {
    const { session: { token } } = await createSession();
    const { data: { post } } = await fetch({
      title: generators.title(),
      content: generators.content(),
    }, token);

    expect(verifiers.isPost(post, false)).toBe(true);
  });

  it('should fail to create a post because fields are missing', async () => {
    const { session: { token } } = await createSession();

    {
      const { errors: [error] } = await fetch({
        title: '',
        content: '',
      }, token);

      expect(error.name).toBe('MissingFieldsError');
    }

    {
      const { errors: [error] } = await fetch({
        title: generators.title(),
        content: '',
      }, token);

      expect(error.name).toBe('MissingFieldsError');
    }

    {
      const { errors: [error] } = await fetch({
        title: '',
        content: generators.content(),
      }, token);

      expect(error.name).toBe('MissingFieldsError');
    }
  });
});
