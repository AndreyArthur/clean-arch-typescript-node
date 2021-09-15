export type HttpRequest = {
  body: any;
  headers: any;
};

export type HttpResponse<T = any> = {
  status: number;
  body: T;
};
