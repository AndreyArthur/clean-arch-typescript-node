import { VerifySessionTokenUseCase } from '@/application/useCases';
import { VerifySessionTokenPlugin } from '@/presentation/plugins';
import {
  SessionsRepositoryMemory, UsersRepositoryMemory,
} from '@/infra/repositories';

export class VerifySessionTokenPluginFactory {
  public static create(): VerifySessionTokenPlugin {
    const usersRepository = new UsersRepositoryMemory();
    const sessionsRepository = new SessionsRepositoryMemory();
    const verifySessionTokenUseCase = new VerifySessionTokenUseCase({
      repositories: {
        users: usersRepository,
        sessions: sessionsRepository,
      },
    });
    const verifySessionTokenPlugin = new VerifySessionTokenPlugin(
      verifySessionTokenUseCase,
    );

    return verifySessionTokenPlugin;
  }
}
