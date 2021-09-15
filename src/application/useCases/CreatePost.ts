import { Post } from '@/core/entities';
import { MissingFieldsError } from '@/application/exceptions';
import { PostsRepository } from '@/application/repositories';
import { CreatePost, CreatePostDTO } from '@/core/useCases';

type CreatePostDeps = {
  repositories: {
    posts: PostsRepository;
  }
};

export class CreatePostUseCase implements CreatePost {
  private readonly postsRepository: PostsRepository;

  constructor(deps: CreatePostDeps) {
    this.postsRepository = deps.repositories.posts;
  }

  public async execute(
    { userId, title, content }: CreatePostDTO,
  ): Promise<Post> {
    if (!title || !content) throw new MissingFieldsError('title', 'content');

    const post = this.postsRepository.create({ userId, title, content });

    await this.postsRepository.save(post);

    return post;
  }
}
