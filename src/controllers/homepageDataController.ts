import { scrapeHomepageData } from '@/services';
import { cache, CACHE_KEYS } from '@/utils';

import type { Request, Response } from 'express';

export const homepageDataController = async (_: Request, res: Response) => {
  const cachedHomepageData = cache.get(CACHE_KEYS.homepageData);
  if (cachedHomepageData) {
    res.json(cachedHomepageData);
    return;
  }

  try {
    const homepageData = await scrapeHomepageData();
    cache.set(CACHE_KEYS.homepageData, homepageData);
    res.json(homepageData);

    return;
  } catch {
    res.status(500).send('Could not get the homepage data');
  }
};
