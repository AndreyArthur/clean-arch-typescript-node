import { EncrypterAdapter } from '@/infra/adapters';
import { UsersRepositoryMemory } from '@/infra/repositories';
import { CreateUserController } from '@/presentation/controllers';
import { CreateUserUseCase } from '@/application/useCases';

export class CreateUserControllerFactory {
  public static create(): CreateUserController {
    const usersRepository = new UsersRepositoryMemory();
    const encrypter = new EncrypterAdapter();
    const createUserUseCase = new CreateUserUseCase({
      providers: {
        encrypter,
      },
      repositories: {
        users: usersRepository,
      },
    });
    const createUserController = new CreateUserController(createUserUseCase);

    return createUserController;
  }
}
