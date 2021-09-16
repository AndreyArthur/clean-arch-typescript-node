import { PostNotFoundError } from '@/application/exceptions';
import { PostsRepository } from '@/application/repositories';
import { DeletePostUseCase } from '@/application/useCases';
import { uuid } from '@/infra/helpers';
import { PostsRepositoryMemory } from '@/infra/repositories';
import { generators } from '@/tests/helpers';

type SetupComponents = {
  postsRepository: PostsRepository;
  deletePost: DeletePostUseCase;
};

const setup = (): SetupComponents => {
  const postsRepository = new PostsRepositoryMemory();
  const deletePost = new DeletePostUseCase({
    repositories: {
      posts: postsRepository,
    },
  });

  return {
    postsRepository,
    deletePost,
  };
};

describe('DeletePost UseCase', () => {
  it('should delete a post returning nothing', async () => {
    const { deletePost, postsRepository } = setup();
    const postId = uuid.v4();
    const userId = uuid.v4();
    const post = generators.post({ id: postId, userId });

    jest.spyOn(postsRepository, 'findByUserIdAndId').mockReturnValueOnce(
      Promise.resolve(post),
    );

    await deletePost.execute({
      id: postId,
      userId,
    });
  });

  it('should fail because Post to be deleted not exists', async () => {
    const { deletePost } = setup();

    try {
      await deletePost.execute({
        id: uuid.v4(),
        userId: uuid.v4(),
      });

      throw null;
    } catch (err) {
      expect(err instanceof PostNotFoundError).toBe(true);
    }
  });
});
