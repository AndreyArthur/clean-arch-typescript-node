import { DeletePost, DeletePostDTO } from '@/core/useCases';
import { PostsRepository } from '@/application/repositories';
import { PostNotFoundError } from '@/application/exceptions';

type DeletePostDeps = {
  repositories: {
    posts: PostsRepository;
  };
};

export class DeletePostUseCase implements DeletePost {
  private readonly postsRepository: PostsRepository;

  constructor(deps: DeletePostDeps) {
    this.postsRepository = deps.repositories.posts;
  }

  public async execute({ id, userId }: DeletePostDTO): Promise<void> {
    const postToBeDeleted = await this.postsRepository.findByUserIdAndId({
      userId,
      id,
    });

    if (!postToBeDeleted) throw new PostNotFoundError();

    await this.postsRepository.deleteById(postToBeDeleted.id);

    return Promise.resolve();
  }
}
