import express from 'express';

import { router } from '@/http/routes';

const app = express();

app.use(express.json());
router(app);

export { app };
