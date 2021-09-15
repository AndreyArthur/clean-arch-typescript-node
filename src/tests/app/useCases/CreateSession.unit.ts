import { LoginFailedError, MissingFieldsError } from '@/application/exceptions';
import { EncrypterProvider } from '@/application/providers';
import { SessionsRepository, UsersRepository } from '@/application/repositories';
import { CreateSessionUseCase } from '@/application/useCases';
import { EncrypterAdapter } from '@/infra/adapters';
import { SessionsRepositoryMemory, UsersRepositoryMemory } from '@/infra/repositories';
import { data } from '@/infra/sources';
import { generators, verifiers } from '@/tests/helpers';

type SetupComponents = {
  usersRepository: UsersRepository;
  sessionsRepository: SessionsRepository;
  encrypter: EncrypterProvider;
  createSession: CreateSessionUseCase;
};

const setup = (): SetupComponents => {
  const usersRepository = new UsersRepositoryMemory();
  const sessionsRepository = new SessionsRepositoryMemory();
  const encrypter = new EncrypterAdapter();
  const createSession = new CreateSessionUseCase({
    repositories: {
      users: usersRepository,
      sessions: sessionsRepository,
    },
    providers: {
      encrypter,
    },
  });

  return {
    usersRepository,
    sessionsRepository,
    encrypter,
    createSession,
  };
};

describe('CreateSession UseCase', () => {
  afterEach(() => {
    data.users = [];
    data.sessions = [];
  });

  it('should create a Session successfully', async () => {
    const { encrypter, usersRepository, createSession } = setup();
    const username = generators.username();
    const password = generators.password();

    jest.spyOn(usersRepository, 'findByUsername').mockReturnValueOnce(
      Promise.resolve(generators.user({
        username,
        password: await encrypter.hash(password),
      })),
    );

    const { user, token } = await createSession.execute({
      username,
      password,
    });

    expect(verifiers.isUser(user)).toBe(true);
    expect(verifiers.isSha256(token)).toBe(true);
  });

  it('should fail because User not exists', async () => {
    const { createSession } = setup();

    try {
      await createSession.execute({
        username: generators.username(),
        password: generators.password(),
      });

      throw null;
    } catch (err) {
      expect(err instanceof LoginFailedError).toBe(true);
    }
  });

  it('should fail because fields are missing', async () => {
    const { createSession } = setup();

    try {
      await createSession.execute({
        username: '',
        password: '',
      });

      throw null;
    } catch (err) {
      expect(err instanceof MissingFieldsError).toBe(true);
    }

    try {
      await createSession.execute({
        username: generators.username(),
        password: '',
      });

      throw null;
    } catch (err) {
      expect(err instanceof MissingFieldsError).toBe(true);
    }

    try {
      await createSession.execute({
        username: '',
        password: generators.password(),
      });

      throw null;
    } catch (err) {
      expect(err instanceof MissingFieldsError).toBe(true);
    }
  });

  it('should fail because User password is wrong', async () => {
    const { usersRepository, createSession } = setup();
    const username = generators.username();

    jest.spyOn(usersRepository, 'findByUsername').mockReturnValueOnce(
      Promise.resolve(generators.user({
        username,
      })),
    );

    try {
      await createSession.execute({
        username,
        password: generators.password(),
      });

      throw null;
    } catch (err) {
      expect(err instanceof LoginFailedError).toBe(true);
    }
  });
});
