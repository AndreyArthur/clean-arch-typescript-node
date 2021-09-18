import request from 'supertest';

import { EncrypterAdapter } from '@/infra/adapters';
import { date, uuid } from '@/infra/helpers';
import { data } from '@/infra/sources';
import { generators, verifiers } from '@/tests/helpers';
import { app } from '@/main/app';

type Fetch = (
  args: { id: string, title: string, content: string },
  token: string
) => Promise<{
  data?: any;
  errors?: any;
}>;

const fetch: Fetch = async ({ id, title, content }, token) => {
  const { body } = await request(app).post('/graphql/')
    .send({
      query: `mutation {
          post: updatePost(
            id: "${id}"
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

describe('updatePost Mutation', () => {
  afterEach(() => {
    data.users = [];
    data.sessions = [];
    data.posts = [];
  });

  it('should update a Post successfully', async () => {
    const { user, session: { token } } = await createSession();
    const post = generators.post({
      id: uuid.v4(),
      userId: user.id,
    });

    data.posts.push(post);

    const { data: { post: updatedPost } } = await fetch({
      id: post.id,
      title: generators.title(),
      content: generators.content(),
    }, token);

    expect(verifiers.isPost(updatedPost, false)).toBe(true);
    expect(updatedPost.title !== post.title).toBe(true);
    expect(updatedPost.content !== post.content).toBe(true);
  });
});
