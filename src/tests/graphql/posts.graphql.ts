import request from 'supertest';

import { data } from '@/infra/sources';
import { app } from '@/main/app';
import { generators, verifiers } from '../helpers';
import { EncrypterAdapter } from '@/infra/adapters';
import { date } from '@/infra/helpers';

type Fetch = (token: string) => Promise<{
  data?: any;
  errors?: any;
}>;

const fetch: Fetch = async (token) => {
  const { body } = await request(app).post('/graphql/')
    .send({
      query: `query {
          posts {
            id
            title
            content
            createdAt
            updatedAt
          }
        }`,
    }).set('Session-Token', token);

  if (body.data) {
    body.data.posts = body.data.posts.map((post: any) => ({
      ...post,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    }));
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

describe('posts Query', () => {
  afterEach(() => {
    data.users = [];
    data.posts = [];
    data.sessions = [];
  });

  it('should list all the Posts from an User', async () => {
    const { user, session: { token } } = await createSession();

    for (let i = 0; i < 10; i += 1) {
      data.posts.push(generators.post({
        userId: user.id,
      }));
    }

    const { data: { posts } } = await fetch(token);

    expect(posts.length).toBe(10);
    expect(verifiers.isPost(posts[9], false)).toBe(true);
  });

  it('should list no Posts', async () => {
    const { session: { token } } = await createSession();
    const { data: { posts } } = await fetch(token);

    expect(posts.length).toBe(0);
  });
});
