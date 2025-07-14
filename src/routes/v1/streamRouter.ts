import { Router } from 'express';

import { ENDPOINTS } from '@/config';
import { streamController } from '@/controllers';

const streamRouter = Router();

streamRouter.get(ENDPOINTS.stream, streamController);

export { streamRouter };
