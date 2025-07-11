import type { Album } from '@/models/album';

import { api } from '../api';
import { API_ENDPOINTS } from '../endpoints';

export const getAlbumPageHtml = async (albumId: Album['id']) => {
  return await api.get(API_ENDPOINTS.album(albumId)).text();
};
