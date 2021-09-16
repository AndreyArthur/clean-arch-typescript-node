import { SessionModel } from '@/application/models';

export type SessionsRepositoryCreateDTO = {
  userId: string;
  expiresIn: number;
};

export interface SessionsRepository {
  create: ({ userId, expiresIn }: SessionsRepositoryCreateDTO) => SessionModel;
  save: (session: SessionModel) => Promise<void>;
  deleteUserSession: (userId: string) => Promise<void>;
  findByToken: (token: string) => Promise<SessionModel | null>;
  verifyExpirationById: (id: string) => Promise<boolean>;
}
