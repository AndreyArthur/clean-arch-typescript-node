import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { CreateUser } from '@/core/useCases';
import { UserView } from '@/presentation/views';

export class CreateUserController implements Controller {
  private readonly createUser: CreateUser;

  constructor(createUser: CreateUser) {
    this.createUser = createUser;
  }

  public async handle(request: HttpRequest): Promise<HttpResponse<UserView>> {
    const { username, password } = request.body;

    const { password: _p, ...user } = await this.createUser.execute({
      username,
      password,
    });

    return {
      status: 201,
      body: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  }
}
