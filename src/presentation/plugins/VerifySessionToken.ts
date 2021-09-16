import { VerifySessionTokenService } from '@/application/services';
import { UserModel } from '@/application/models';
import { HttpRequest, Plugin } from '@/presentation/protocols';

export class VerifySessionTokenPlugin implements Plugin<UserModel> {
  private readonly verifySessionToken: VerifySessionTokenService;

  constructor(verifySessionToken: VerifySessionTokenService) {
    this.verifySessionToken = verifySessionToken;
  }

  public async intercept(request: HttpRequest): Promise<UserModel> {
    const token = request.headers['session-token'];
    const user = await this.verifySessionToken.execute(token);

    return user;
  }
}
