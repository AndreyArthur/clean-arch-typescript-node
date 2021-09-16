import { RequestHandler, Response, Request } from 'express';

import { Controller } from '@/presentation/protocols';
import { ExceptionHandlerController } from '@/presentation/controllers';
import { authPlugin } from '@/infra/factories';

export class ControllerConverter {
  public static convert(controller: Controller): RequestHandler {
    return async (req: Request, res: Response): Promise<Response> => {
      try {
        const response = await controller.handle({
          body: req.body,
          headers: req.headers,
          params: req.params,
        },
        {
          auth: authPlugin,
        });

        return res.status(response.status).send(response.body);
      } catch (err) {
        const response = await new ExceptionHandlerController()
          .handle({ body: err, headers: req.headers, params: req.params });

        return res.status(response.status).send(response.body);
      }
    };
  }
}
