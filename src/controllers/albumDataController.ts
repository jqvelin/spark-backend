import { HTTPError } from 'ky';

import { getAlbumPageHtml, getTrackPermissions } from '@/external-api';
import { scrapeAlbumPage } from '@/services/scraping';
import { cache, CACHE_KEYS } from '@/utils';

import type { Request, Response } from 'express';

export const albumDataController = async (req: Request, res: Response) => {
  const { albumId } = req.params;
  if (!albumId) {
    res.status(400).send('Album ID is not set');
    return;
  }

  const cachedAlbumData = cache.get(CACHE_KEYS.albumData(albumId));
  if (cachedAlbumData) {
    res.json(cachedAlbumData);
    return;
  }

  try {
    const albumPageHtml = await getAlbumPageHtml(albumId);
    const { tracks, ...album } = scrapeAlbumPage(albumPageHtml);

    const trackIds = tracks.map(track => track.id);
    const trackPermissions = await getTrackPermissions(trackIds);
    const tracksWithPermissions = tracks.filter(track => {
      const trackPermission = trackPermissions.find(permissionForTrack => permissionForTrack.id === track.id);
      return trackPermission?.playable && trackPermission.downloadable;
    });

    const albumData = {
      id: albumId,
      ...album,
      tracks: tracksWithPermissions
    };

    cache.set(CACHE_KEYS.albumData(albumId), albumData);
    res.json(albumData);
  } catch (e) {
    if (e instanceof HTTPError) {
      res.status(e.response.status).send(
        `Album data request failed with status code ${e.response.status}: ${e.response.statusText}`
      );
      return;
    }

    res.status(500).send('Could not get album data');
  }
};
