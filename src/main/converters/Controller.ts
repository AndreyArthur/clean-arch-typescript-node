import { RequestHandler, Response, Request } from 'express';

import { Controller } from '@/presentation/protocols';
import { ExceptionHandlerController } from '@/presentation/controllers';
import { VerifySessionTokenPluginFactory } from '@/infra/factories';

export class ControllerConverter {
  public static convert(controller: Controller): RequestHandler {
    return async (req: Request, res: Response): Promise<Response> => {
      try {
        const auth = VerifySessionTokenPluginFactory.create().intercept;

        const response = await controller.handle({
          body: req.body,
          headers: req.headers,
          plugins: {
            auth,
          },
        });

        return res.status(response.status).send(response.body);
      } catch (err) {
        const response = await new ExceptionHandlerController()
          .handle({ body: err, headers: req.headers });

        return res.status(response.status).send(response.body);
      }
    };
  }
}
