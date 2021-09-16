import { UserModel } from '@/application/models';
import { date, uuid } from '@/infra/helpers';
import {
  UsersRepository, UsersRepositoryCreateDTO,
} from '@/application/repositories';
import { data } from '@/infra/sources';

export class UsersRepositoryMemory implements UsersRepository {
  public create({ username, password }: UsersRepositoryCreateDTO): UserModel {
    return {
      id: uuid.v4(),
      username,
      password,
      createdAt: date.utc(),
      updatedAt: date.utc(),
    };
  }

  public async save(user: UserModel): Promise<void> {
    await Promise.resolve(data.users.push(user));
  }

  public async findByUsername(username: string): Promise<UserModel | null> {
    const foundUser = await Promise.resolve(
      data.users.find((user) => username === user.username),
    );

    if (!foundUser) return null;

    return foundUser;
  }

  public async findById(id: string): Promise<UserModel | null> {
    const foundUser = await Promise.resolve(
      data.users.find((user) => id === user.id),
    );

    if (!foundUser) return null;

    return foundUser;
  }
}
