import { AppError } from '@/application/exceptions/App';

export class MissingUserError extends AppError {
  constructor() {
    super({
      type: 'authorization',
      name: 'MissingUserError',
      message: 'The user that has created this token does not exists or was never created.',
    });
  }
}
