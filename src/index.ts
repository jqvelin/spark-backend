import cors from 'cors';
import express from 'express';

import { env } from '@/config';
import { homepageRouter } from '@/routes/v1';

const app = express();
app.use(cors());

app.use('/v1', homepageRouter);

app.listen(env.PORT, () => console.log(`Running on port ${env.PORT}`));
