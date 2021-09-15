import { User } from '@/core/entities';

export type UsersRepositoryCreateDTO = {
  username: string;
  password: string;
};

export interface UsersRepository {
  create: ({ username, password }: UsersRepositoryCreateDTO) => User;
  save: (user: User) => Promise<void>;
  findByUsername: (username: string) => Promise<User | null>;
  findById: (id: string) => Promise<User | null>;
}
