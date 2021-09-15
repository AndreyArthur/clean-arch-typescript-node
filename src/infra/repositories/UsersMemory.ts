import { User } from '@/core/entities';
import { date, uuid } from '@/infra/helpers';
import {
  UsersRepository, UsersRepositoryCreateDTO,
} from '@/application/repositories';
import { data } from '@/infra/sources';

export class UsersRepositoryMemory implements UsersRepository {
  public create({ username, password }: UsersRepositoryCreateDTO): User {
    return {
      id: uuid.v4(),
      username,
      password,
      createdAt: date.utc(),
      updatedAt: date.utc(),
    };
  }

  public async save(user: User): Promise<void> {
    await Promise.resolve(data.users.push(user));
  }

  public async findByUsername(username: string): Promise<User | null> {
    const foundUser = await Promise.resolve(
      data.users.find((user) => username === user.username),
    );

    if (!foundUser) return null;

    return foundUser;
  }

  public async findById(id: string): Promise<User | null> {
    const foundUser = await Promise.resolve(
      data.users.find((user) => id === user.id),
    );

    if (!foundUser) return null;

    return foundUser;
  }
}
