import { Post } from '@/core/entities';
import { ListPosts } from '@/core/useCases';
import { PostsRepository } from '@/application/repositories';

type ListPostsDeps = {
  repositories: {
    posts: PostsRepository;
  };
};

export class ListPostsUseCase implements ListPosts {
  private readonly postsRepository: PostsRepository;

  constructor(deps: ListPostsDeps) {
    this.postsRepository = deps.repositories.posts;
  }

  public async execute(userId: string): Promise<Post[]> {
    const posts = this.postsRepository.findManyByUserId(userId);

    return posts;
  }
}
