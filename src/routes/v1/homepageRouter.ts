import { Router } from 'express';

import { ENDPOINTS } from '@/config';
import { homepageDataController } from '@/controllers';

const homepageRouter = Router();

homepageRouter.get(ENDPOINTS.homepage, homepageDataController);

export { homepageRouter };
