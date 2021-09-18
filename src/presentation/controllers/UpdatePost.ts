import { UpdatePost } from '@/core/useCases';
import {
  Controller, ControllerPlugins, HttpRequest, HttpResponse,
} from '@/presentation/protocols';
import { PostView } from '@/presentation/views';

export class UpdatePostController implements Controller {
  private readonly updatePost: UpdatePost;

  constructor(updatePost: UpdatePost) {
    this.updatePost = updatePost;
  }

  public async handle(
    request: HttpRequest, plugins?: ControllerPlugins,
  ): Promise<HttpResponse<PostView>> {
    if (!plugins) throw new Error('Plugin \'auth\' is required.');

    const { content, title } = request.body;
    const user = await plugins.auth(request);
    const post = await this.updatePost.execute({
      id: request.body.id,
      userId: user.id,
      content,
      title,
    });

    return {
      status: 200,
      body: {
        id: post.id,
        content: post.content,
        title: post.title,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      },
    };
  }
}
