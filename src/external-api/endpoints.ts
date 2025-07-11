import type { Album } from '@/models/album';

export const API_ENDPOINTS = {
  homepage: '',
  artist(artistId: string) {
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
