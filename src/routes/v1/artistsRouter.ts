import { Router } from 'express';

import { ENDPOINTS } from '@/config';
import { artistDataController } from '@/controllers';

const artistsRouter = Router();

artistsRouter.get(ENDPOINTS.artists, artistDataController);

export { artistsRouter };
