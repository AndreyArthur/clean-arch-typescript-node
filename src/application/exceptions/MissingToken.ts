import { AppError } from '@/application/exceptions/App';

export class MissingTokenError extends AppError {
  constructor() {
    super({
      type: 'authorization',
      name: 'MissingTokenError',
      message: 'You need to be authenticated to access this feature.',
    });
  }
}
