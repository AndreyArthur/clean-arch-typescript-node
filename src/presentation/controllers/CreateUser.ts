import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { CreateUser } from '@/core/useCases';

export class CreateUserController implements Controller {
  private readonly createUser: CreateUser;

  constructor(createUser: CreateUser) {
    this.createUser = createUser;
  }

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    const { username, password } = request.body;

    const { password: _p, ...user } = await this.createUser.execute({
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
