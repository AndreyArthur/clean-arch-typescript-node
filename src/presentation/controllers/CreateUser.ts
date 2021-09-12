import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { CreateUserService } from '@/application/services';

export class CreateUserController implements Controller {
  private readonly createUser: CreateUserService;

  constructor(createUser: CreateUserService) {
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
