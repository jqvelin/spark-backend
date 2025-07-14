import type { Artist } from '@/models/artist';

import { dataApi } from '../dataApi';
import { DATA_API_ENDPOINTS } from '../endpoints';

export const getArtistPageHtml = async (artistId: Artist['id'], artistPageNumber?: number) => {
  return await dataApi.get(DATA_API_ENDPOINTS.artist(artistId, artistPageNumber)).text();
};
