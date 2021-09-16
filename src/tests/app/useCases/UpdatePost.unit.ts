import { PostNotFoundError } from '@/application/exceptions';
import { PostsRepository, PostsRepositoryUpdateByIdDTO } from '@/application/repositories';
import { UpdatePostUseCase } from '@/application/useCases';
import { date, uuid } from '@/infra/helpers';
import { PostsRepositoryMemory } from '@/infra/repositories';
import { data } from '@/infra/sources';
import { generators, verifiers } from '@/tests/helpers';

type SetupComponents = {
  postsRepository: PostsRepository;
  updatePost: UpdatePostUseCase;
};

const setup = (): SetupComponents => {
  const postsRepository = new PostsRepositoryMemory();
  const updatePost = new UpdatePostUseCase({
    repositories: {
      posts: postsRepository,
    },
  });

  return {
    postsRepository,
    updatePost,
  };
};

describe('UpdatePost UseCase', () => {
  afterEach(() => { data.posts = []; });

  it('should update a Post successfully', async () => {
    const { updatePost, postsRepository } = setup();
    const postId = uuid.v4();
    const userId = uuid.v4();
    const newTitle = generators.title();
    const newContent = generators.content();
    const post = generators.post({ id: postId, userId });

    jest.spyOn(postsRepository, 'findByUserIdAndId').mockReturnValueOnce(
      Promise.resolve(post),
    );
    jest.spyOn(postsRepository, 'updateById')
      .mockImplementationOnce(
        (_id: string, _d: PostsRepositoryUpdateByIdDTO): Promise<void> => (
          Promise.resolve()
        ),
      );
    jest.spyOn(postsRepository, 'findById').mockReturnValueOnce(
      Promise.resolve({
        ...post,
        content: generators.content(),
        title: generators.title(),
        updatedAt: date.utc(),
      }),
    );

    const updatedPost = await updatePost.execute({
      id: postId,
      userId,
      title: newTitle,
      content: newContent,
    });

    expect(verifiers.isPost(updatedPost)).toBe(true);
    expect(post.content !== updatedPost.content).toBe(true);
    expect(post.title !== updatedPost.title).toBe(true);
  });

  it('should fail because Post to be updated not exists', async () => {
    const { updatePost } = setup();

    try {
      await updatePost.execute({
        id: uuid.v4(),
        userId: uuid.v4(),
        title: generators.title(),
        content: generators.content(),
      });

      throw null;
    } catch (err) {
      expect(err instanceof PostNotFoundError).toBe(true);
    }
  });

  it(
    'should fail with JavaScript Error when updated Post is not found',
    async () => {
      const { updatePost, postsRepository } = setup();
      const postId = uuid.v4();
      const userId = uuid.v4();
      const post = generators.post({ id: postId, userId });

      jest.spyOn(postsRepository, 'findByUserIdAndId').mockReturnValueOnce(
        Promise.resolve(post),
      );
      jest.spyOn(postsRepository, 'updateById')
        .mockImplementationOnce(
          (_id: string, _d: PostsRepositoryUpdateByIdDTO): Promise<void> => (
            Promise.resolve()
          ),
        );
      jest.spyOn(postsRepository, 'findById').mockReturnValueOnce(
        Promise.resolve(null),
      );

      try {
        await updatePost.execute({
          id: postId,
          userId,
          title: generators.title(),
          content: generators.content(),
        });

        throw null;
      } catch (err) {
        expect(err instanceof Error).toBe(true);
        expect((err as Error).message).toBe('Post not found.');
      }
    },
  );
});
