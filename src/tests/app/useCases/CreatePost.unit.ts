import { CreatePostUseCase } from '@/application/useCases';
import { PostsRepository } from '@/application/repositories';
import { PostsRepositoryMemory } from '@/infra/repositories';
import { uuid } from '@/infra/helpers';
import { generators, verifiers } from '@/tests/helpers';
import { MissingFieldsError } from '@/application/exceptions';
import { data } from '@/infra/sources';

type SetupComponents = {
  postsRepository: PostsRepository;
  createPost: CreatePostUseCase;
};

const setup = (): SetupComponents => {
  const postsRepository = new PostsRepositoryMemory();
  const createPost = new CreatePostUseCase({
    repositories: {
      posts: postsRepository,
    },
  });

  return {
    createPost,
    postsRepository,
  };
};

describe('CreatePost UseCase', () => {
  afterEach(() => { data.posts = []; });

  it('should create a Post successfully', async () => {
    const { createPost } = setup();
    const post = await createPost.execute({
      title: generators.title(),
      content: generators.content(),
      userId: uuid.v4(),
    });

    expect(verifiers.isPost(post)).toBe(true);
  });

  it('should fail because fields are missing', async () => {
    const { createPost } = setup();

    try {
      await createPost.execute({
        title: '',
        content: generators.content(),
        userId: uuid.v4(),
      });

      throw null;
    } catch (err) {
      expect(err instanceof MissingFieldsError).toBe(true);
    }

    try {
      await createPost.execute({
        title: '',
        content: '',
        userId: uuid.v4(),
      });

      throw null;
    } catch (err) {
      expect(err instanceof MissingFieldsError).toBe(true);
    }

    try {
      await createPost.execute({
        title: generators.title(),
        content: '',
        userId: uuid.v4(),
      });

      throw null;
    } catch (err) {
      expect(err instanceof MissingFieldsError).toBe(true);
    }
  });
});
