import { Router } from 'express';

import { ENDPOINTS } from '@/config';
import { albumDataController } from '@/controllers';

const albumsRouter = Router();

albumsRouter.get(ENDPOINTS.albums, albumDataController);

export { albumsRouter };
