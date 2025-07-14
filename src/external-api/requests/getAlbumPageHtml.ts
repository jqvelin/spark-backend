import type { Album } from '@/models/album';

import { dataApi } from '../dataApi';
import { DATA_API_ENDPOINTS } from '../endpoints';

export const getAlbumPageHtml = async (albumId: Album['id']) => {
  return await dataApi.get(DATA_API_ENDPOINTS.album(albumId)).text();
};
