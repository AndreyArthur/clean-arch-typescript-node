import { ListPostsUseCase } from '@/application/useCases';
import { ListPostsController } from '@/presentation/controllers';
import { PostsRepositoryMemory } from '../repositories';

export class ListPostsControllerFactory {
  public static create(): ListPostsController {
    const postsRepository = new PostsRepositoryMemory();
    const listPostsUseCase = new ListPostsUseCase({
      repositories: {
        posts: postsRepository,
      },
    });
    const listPostsController = new ListPostsController(listPostsUseCase);

    return listPostsController;
  }
}
