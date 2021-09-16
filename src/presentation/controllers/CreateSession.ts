import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { CreateSession } from '@/core/useCases';
import { UserView } from '@/presentation/views';

type CreateSessionControllerResponseBody = {
  user: UserView;
  token: string;
};

export class CreateSessionController implements Controller {
  private readonly createSession: CreateSession;

  constructor(createSession: CreateSession) {
    this.createSession = createSession;
  }

  public async handle(
    request: HttpRequest,
  ): Promise<HttpResponse<CreateSessionControllerResponseBody>> {
    const { username, password } = request.body;
    const { user: { password: _p, ...user }, token } = await this.createSession
      .execute({
        username,
        password,
      });

    return {
      status: 201,
      body: {
        user: {
          id: user.id,
          username: user.username,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        token,
      },
    };
  }
}
