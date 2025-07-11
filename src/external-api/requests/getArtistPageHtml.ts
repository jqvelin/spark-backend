import type { Artist } from '@/models/artist';

import { api } from '../api';
import { API_ENDPOINTS } from '../endpoints';

export const getArtistPageHtml = async (artistId: Artist['id']) => {
  return await api.get(API_ENDPOINTS.artist(artistId)).text();
};
