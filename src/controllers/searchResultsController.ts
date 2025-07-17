import { getPermittedTracks, getSearchResultsPageHtml } from '@/external-api';
import { scrapeSearchResults } from '@/services/scraping';
import { cache, CACHE_KEYS } from '@/utils';

import type { Request, Response } from 'express';

export const searchResultsController = async (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query || typeof query !== 'string') {
    res.status(400).send('Search query is not set');
    return;
  }

  const cachedSearchResults = cache.get(CACHE_KEYS.searchResults(query));
  if (cachedSearchResults) {
    res.json(cachedSearchResults);
    return;
  }

  try {
    const searchResultsPageHtml = await getSearchResultsPageHtml(query);
    const { tracks, albums, artists } = await scrapeSearchResults(searchResultsPageHtml);
    const permittedTracks = await getPermittedTracks(tracks);

    const searchResults = {
      tracks: permittedTracks,
      albums,
      artists
    };

    cache.set(CACHE_KEYS.searchResults(query), searchResults);
    res.json(searchResults);
  } catch {
    res.status(500).send(`Could not get search results for the query: ${query}`);
  }
};
