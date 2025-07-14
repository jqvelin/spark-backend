import { Router } from 'express';

import { ENDPOINTS } from '@/config';
import { downloadController } from '@/controllers';

const downloadRouter = Router();

downloadRouter.get(ENDPOINTS.download, downloadController);

export { downloadRouter };
