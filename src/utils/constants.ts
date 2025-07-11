import type { Album } from '@/models/album';
import type { Artist } from '@/models/artist';

export const DEFAULT_CACHE_TTL_SEC = 600;

export const CACHE_KEYS = {
  homepageData: 'homepageData',
  albumData(albumId: Album['id']) {
    return `album-${albumId}`;
  },
  artistData(artistId: Artist['id']) {
    return `artist-${artistId}`;
  }
} as const;
