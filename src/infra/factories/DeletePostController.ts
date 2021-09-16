import { DeletePostUseCase } from '@/application/useCases';
import { DeletePostController } from '@/presentation/controllers';
import { PostsRepositoryMemory } from '../repositories';

export class DeletePostControllerFactory {
  public static create(): DeletePostController {
    const postsRepository = new PostsRepositoryMemory();
    const deletePostUseCase = new DeletePostUseCase({
      repositories: {
        posts: postsRepository,
      },
    });
    const deletePostController = new DeletePostController(deletePostUseCase);

    return deletePostController;
  }
}
