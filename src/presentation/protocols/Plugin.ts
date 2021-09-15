import { HttpRequest } from '@/presentation/protocols';

export type PluginInterceptor<T = any> = (request: HttpRequest) => Promise<T>;

export interface Plugin<T = any> {
  intercept: PluginInterceptor<T>;
}
