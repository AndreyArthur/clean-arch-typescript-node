import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { CreateUserService } from '@/services';

export class CreateUserController implements Controller {
  public async handle(request: HttpRequest): Promise<HttpResponse> {
    const { username, password } = request.body;

    const { password: _p, ...user } = await new CreateUserService().execute({
      username,
      password,
    });

    return {
      status: 201,
      body: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  }
}
