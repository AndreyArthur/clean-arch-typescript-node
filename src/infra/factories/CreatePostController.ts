import { CreatePostUseCase } from '@/application/useCases';
import { CreatePostController } from '@/presentation/controllers';
import { PostsRepositoryMemory } from '@/infra/repositories';

export class CreatePostControllerFactory {
  public static create(): CreatePostController {
    const postsRepository = new PostsRepositoryMemory();
    const createPostUseCase = new CreatePostUseCase({
      repositories: {
        posts: postsRepository,
      },
    });
    const createPostController = new CreatePostController(createPostUseCase);

    return createPostController;
  }
}
