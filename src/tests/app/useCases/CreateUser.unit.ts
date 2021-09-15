import { MissingFieldsError, UserExistsError } from '@/application/exceptions';
import { EncrypterProvider } from '@/application/providers';
import { UsersRepository } from '@/application/repositories';
import { CreateUserUseCase } from '@/application/useCases';
import { EncrypterAdapter } from '@/infra/adapters';
import { UsersRepositoryMemory } from '@/infra/repositories';
import { data } from '@/infra/sources';
import { generators, verifiers } from '@/tests/helpers';

type SetupComponents = {
  usersRepository: UsersRepository;
  encrypter: EncrypterProvider;
  createUser: CreateUserUseCase;
};

const setup = (): SetupComponents => {
  const usersRepository = new UsersRepositoryMemory();
  const encrypter = new EncrypterAdapter();
  const createUser = new CreateUserUseCase({
    repositories: {
      users: usersRepository,
    },
    providers: {
      encrypter,
    },
  });

  return {
    usersRepository,
    encrypter,
    createUser,
  };
};

describe('CreateUser UseCase', () => {
  afterEach(() => { data.users = []; });

  it('should create an User successfully', async () => {
    const { createUser } = setup();

    const user = await createUser.execute({
      username: generators.username(),
      password: generators.password(),
    });

    expect(verifiers.isUser(user)).toBe(true);
  });

  it('should fail because fields are missing', async () => {
    const { createUser } = setup();

    try {
      await createUser.execute({
        username: '',
        password: '',
      });
    } catch (err) {
      expect(err instanceof MissingFieldsError).toBe(true);
    }

    try {
      await createUser.execute({
        username: generators.username(),
        password: '',
      });
    } catch (err) {
      expect(err instanceof MissingFieldsError).toBe(true);
    }

    try {
      await createUser.execute({
        username: '',
        password: generators.password(),
      });
    } catch (err) {
      expect(err instanceof MissingFieldsError).toBe(true);
    }
  });

  it('should fail because user already exists', async () => {
    const { usersRepository, createUser } = setup();
    const username = generators.username();

    jest.spyOn(usersRepository, 'findByUsername').mockReturnValueOnce(
      Promise.resolve(generators.user({ username })),
    );

    try {
      await createUser.execute({
        username,
        password: generators.password(),
      });
    } catch (err) {
      expect(err instanceof UserExistsError).toBe(true);
    }
  });
});
