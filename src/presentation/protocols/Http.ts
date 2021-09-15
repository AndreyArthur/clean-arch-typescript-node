import { User } from '@/core/entities';
import { PluginInterceptor } from '@/presentation/protocols';

export type HttpRequest = {
  body: any;
  headers: any;
  plugins?: {
    auth: PluginInterceptor<User>;
  };
};

export type HttpResponse<T = any> = {
  status: number;
  body: T;
};
