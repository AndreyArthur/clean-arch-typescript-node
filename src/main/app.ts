import express from 'express';

import { router } from '@/main/routes';

const app = express();

app.use(express.json());
router(app);

export { app };
