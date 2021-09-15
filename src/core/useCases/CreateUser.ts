import { User } from '@/core/entities';

export type CreateUserDTO = {
  username: string;
  password: string;
};

export interface CreateUser {
  execute: ({ username, password }: CreateUserDTO) => Promise<User>;
}
