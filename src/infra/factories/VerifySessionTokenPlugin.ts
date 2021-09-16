import { VerifySessionTokenService } from '@/application/services';
import { VerifySessionTokenPlugin } from '@/presentation/plugins';
import {
  SessionsRepositoryMemory, UsersRepositoryMemory,
} from '@/infra/repositories';
import { HttpRequest, PluginInterceptor } from '@/presentation/protocols';
import { UserModel } from '@/application/models';

export class VerifySessionTokenPluginFactory {
  public static create(): VerifySessionTokenPlugin {
    const usersRepository = new UsersRepositoryMemory();
    const sessionsRepository = new SessionsRepositoryMemory();
    const verifySessionTokenService = new VerifySessionTokenService({
      repositories: {
        users: usersRepository,
        sessions: sessionsRepository,
      },
    });
    const verifySessionTokenPlugin = new VerifySessionTokenPlugin(
      verifySessionTokenService,
    );

    return verifySessionTokenPlugin;
  }
}

export const authPlugin: PluginInterceptor<UserModel> = (
  request: HttpRequest,
) => VerifySessionTokenPluginFactory.create().intercept(request);
