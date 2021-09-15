import { Session } from '@/core/entities';
import {
  SessionsRepository, SessionsRepositoryCreateDTO,
} from '@/application/repositories';
import { date, string, uuid } from '@/infra/helpers';
import { data } from '@/infra/sources';

export class SessionsRepositoryMemory implements SessionsRepository {
  public create({ userId, expiresIn }: SessionsRepositoryCreateDTO): Session {
    return {
      id: uuid.v4(),
      userId,
      expirationTime: date.utc().getTime() + expiresIn,
      token: string.sha256(),
    };
  }

  public async save(session: Session): Promise<void> {
    await Promise.resolve(data.sessions.push(session));
  }

  public async deleteUserSession(userId: string): Promise<void> {
    data.posts = await Promise.resolve(
      data.posts.filter((session) => session.userId !== userId),
    );
  }

  public async findByToken(token: string): Promise<Session | null> {
    const foundSession = await Promise.resolve(
      data.sessions.find((session) => session.token === token),
    );

    if (!foundSession) return null;

    return foundSession;
  }

  public async verifyExpirationById(id: string): Promise<boolean> {
    const foundSession = await Promise.resolve(
      data.sessions.find((session) => session.id === id),
    );

    if (!foundSession) throw new Error('User not found.');

    const isExpired = date.utc().getTime() > foundSession.expirationTime;

    return isExpired;
  }
}
