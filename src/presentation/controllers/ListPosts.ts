import { ListPosts } from '@/core/useCases';
import {
  Controller, ControllerPlugins, HttpRequest, HttpResponse,
} from '@/presentation/protocols';

export class ListPostsController implements Controller {
  private readonly listPosts: ListPosts;

  constructor(listPosts: ListPosts) {
    this.listPosts = listPosts;
  }

  public async handle(
    request: HttpRequest, plugins?: ControllerPlugins,
  ): Promise<HttpResponse> {
    if (!plugins) throw new Error('Plugin \'auth\' is required.');

    const user = await plugins.auth(request);
    const posts = (await this.listPosts.execute(user.id)).map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));

    return {
      status: 200,
      body: posts,
    };
  }
}
