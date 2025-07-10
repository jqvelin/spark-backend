export const API_ENDPOINTS = {
  homepage: '',
  artist(artistId: string) {
    return `artist/${artistId}`;
  },
  album(albumId: string) {
    return `albums/${albumId}`;
  },
  searchResults(searchQuery: string) {
    return `search?q=${searchQuery}`;
  }
} as const;
