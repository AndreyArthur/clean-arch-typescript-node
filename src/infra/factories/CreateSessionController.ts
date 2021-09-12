import { EncrypterAdapter } from '@/infra/adapters';
import { SessionsRepositoryMemory, UsersRepositoryMemory } from '@/infra/repositories';
import { CreateSessionController } from '@/presentation/controllers';
import { CreateSessionUseCase } from '@/application/useCases';

export class CreateSessionControllerFactory {
  public static create(): CreateSessionController {
    const usersRepository = new UsersRepositoryMemory();
    const sessionsRepository = new SessionsRepositoryMemory();
    const encrypter = new EncrypterAdapter();
    const createSessionUseCase = new CreateSessionUseCase({
      repositories: {
        users: usersRepository,
        sessions: sessionsRepository,
      },
      providers: {
        encrypter,
      },
    });
    const createSessionController = new CreateSessionController(
      createSessionUseCase,
    );

    return createSessionController;
  }
}
