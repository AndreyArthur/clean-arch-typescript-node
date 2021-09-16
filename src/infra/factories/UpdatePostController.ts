import { UpdatePostUseCase } from '@/application/useCases';
import { UpdatePostController } from '@/presentation/controllers';
import { PostsRepositoryMemory } from '@/infra/repositories';

export class UpdatePostControllerFactory {
  public static create(): UpdatePostController {
    const postsRepository = new PostsRepositoryMemory();
    const updatePostUseCase = new UpdatePostUseCase({
      repositories: {
        posts: postsRepository,
      },
    });
    const updatePostController = new UpdatePostController(updatePostUseCase);

    return updatePostController;
  }
}
