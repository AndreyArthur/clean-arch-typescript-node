import {
  ExpiredTokenError, InvalidTokenError, MissingTokenError, MissingUserError,
} from '@/application/exceptions';
import { SessionsRepository, UsersRepository } from '@/application/repositories';
import { VerifySessionTokenService } from '@/application/services';
import { uuid } from '@/infra/helpers';
import { SessionsRepositoryMemory, UsersRepositoryMemory } from '@/infra/repositories';
import { data } from '@/infra/sources';
import { generators, verifiers } from '@/tests/helpers';

type SetupComponents = {
  sessionsRepository: SessionsRepository;
  usersRepository: UsersRepository;
  verifySessionToken: VerifySessionTokenService;
};

const setup = (): SetupComponents => {
  const sessionsRepository = new SessionsRepositoryMemory();
  const usersRepository = new UsersRepositoryMemory();
  const verifySessionToken = new VerifySessionTokenService({
    repositories: {
      sessions: sessionsRepository,
      users: usersRepository,
    },
  });

  return {
    sessionsRepository,
    usersRepository,
    verifySessionToken,
  };
};

describe('VerifySessionToken Service', () => {
  afterEach(() => {
    data.users = [];
    data.sessions = [];
  });

  it('should get success returning an User object', async () => {
    const { verifySessionToken, sessionsRepository, usersRepository } = setup();
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

    const user = await verifySessionToken.execute(token);

    expect(verifiers.isUser(user)).toBe(true);
  });

  it('should fail because token is missing', async () => {
    const { verifySessionToken } = setup();

    try {
      await verifySessionToken.execute('');

      throw null;
    } catch (err) {
      expect(err instanceof MissingTokenError).toBe(true);
    }
  });

  it('should fail because token has no Session in data', async () => {
    const { verifySessionToken } = setup();

    try {
      await verifySessionToken.execute(generators.sha256());

      throw null;
    } catch (err) {
      expect(err instanceof InvalidTokenError).toBe(true);
    }
  });

  it('should fail because token Session is expired', async () => {
    const { verifySessionToken, sessionsRepository } = setup();
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
      await verifySessionToken.execute(token);

      throw null;
    } catch (err) {
      expect(err instanceof ExpiredTokenError).toBe(true);
    }
  });

  it('should fail because Session has no User in data', async () => {
    const { verifySessionToken, sessionsRepository, usersRepository } = setup();
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
      await verifySessionToken.execute(token);

      throw null;
    } catch (err) {
      expect(err instanceof MissingUserError).toBe(true);
    }
  });
});
