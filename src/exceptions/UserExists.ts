import { AppError } from '@/exceptions/App';

export class UserExistsError extends AppError {
  constructor() {
    super({
      type: 'authorization',
      name: 'UserExistsError',
      message: 'User already exists.',
    });
  }
}
