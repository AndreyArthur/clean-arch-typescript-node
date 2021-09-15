import { VerifySessionTokenUseCase } from '@/application/useCases';
import { User } from '@/core/entities';
import { HttpRequest, Plugin } from '@/presentation/protocols';

export class VerifySessionTokenPlugin implements Plugin<User> {
  private readonly verifySessionToken: VerifySessionTokenUseCase;

  constructor(verifySessionToken: VerifySessionTokenUseCase) {
    this.verifySessionToken = verifySessionToken;
  }

  public async intercept(request: HttpRequest): Promise<User> {
    const token = request.headers['session-token'];
    const user = await this.verifySessionToken.execute(token);

    return user;
  }
}
