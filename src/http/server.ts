import { app } from '@/http';

export const server = {
  start: (port?: number): void => {
    app.listen(port || 3333);
  },
};
