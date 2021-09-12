import { Session } from '@/entities';
import { SessionsRepository, SessionsRepositoryCreateDTO } from '@/repositories';
import { date, string, uuid } from '@/helpers';
import { data } from '@/sources';

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
}
