import bcrypt from 'bcrypt';

import { date, uuid } from '@/helpers';
import { data } from '@/sources';
import { User } from '@/entities';

type CreateUserDTO = {
  username: string;
  password: string;
};

export class CreateUserService {
  public async execute({ username, password }: CreateUserDTO): Promise<User> {
    if (!username || !password) {
      throw {
        type: 'validation',
        name: 'MissingFieldsError',
        message: 'Fields \'username\' and \'password\' are required.',
      };
    }

    const userExists = data.users.find((currentUser) => (
      currentUser.username === username
    ));

    if (userExists) {
      throw {
        type: 'authorization',
        name: 'UserExistsError',
        message: 'User already exists.',
      };
    }

    const user = {
      id: uuid.v4(),
      username,
      password: await bcrypt.hash(password, 10),
      createdAt: date.utc(),
      updatedAt: date.utc(),
    };

    data.users.push(user);

    return user;
  }
}
