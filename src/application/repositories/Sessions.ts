import { Session } from '@/core/entities';

export type SessionsRepositoryCreateDTO = {
  userId: string;
  expiresIn: number;
};

export interface SessionsRepository {
  create: ({ userId, expiresIn }: SessionsRepositoryCreateDTO) => Session;
  save: (session: Session) => Promise<void>;
  deleteUserSession: (userId: string) => Promise<void>;
  findByToken: (token: string) => Promise<Session | null>;
  verifyExpirationById: (id: string) => Promise<boolean>;
}
