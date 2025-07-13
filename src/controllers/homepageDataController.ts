import { getTrackPermissions } from '@/external-api';
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
    const { trackCategories, albumCards } = await scrapeHomepageData();

    const allowedTrackCategories: HomepageTrackCategories = {
      fresh: [],
      bestOfToday: [],
      trendingWorldwide: [],
      trendingInRussia: []
    };

    const trackIds = Object.values(trackCategories).flatMap((category) => {
      return category.map(track => track.id);
    });
    const trackPermissions = await getTrackPermissions(trackIds);

    for (let i = 0; i < Object.values(trackCategories).length; i++) {
      const categoryTracks = Object.values(trackCategories)[i];

      const allowedCategoryTracks = categoryTracks?.filter(track => {
        const trackPermission = trackPermissions.find(permissionForTrack => permissionForTrack.id === track.id);
        return trackPermission?.playable && trackPermission.downloadable;
      });

      allowedTrackCategories[Object.keys(allowedTrackCategories)[i] as keyof HomepageTrackCategories] = allowedCategoryTracks ?? [];
    }


    const homepageData = {
      trackCategories: allowedTrackCategories,
      albumCards
    };

    cache.set(CACHE_KEYS.homepageData, homepageData);
    res.json(homepageData);
  } catch {
    res.status(500).send('Could not get the homepage data');
  }
};
