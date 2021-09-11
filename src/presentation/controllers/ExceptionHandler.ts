import {
  Controller, HttpRequest, HttpResponse,
} from '@/presentation/protocols';

export class ExceptionHandlerController implements Controller {
  public async handle(request: HttpRequest): Promise<HttpResponse> {
    const { type, name, message } = request.body;

    const errorResponse = (status: number): HttpResponse => ({
      status,
      body: {
        type,
        name,
        message,
      },
    });

    if (type === 'validation') {
      return errorResponse(400);
    }

    if (type === 'authorization') {
      return errorResponse(401);
    }

    return {
      status: 500,
      body: {
        type: 'unexpected',
        name: 'InternalServerError',
        message: 'An internal server error has occured, try again later.',
      },
    };
  }
}
