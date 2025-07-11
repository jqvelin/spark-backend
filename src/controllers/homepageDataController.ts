import { getTrackPermissions } from '@/external-api';
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
    const { tracks, albums } = await scrapeHomepageData();

    const trackIds = tracks.map((track) => track.id);
    const trackPermissions = await getTrackPermissions(trackIds);
    const allowedTracks = tracks.filter(track => {
      const trackPermission = trackPermissions.find(permissionForTrack => permissionForTrack.id === track.id);
      return (trackPermission?.downloadable && trackPermission?.playable);
    });

    const homepageData = {
      tracks: allowedTracks,
      albums
    };

    cache.set(CACHE_KEYS.homepageData, homepageData);
    res.json(homepageData);

    return;
  } catch {
    res.status(500).send('Could not get the homepage data');
  }
};
