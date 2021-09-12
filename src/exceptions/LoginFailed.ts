import { AppError } from '@/exceptions/App';

export class LoginFailedError extends AppError {
  constructor() {
    super({
      type: 'authorization',
      name: 'LoginFailedError',
      message: 'Incorrect username/password combination.',
    });
  }
}
