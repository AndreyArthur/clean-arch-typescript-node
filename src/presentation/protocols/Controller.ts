import { User } from '@/core/entities';
import {
  PluginInterceptor, HttpResponse, HttpRequest,
} from '@/presentation/protocols';

export type ControllerPlugins = {
  auth: PluginInterceptor<User>;
};

export interface Controller {
  handle: (
    request: HttpRequest, plugins?: ControllerPlugins
  ) => Promise<HttpResponse>;
}
