import { Controller } from '@/presentation/protocols';
import { ExceptionHandlerController } from '@/presentation/controllers';
import { authPlugin } from '@/infra/factories';

export class GraphQLResolverControllerConverter {
  public static convert(controller: Controller): any {
    return async (_: any, args: any, context: any): Promise<any> => {
      try {
        const response = await controller.handle({
          body: args,
          headers: context.req.headers,
        },
        {
          auth: authPlugin,
        });

        return response.body;
      } catch (err) {
        const response = await new ExceptionHandlerController()
          .handle({ body: err, headers: context.req.headers });

        throw new Error(JSON.stringify(response.body));
      }
    };
  }
}
