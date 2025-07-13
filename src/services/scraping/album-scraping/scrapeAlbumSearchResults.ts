import { load } from 'cheerio';

import { albumSearchResultSchema, type AlbumSearchResult } from '@/models/album';

export const scrapeAlbumSearchResults = (stringifiedHtml: string) => {
  const albumSearchResults: Partial<AlbumSearchResult>[] = [];

  const $ = load(stringifiedHtml);

  const albumElementsContainer = $('.col-xs-12')[$('.col-xs-12').length - 1];
  if (albumElementsContainer) {
    const albumElements = $('.collection-item a', albumElementsContainer);
    albumElements.each((_, element) => {
      const albumElement = $(element);

      if (!albumElement.attr('href')?.includes('album')) return;

      const id = albumElement.attr('href')?.slice(8);
      const title = albumElement.text().trim();

      const album = {
        id,
        title
      };

      albumSearchResults.push(album);
    });
  }

  return albumSearchResultSchema.array().parse(albumSearchResults);
};
