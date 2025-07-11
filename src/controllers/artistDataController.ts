import { HTTPError } from 'ky';

import { getArtistPageHtml, getTrackPermissions } from '@/external-api';
import { scrapeArtistData } from '@/services';
import { cache, CACHE_KEYS } from '@/utils';

import type { Request, Response } from 'express';

export const artistDataController = async (req: Request, res: Response) => {
  const { artistId } = req.params;
  if (!artistId) {
    res.status(400).send('Artist ID is not set');
    return;
  }

  const cachedArtistData = cache.get(CACHE_KEYS.artistData(artistId));
  if (cachedArtistData) {
    res.json(cachedArtistData);
    return;
  }

  try {
    const artistPageHtml = await getArtistPageHtml(artistId);
    const { tracks, ...artist } = scrapeArtistData(artistPageHtml);

    const trackIds = tracks.map(track => track.id);
    const trackPermissions = await getTrackPermissions(trackIds);
    const tracksWithPermissions = tracks.filter(track => {
      const trackPermission = trackPermissions.find(permissionForTrack => permissionForTrack.id === track.id);
      return trackPermission?.playable && trackPermission.downloadable;
    });

    const artistData = {
      id: artistId,
      ...artist,
      tracks: tracksWithPermissions
    };

    cache.set(CACHE_KEYS.artistData(artistId), artistData);
    res.json(artistData);
  } catch (e) {
    if (e instanceof HTTPError) {
      res.status(e.response.status).send(
        `Artist data request failed with status code ${e.response.status}: ${e.response.statusText}`
      );
      return;
    }

    res.status(500).send('Could not get artist data');
  }
};
