import { User } from '@/core/entities';
import {
  LoginFailedError, MissingFieldsError,
} from '@/application/exceptions';
import {
  SessionsRepository, UsersRepository,
} from '@/application/repositories';
import {
  EncrypterProvider,
} from '@/application/providers';

type CreateSessionDTO = {
  username: string;
  password: string;
};

type CreateSessionResult = {
  user: User;
  token: string;
};

type CreateSessionDeps = {
  repositories: {
    sessions: SessionsRepository;
    users: UsersRepository;
  };
  providers: {
    encrypter: EncrypterProvider;
  }
};

export class CreateSessionService {
  private readonly usersRepository: UsersRepository;

  private readonly sessionsRepository: SessionsRepository;

  private readonly encrypter: EncrypterProvider;

  constructor(deps: CreateSessionDeps) {
    this.usersRepository = deps.repositories.users;
    this.sessionsRepository = deps.repositories.sessions;
    this.encrypter = deps.providers.encrypter;
  }

  public async execute(
    { username, password }: CreateSessionDTO,
  ): Promise<CreateSessionResult> {
    if (!username || !password) {
      throw new MissingFieldsError('username', 'password');
    }

    const user = await this.usersRepository.findByUsername(username);

    if (!user) throw new LoginFailedError();

    const isCorrectPassword = await this.encrypter.compare(
      password, user.password,
    );

    if (!isCorrectPassword) throw new LoginFailedError();

    await this.sessionsRepository.deleteUserSession(user.id);

    const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
    const session = this.sessionsRepository.create({
      userId: user.id,
      expiresIn: ONE_DAY_IN_MILLISECONDS,
    });

    await this.sessionsRepository.save(session);

    return {
      user,
      token: session.token,
    };
  }
}
