import type { Album } from '@/models/album';

export const DEFAULT_CACHE_TTL_SEC = 600;

export const CACHE_KEYS = {
  homepageData: 'homepageData',
  albumData(albumId: Album['id']) {
    return `album-${albumId}`;
  }
} as const;
