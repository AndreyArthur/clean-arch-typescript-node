import bcrypt from 'bcrypt';

import { User } from '@/entities';
import { LoginFailedError, MissingFieldsError } from '@/exceptions';
import { data } from '@/sources';
import { date, string, uuid } from '@/helpers';

type CreateSessionDTO = {
  username: string;
  password: string;
};

type CreateSessionResult = {
  user: User;
  token: string;
};

export class CreateSessionService {
  public async execute(
    { username, password }: CreateSessionDTO,
  ): Promise<CreateSessionResult> {
    if (!username || !password) {
      throw new MissingFieldsError('username', 'password');
    }

    const user = data.users.find((currentUser) => (
      currentUser.username === username
    ));

    if (!user) throw new LoginFailedError();

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) throw new LoginFailedError();

    data.sessions = data.sessions.filter((currentSession) => (
      currentSession.userId !== user.id
    ));

    const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

    const session = {
      id: uuid.v4(),
      userId: user.id,
      token: string.sha256(),
      expirationTime: date.utc().getTime() + ONE_DAY_IN_MILLISECONDS,
    };

    data.sessions.push(session);

    return {
      user,
      token: session.token,
    };
  }
}
