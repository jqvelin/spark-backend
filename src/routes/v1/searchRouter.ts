import { Router } from 'express';

import { ENDPOINTS } from '@/config';
import { searchResultsController } from '@/controllers';

const searchRouter = Router();

searchRouter.get(ENDPOINTS.search, searchResultsController);

export { searchRouter };
