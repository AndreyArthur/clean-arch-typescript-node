import { User } from '@/core/entities';
import { MissingFieldsError, UserExistsError } from '@/application/exceptions';
import { UsersRepository } from '@/application/repositories';
import { EncrypterProvider } from '@/application/providers';

type CreateUserDTO = {
  username: string;
  password: string;
};

type CreateUserDeps = {
  repositories: {
    users: UsersRepository;
  };
  providers: {
    encrypter: EncrypterProvider;
  };
};

export class CreateUserService {
  private readonly usersRepository: UsersRepository;

  private readonly encrypter: EncrypterProvider;

  constructor(deps: CreateUserDeps) {
    this.usersRepository = deps.repositories.users;
    this.encrypter = deps.providers.encrypter;
  }

  public async execute({ username, password }: CreateUserDTO): Promise<User> {
    if (!username || !password) {
      throw new MissingFieldsError('username', 'password');
    }

    const userExists = await this.usersRepository.findByUsername(username);

    if (userExists) throw new UserExistsError();

    const user = this.usersRepository.create({
      username,
      password: await this.encrypter.hash(password),
    });

    await this.usersRepository.save(user);

    return user;
  }
}
