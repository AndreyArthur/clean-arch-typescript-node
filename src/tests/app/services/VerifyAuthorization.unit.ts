import {
  ExpiredTokenError, InvalidTokenError, MissingTokenError, MissingUserError,
} from '@/application/exceptions';
import { SessionsRepository, UsersRepository } from '@/application/repositories';
import { VerifyAuthorizationService } from '@/application/services';
import { uuid } from '@/infra/helpers';
import { SessionsRepositoryMemory, UsersRepositoryMemory } from '@/infra/repositories';
import { data } from '@/infra/sources';
import { generators, verifiers } from '@/tests/helpers';

type SetupComponents = {
  sessionsRepository: SessionsRepository;
  usersRepository: UsersRepository;
  verifyAuthorization: VerifyAuthorizationService;
};

const setup = (): SetupComponents => {
  const sessionsRepository = new SessionsRepositoryMemory();
  const usersRepository = new UsersRepositoryMemory();
  const verifyAuthorization = new VerifyAuthorizationService({
    repositories: {
      sessions: sessionsRepository,
      users: usersRepository,
    },
  });

  return {
    sessionsRepository,
    usersRepository,
    verifyAuthorization,
  };
};

describe('VerifyAuthorization Service', () => {
  afterEach(() => {
    data.users = [];
    data.sessions = [];
  });

  it('should get success returning an User object', async () => {
    const { verifyAuthorization, sessionsRepository, usersRepository } = setup();
    const token = generators.sha256();
    const createdUser = generators.user();

    jest.spyOn(sessionsRepository, 'findByToken').mockReturnValueOnce(
      Promise.resolve(generators.session({
        userId: createdUser.id,
        token,
      })),
    );
    jest.spyOn(sessionsRepository, 'verifyExpirationById').mockReturnValueOnce(
      Promise.resolve(false),
    );
    jest.spyOn(usersRepository, 'findById').mockReturnValueOnce(
      Promise.resolve(createdUser),
    );

    const user = await verifyAuthorization.execute(token);

    expect(verifiers.isUser(user)).toBe(true);
  });

  it('should fail because token is missing', async () => {
    const { verifyAuthorization } = setup();

    try {
      await verifyAuthorization.execute('');

      throw null;
    } catch (err) {
      expect(err instanceof MissingTokenError).toBe(true);
    }
  });

  it('should fail because token has no Session in data', async () => {
    const { verifyAuthorization } = setup();

    try {
      await verifyAuthorization.execute(generators.sha256());

      throw null;
    } catch (err) {
      expect(err instanceof InvalidTokenError).toBe(true);
    }
  });

  it('should fail because token Session is expired', async () => {
    const { verifyAuthorization, sessionsRepository } = setup();
    const token = generators.sha256();
    const createdUser = generators.user();

    jest.spyOn(sessionsRepository, 'findByToken').mockReturnValueOnce(
      Promise.resolve(generators.session({
        userId: createdUser.id,
        token,
      })),
    );
    jest.spyOn(sessionsRepository, 'verifyExpirationById').mockReturnValueOnce(
      Promise.resolve(true),
    );

    try {
      await verifyAuthorization.execute(token);

      throw null;
    } catch (err) {
      expect(err instanceof ExpiredTokenError).toBe(true);
    }
  });

  it('should fail because Session has no User in data', async () => {
    const { verifyAuthorization, sessionsRepository, usersRepository } = setup();
    const token = generators.sha256();

    jest.spyOn(sessionsRepository, 'findByToken').mockReturnValueOnce(
      Promise.resolve(generators.session({
        userId: uuid.v4(),
        token,
      })),
    );
    jest.spyOn(sessionsRepository, 'verifyExpirationById').mockReturnValueOnce(
      Promise.resolve(false),
    );
    jest.spyOn(usersRepository, 'findById').mockReturnValueOnce(
      Promise.resolve(null),
    );

    try {
      await verifyAuthorization.execute(token);

      throw null;
    } catch (err) {
      expect(err instanceof MissingUserError).toBe(true);
    }
  });
});
