import { VerifyAuthorizationService } from '@/application/services';
import { UserModel } from '@/application/models';
import { HttpRequest, Plugin } from '@/presentation/protocols';

export class VerifyAuthorizationPlugin implements Plugin<UserModel> {
  private readonly verifyAuthorization: VerifyAuthorizationService;

  constructor(verifyAuthorization: VerifyAuthorizationService) {
    this.verifyAuthorization = verifyAuthorization;
  }

  public async intercept(request: HttpRequest): Promise<UserModel> {
    const token = request.headers['session-token'];
    const user = await this.verifyAuthorization.execute(token);

    return user;
  }
}
