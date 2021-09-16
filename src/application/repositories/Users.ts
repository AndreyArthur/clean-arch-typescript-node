import { UserModel } from '@/application/models';

export type UsersRepositoryCreateDTO = {
  username: string;
  password: string;
};

export interface UsersRepository {
  create: ({ username, password }: UsersRepositoryCreateDTO) => UserModel;
  save: (user: UserModel) => Promise<void>;
  findByUsername: (username: string) => Promise<UserModel | null>;
  findById: (id: string) => Promise<UserModel | null>;
}
