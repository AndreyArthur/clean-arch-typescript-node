import bcrypt from 'bcrypt';
import request from 'supertest';

import { data } from '@/infra/sources';
import { date, string, uuid } from '@/infra/helpers';
import { generators, verifiers } from '@/tests/helpers';
import { app } from '@/main/app';

const createSession = async (): Promise<Record<string, any>> => {
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
    expirationTime: date.utc().getTime() + ONE_DAY_IN_MILLISECONDS,
    token: string.sha256(),
  };

  data.users.push(user);
  data.sessions.push(session);

  return { user, session };
};

describe('/posts/ HTTP', () => {
  afterEach(() => {
    data.users = [];
    data.sessions = [];
    data.posts = [];
  });

  it('should create a post successfully', async () => {
    const { session: { token } } = await createSession();
    const { body, status } = await request(app).post('/posts/').send({
      title: generators.title(),
      content: generators.content(),
    }).set('Session-Token', token);

    const post = {
      ...body,
      createdAt: new Date(body.createdAt),
      updatedAt: new Date(body.updatedAt),
    };

    expect(status).toBe(201);
    expect(verifiers.isPost(post, false)).toBe(true);
  });

  it('should fail to create a post because fields are missing', async () => {
    const { session: { token } } = await createSession();

    {
      const { body, status } = await request(app)
        .post('/posts/')
        .send({})
        .set('Session-Token', token);

      expect(status).toBe(400);
      expect(body.name).toBe('MissingFieldsError');
    }

    {
      const { body, status } = await request(app)
        .post('/posts/')
        .send({
          title: generators.title(),
        })
        .set('Session-Token', token);

      expect(status).toBe(400);
      expect(body.name).toBe('MissingFieldsError');
    }

    {
      const { body, status } = await request(app)
        .post('/posts/')
        .send({
          content: generators.content(),
        })
        .set('Session-Token', token);

      expect(status).toBe(400);
      expect(body.name).toBe('MissingFieldsError');
    }
  });

  it('should get all Posts created by single User', async () => {
    const { user, session } = await createSession();

    for (let i = 0; i < 10; i += 1) {
      data.posts.push({
        id: uuid.v4(),
        userId: user.id,
        title: generators.title(),
        content: generators.content(),
        createdAt: date.utc(),
        updatedAt: date.utc(),
      });
    }

    const { body, status } = await request(app)
      .get('/posts/')
      .set('Session-Token', session.token);

    const post = {
      ...body[9],
      createdAt: new Date(body[9].createdAt),
      updatedAt: new Date(body[9].updatedAt),
    };

    expect(status).toBe(200);
    expect(body.length).toBe(10);
    expect(verifiers.isPost(post, false)).toBe(true);
  });

  it('should update a post successfully', async () => {
    const title = generators.title();
    const content = generators.content();
    const { user, session } = await createSession();
    const createdPost = {
      id: uuid.v4(),
      title: generators.title(),
      content: generators.content(),
      userId: user.id,
      createdAt: date.utc(),
      updatedAt: date.utc(),
    };

    data.posts.push(createdPost);

    const { body, status } = await request(app)
      .put(`/posts/${createdPost.id}`)
      .send({
        title,
        content,
      })
      .set('Session-Token', session.token);
    const post = {
      ...body,
      createdAt: new Date(body.createdAt),
      updatedAt: new Date(body.updatedAt),
    };

    expect(status).toBe(200);
    expect(verifiers.isPost(post, false)).toBe(true);
    expect(post.title).toBe(title);
    expect(post.content).toBe(content);
    expect(post.createdAt.getTime() < post.updatedAt.getTime()).toBe(true);
  });

  it(
    'should throw an error because post to be updated was not found',
    async () => {
      const { session } = await createSession();

      const { body, status } = await request(app)
        .put(`/posts/${uuid.v4()}`)
        .set('Session-Token', session.token);

      expect(body.name).toBe('PostNotFoundError');
      expect(status).toBe(401);
    },
  );

  it('should delete a post successfully', async () => {
    const { user, session } = await createSession();
    const createdPost = {
      id: uuid.v4(),
      title: generators.title(),
      content: generators.content(),
      userId: user.id,
      createdAt: date.utc(),
      updatedAt: date.utc(),
    };

    data.posts.push(createdPost);

    const { body, status } = await request(app)
      .delete(`/posts/${createdPost.id}`)
      .set('Session-Token', session.token);

    expect(status).toBe(204);
    expect(JSON.stringify(body) === '{}').toBe(true);
  });

  it(
    'should throw an error because post to be deleted was not found',
    async () => {
      const { session } = await createSession();

      const { body, status } = await request(app)
        .delete(`/posts/${uuid.v4()}`)
        .set('Session-Token', session.token);

      expect(body.name).toBe('PostNotFoundError');
      expect(status).toBe(401);
    },
  );
});
