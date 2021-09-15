import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { CreateSession } from '@/core/useCases';

export class CreateSessionController implements Controller {
  private readonly createSession: CreateSession;

  constructor(createSession: CreateSession) {
    this.createSession = createSession;
  }

  public async handle(request: HttpRequest): Promise<HttpResponse> {
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
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        token,
      },
    };
  }
}
