type ErrorType = 'authorization' | 'validation';

export class AppError {
  public readonly type: ErrorType;

  public readonly name: string;

  public readonly message: string;

  constructor({ type, name, message }: AppError) {
    this.type = type;
    this.name = name;
    this.message = message;
  }
}
