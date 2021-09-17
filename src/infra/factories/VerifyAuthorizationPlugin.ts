import { VerifyAuthorizationService } from '@/application/services';
import { VerifyAuthorizationPlugin } from '@/presentation/plugins';
import {
  SessionsRepositoryMemory, UsersRepositoryMemory,
} from '@/infra/repositories';
import { HttpRequest, PluginInterceptor } from '@/presentation/protocols';
import { UserModel } from '@/application/models';

export class VerifyAuthorizationPluginFactory {
  public static create(): VerifyAuthorizationPlugin {
    const usersRepository = new UsersRepositoryMemory();
    const sessionsRepository = new SessionsRepositoryMemory();
    const verifyAuthorizationService = new VerifyAuthorizationService({
      repositories: {
        users: usersRepository,
        sessions: sessionsRepository,
      },
    });
    const verifyAuthorizationPlugin = new VerifyAuthorizationPlugin(
      verifyAuthorizationService,
    );

    return verifyAuthorizationPlugin;
  }
}

export const authPlugin: PluginInterceptor<UserModel> = (
  request: HttpRequest,
) => VerifyAuthorizationPluginFactory.create().intercept(request);
