import { AppError } from '@/application/exceptions/App';

export class InvalidTokenError extends AppError {
  constructor() {
    super({
      type: 'authorization',
      name: 'InvalidTokenError',
      message: 'Your token is invalid or it was never created.',
    });
  }
}
