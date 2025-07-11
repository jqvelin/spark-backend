import type { Album } from '@/models/album';
import type { Artist } from '@/models/artist';

export const API_ENDPOINTS = {
  homepage: '',
  artist(artistId: Artist['id']) {
    return `artist/${artistId}`;
  },
  album(albumId: Album['id']) {
    return `albums/${albumId}`;
  },
  searchResults(searchQuery: string) {
    return `search?q=${searchQuery}`;
  },
  trackPermissions: 'song_permissions'
} as const;
