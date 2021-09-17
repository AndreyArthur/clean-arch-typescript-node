import express from 'express';

import { router } from '@/main/routes';
import { graphql } from '@/main/graphql';

const app = express();

app.use(express.json());
router(app);
graphql(app);

export { app };
