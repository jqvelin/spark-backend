import { load } from 'cheerio';

import type { Album } from '@/models/album';

export const scrapeAlbumGenres = (stringifiedHtml: string) => {
  const genres: Album['genres'] = [];

  const $ = load(stringifiedHtml);

  const genreElements = $('.badge-item.badge-item_artist');
  genreElements.each((_, element) => {
    genres.push($(element).text());
  });

  return genres;
};
