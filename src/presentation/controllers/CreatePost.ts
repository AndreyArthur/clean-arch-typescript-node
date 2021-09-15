import { CreatePost } from '@/core/useCases';
import {
  Controller, ControllerPlugins, HttpRequest, HttpResponse,
} from '@/presentation/protocols';

export class CreatePostController implements Controller {
  private readonly createPost: CreatePost;

  constructor(createPost: CreatePost) {
    this.createPost = createPost;
  }

  public async handle(
    request: HttpRequest, plugins?: ControllerPlugins,
  ): Promise<HttpResponse> {
    if (!plugins) throw new Error('Plugin \'auth\' required.');

    const { content, title } = request.body;
    const user = await plugins.auth(request);
    const post = await this.createPost.execute({
      content,
      title,
      userId: user.id,
    });

    return {
      status: 201,
      body: {
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      },
    };
  }
}
