import { app } from '@/main/app';

export const server = {
  start: (port?: number): void => {
    app.listen(port || 3333);
  },
};
