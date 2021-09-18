import { DeletePost } from '@/core/useCases';
import {
  Controller, ControllerPlugins, HttpRequest, HttpResponse,
} from '@/presentation/protocols';

export class DeletePostController implements Controller {
  private readonly deletePost: DeletePost;

  constructor(deletePost: DeletePost) {
    this.deletePost = deletePost;
  }

  public async handle(
    request: HttpRequest, plugins?: ControllerPlugins,
  ): Promise<HttpResponse> {
    if (!plugins) throw new Error('Plugin \'auth\' is required.');

    const user = await plugins.auth(request);
    await this.deletePost.execute({
      userId: user.id,
      id: request.body.id,
    });

    return {
      status: 204,
    };
  }
}
