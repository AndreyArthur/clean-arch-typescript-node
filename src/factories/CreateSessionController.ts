import { CreateSessionController } from '@/presentation/controllers';
import { CreateSessionService } from '@/services';

export class CreateSessionControllerFactory {
  public static create(): CreateSessionController {
    const createSessionService = new CreateSessionService();
    const createSessionController = new CreateSessionController(
      createSessionService,
    );

    return createSessionController;
  }
}
