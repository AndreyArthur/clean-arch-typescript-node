import { Post } from '@/core/entities';
import { UpdatePost, UpdatePostDTO } from '@/core/useCases';
import { PostNotFoundError } from '@/application/exceptions';
import { PostsRepository } from '@/application/repositories';

type UpdatePostDeps = {
  repositories: {
    posts: PostsRepository;
  }
};

export class UpdatePostUseCase implements UpdatePost {
  private readonly postsRepository: PostsRepository;

  constructor(deps: UpdatePostDeps) {
    this.postsRepository = deps.repositories.posts;
  }

  public async execute(
    {
      id, userId, title, content,
    }: UpdatePostDTO,
  ): Promise<Post> {
    const postToBeUpdated = await this.postsRepository.findByUserIdAndId({
      userId,
      id,
    });

    if (!postToBeUpdated) throw new PostNotFoundError();
    await this.postsRepository.updateById(
      postToBeUpdated.id,
      {
        content,
        title,
      },
    );

    const updatedPost = await this.postsRepository.findById(postToBeUpdated.id);

    if (!updatedPost) throw new Error('Post not found.');

    return updatedPost;
  }
}
