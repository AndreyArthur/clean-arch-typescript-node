export type HttpRequest = {
  body: any;
};

export type HttpResponse<T = any> = {
  status: number;
  body: T;
};
