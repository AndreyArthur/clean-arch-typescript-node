import { UserModel } from '@/application/models';
import {
  PluginInterceptor, HttpResponse, HttpRequest,
} from '@/presentation/protocols';

export type ControllerPlugins = {
  auth: PluginInterceptor<UserModel>;
};

export interface Controller {
  handle: (
    request: HttpRequest, plugins?: ControllerPlugins
  ) => Promise<HttpResponse>;
}
