import { EncrypterAdapter } from '@/infra/adapters';
import { SessionsRepositoryMemory, UsersRepositoryMemory } from '@/infra/repositories';
import { CreateSessionController } from '@/presentation/controllers';
import { CreateSessionService } from '@/application/services';

export class CreateSessionControllerFactory {
  public static create(): CreateSessionController {
    const usersRepository = new UsersRepositoryMemory();
    const sessionsRepository = new SessionsRepositoryMemory();
    const encrypter = new EncrypterAdapter();
    const createSessionService = new CreateSessionService({
      repositories: {
        users: usersRepository,
        sessions: sessionsRepository,
      },
      providers: {
        encrypter,
      },
    });
    const createSessionController = new CreateSessionController(
      createSessionService,
    );

    return createSessionController;
  }
}
