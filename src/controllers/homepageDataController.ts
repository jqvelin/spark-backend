import { getPermittedTracks } from '@/external-api';
import type { HomepageTrackCategories } from '@/models/track';
import { scrapeHomepageData } from '@/services/scraping';
import { cache, CACHE_KEYS } from '@/utils';

import type { Request, Response } from 'express';

export const homepageDataController = async (_: Request, res: Response) => {
  const cachedHomepageData = cache.get(CACHE_KEYS.homepageData);
  if (cachedHomepageData) {
    res.json(cachedHomepageData);
    return;
  }

  try {
    const { trackCategories, albums } = await scrapeHomepageData();

    const permittedTrackCategories: HomepageTrackCategories = {
      fresh: [],
      bestOfToday: [],
      trendingWorldwide: [],
      trendingInRussia: []
    };

    for (let i = 0; i < Object.values(trackCategories).length; i++) {
      const categoryTracks = Object.values(trackCategories)[i];

      if (categoryTracks) {
        const permittedCategoryTracks = await getPermittedTracks(categoryTracks);
        const category = Object.keys(permittedTrackCategories)[i] as keyof HomepageTrackCategories;
        permittedTrackCategories[category] = permittedCategoryTracks;
      }
    }

    const homepageData = {
      trackCategories: permittedTrackCategories,
      albums
    };

    cache.set(CACHE_KEYS.homepageData, homepageData);
    res.json(homepageData);
  } catch {
    res.status(500).send('Could not get the homepage data');
  }
};
