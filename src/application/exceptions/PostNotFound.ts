import { AppError } from '@/application/exceptions/App';

export class PostNotFoundError extends AppError {
  constructor() {
    super({
      type: 'authorization',
      name: 'PostNotFoundError',
      message: 'Post not found or deleted.',
    });
  }
}
