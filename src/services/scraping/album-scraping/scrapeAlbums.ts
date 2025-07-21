import { load, type Cheerio } from 'cheerio';

import { getAlbumPageHtml } from '@/external-api';
import { albumSchema, type Album } from '@/models/album';

import { scrapeAlbumPage } from './scrapeAlbumPage';

import type { AnyNode } from 'domhandler';

export const scrapeAlbums = async (stringifiedHtml: string) => {
  const $ = load(stringifiedHtml);

  const albums: Album[] = [];

  let albumElements: Cheerio<AnyNode>;
  const albumIds: Album['id'][] = [];
  const albumPagePromises: Promise<string>[] = [];

  const isSearchResultsPage = $('.search-results-page').length > 0;
  if (isSearchResultsPage) {
    const albumElementsContainer = $('.col-xs-12')[$('.col-xs-12').length - 1];

    // Filtering albums from the so called "collections", coming from the api
    albumElements = $('.collection-item a[href^="/albums"]', albumElementsContainer);

    albumElements.each((_, element) => {
      const albumId = $(element).attr('href')?.slice(8);
      if (!albumId) return;
      albumIds.push(albumId);
      albumPagePromises.push(getAlbumPageHtml(albumId));
    });
  } else {
    // Home or artist page
    const wrapperSelector = '.d-sm-block';
    const doesWrapperExist = $(wrapperSelector).length !== 0;
    const albumCardElementsSelector = doesWrapperExist ? `${wrapperSelector} .album-card` : '.album-card';
    albumElements = $(albumCardElementsSelector);

    albumElements.each((_, element) => {
      const albumId = $('a.album-card__image', element).attr('href')?.slice(8);
      if (!albumId) return;
      albumIds.push(albumId);
      albumPagePromises.push(getAlbumPageHtml(albumId));
    });
  }

  const albumPages = await Promise.all(albumPagePromises);

  albumPages.forEach((albumPage, albumPageIndex) => {
    const album = scrapeAlbumPage(albumPage);
    const albumId = albumIds[albumPageIndex];

    if (!albumId) return;

    albums.push({
      id: albumId,
      ...album
    });
  });

  return albumSchema.array().parse(albums);
};
