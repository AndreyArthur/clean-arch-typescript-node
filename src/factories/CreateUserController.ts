import { EncrypterAdapter } from '@/infra/adapters';
import { UsersRepositoryMemory } from '@/infra/repositories';
import { CreateUserController } from '@/presentation/controllers';
import { CreateUserService } from '@/services';

export class CreateUserControllerFactory {
  public static create(): CreateUserController {
    const usersRepository = new UsersRepositoryMemory();
    const encrypter = new EncrypterAdapter();
    const createUserService = new CreateUserService({
      providers: {
        encrypter,
      },
      repositories: {
        users: usersRepository,
      },
    });
    const createUserController = new CreateUserController(createUserService);

    return createUserController;
  }
}
