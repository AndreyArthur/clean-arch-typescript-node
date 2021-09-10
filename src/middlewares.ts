import { Request, Response, NextFunction} from 'express';

import { date } from '@/helpers/date';
import { data } from '@/sources/index';

export const ensureAuthenticated = (
  req: Request, res: Response, next: NextFunction
) => {
  const authorization = req.headers['session-token'];

  if (!authorization) {
    return res.status(401).send({
      name: 'MissingTokenError',
      message: 'You need to be authenticated to access this feature.',
    });
  }

  const session = data.sessions.find((currentSession) => (
    currentSession.token === authorization
  ));

  if (!session) {
    return res.status(401).send({
      name: 'InvalidTokenError',
      message: 'Your token is invalid or it was never created.',
    });
  }

  if (date.utc().getTime() >= session.expirationTime) {
    return res.status(401).send({
      name: 'ExpiredTokenError',
      message: 'Your token is expired, please create a new session.',
    });
  }

  const user = data.users.find((currentUser) => (
    currentUser.id = session.userId
  ));

  if (!user) {
    return res.status(401).send({
      name: 'MissingUserError',
      message: 'The user that has created this token does not exists or was never created.',
    });
  }

  (req as any).user = user;

  next();
};
