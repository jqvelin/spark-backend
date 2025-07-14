import type { Album } from '@/models/album';
import type { Artist } from '@/models/artist';
import type { Track } from '@/models/track';

export const DATA_API_ENDPOINTS = {
  homepage: '',
  artist(artistId: Artist['id'], artistPageNumber?: number) {
    if (artistPageNumber) {
      return `artist/${artistId}?page=${artistPageNumber}`;
    }

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

export const STREAMING_API_ENDPOINTS = {
  stream(trackId: Track['id']) {
    return `online/${trackId}.mp3`;
  }
};
