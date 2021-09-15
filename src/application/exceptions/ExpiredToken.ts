import { AppError } from '@/application/exceptions/App';

export class ExpiredTokenError extends AppError {
  constructor() {
    super({
      type: 'authorization',
      name: 'ExpiredTokenError',
      message: 'Your token is expired, please create a new session.',
    });
  }
}
