import { User } from '@/core/entities';

export type CreateSessionDTO = {
  username: string;
  password: string;
};

export type CreateSessionResult = {
  user: User;
  token: string;
};

export interface CreateSession {
  execute: (
    { username, password }: CreateSessionDTO
  ) => Promise<CreateSessionResult>;
}
