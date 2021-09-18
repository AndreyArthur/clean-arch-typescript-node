import request from 'supertest';

import { EncrypterAdapter } from '@/infra/adapters';
import { date, uuid } from '@/infra/helpers';
import { data } from '@/infra/sources';
import { generators } from '@/tests/helpers';
import { app } from '@/main/app';

type Fetch = (
  args: { id: string },
  token: string
) => Promise<{
  data?: any;
  errors?: any;
}>;

const fetch: Fetch = async ({ id }, token) => {
  const { body } = await request(app).post('/graphql/')
    .send({
      query: `mutation {
          post: deletePost(id: "${id}")
        }`,
    }).set('Session-Token', token);

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

describe('deletePost Mutation', () => {
  afterEach(() => {
    data.users = [];
    data.sessions = [];
    data.posts = [];
  });

  it('should delete a Post successfully', async () => {
    const { user, session: { token } } = await createSession();
    const createdPost = generators.post({
      id: uuid.v4(),
      userId: user.id,
    });

    data.posts.push(createdPost);

    const { data: { post } } = await fetch({
      id: createdPost.id,
    }, token);

    const deletedPost = data.posts.find(
      ({ id: postId }) => createdPost.id === postId,
    );

    expect(deletedPost).toBe(undefined);
    expect(post).toBe(null);
  });
});
