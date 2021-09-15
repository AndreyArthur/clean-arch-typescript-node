import { VerifySessionTokenService } from '@/application/services';
import { User } from '@/core/entities';
import { HttpRequest, Plugin } from '@/presentation/protocols';

export class VerifySessionTokenPlugin implements Plugin<User> {
  private readonly verifySessionToken: VerifySessionTokenService;

  constructor(verifySessionToken: VerifySessionTokenService) {
    this.verifySessionToken = verifySessionToken;
  }

  public async intercept(request: HttpRequest): Promise<User> {
    const token = request.headers['session-token'];
    const user = await this.verifySessionToken.execute(token);

    return user;
  }
}
