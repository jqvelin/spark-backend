export const ENDPOINTS = {
  homepage: '/homepage',
  albums: '/albums/:albumId',
  artists: '/artists/:artistId',
  download: '/download/:trackId',
  search: '/search',
  stream: '/stream/:trackId'
} as const;
