import { CreateUserController } from '@/presentation/controllers';
import { CreateUserService } from '@/services';

export class CreateUserControllerFactory {
  public static create(): CreateUserController {
    const createUserService = new CreateUserService();
    const createUserController = new CreateUserController(createUserService);

    return createUserController;
  }
}
