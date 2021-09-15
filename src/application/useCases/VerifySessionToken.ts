import { User } from '@/core/entities';
import {
  SessionsRepository, UsersRepository,
} from '@/application/repositories';
import {
  ExpiredTokenError,
  InvalidTokenError,
  MissingTokenError,
  MissingUserError,
} from '@/application/exceptions';

type VerifySessionTokenDeps = {
  repositories: {
    users: UsersRepository;
    sessions: SessionsRepository;
  }
};

export class VerifySessionTokenUseCase {
  private readonly usersRepository: UsersRepository;

  private readonly sessionsRepository: SessionsRepository;

  constructor(deps: VerifySessionTokenDeps) {
    this.sessionsRepository = deps.repositories.sessions;
    this.usersRepository = deps.repositories.users;
  }

  public async execute(token: string): Promise<User> {
    if (!token) throw new MissingTokenError();

    const session = await this.sessionsRepository.findByToken(token);

    if (!session) throw new InvalidTokenError();

    const isExpired = await this.sessionsRepository.verifyExpirationById(
      session.id,
    );

    if (isExpired) throw new ExpiredTokenError();

    const user = await this.usersRepository.findById(session.userId);

    if (!user) throw new MissingUserError();

    return user;
  }
}
