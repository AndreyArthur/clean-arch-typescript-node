import { PostsRepository } from '@/application/repositories';
import { ListPostsUseCase } from '@/application/useCases';
import { Post } from '@/core/entities';
import { uuid } from '@/infra/helpers';
import { PostsRepositoryMemory } from '@/infra/repositories';
import { data } from '@/infra/sources';
import { generators, verifiers } from '@/tests/helpers';

type SetupComponents = {
  postsRepository: PostsRepository;
  listPosts: ListPostsUseCase;
};

const setup = (): SetupComponents => {
  const postsRepository = new PostsRepositoryMemory();
  const listPosts = new ListPostsUseCase({
    repositories: {
      posts: postsRepository,
    },
  });

  return {
    postsRepository,
    listPosts,
  };
};

describe('ListPosts UseCase', () => {
  afterEach(() => { data.posts = []; });

  it('should return all posts from an User', async () => {
    const { postsRepository, listPosts } = setup();
    const userId = uuid.v4();

    jest.spyOn(postsRepository, 'findManyByUserId').mockReturnValueOnce(
      Promise.resolve(((): Post[] => {
        const posts = [];

        for (let i = 0; i < 10; i += 1) {
          posts.push(generators.post({ userId }));
        }

        return posts;
      })()),
    );

    const posts = await listPosts.execute(userId);

    expect(posts.length).toBe(10);
    expect(verifiers.isPost(posts[9])).toBe(true);
  });
});
