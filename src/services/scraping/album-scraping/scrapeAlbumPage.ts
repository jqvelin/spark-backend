import { load } from 'cheerio';

import { albumSchema } from '@/models/album';

import { scrapeAlbumGenres } from './scrapeAlbumGenres';
import { scrapeTracks } from '../track-scraping/scrapeTracks';

export const scrapeAlbumPage = (stringifiedHtml: string) => {
  const $ = load(stringifiedHtml);

  const title = $('.page__title.page__title_album').text().trim();
  const artist = $('.same-artist__item a').first().text().trim();
  const artistId = $('.same-artist__item a')?.attr('href')?.slice(8).trim();
  const coverSrc = $('img.page__img').attr('src')?.replace('350x100', '400x400');

  const tracks = scrapeTracks(stringifiedHtml);
  const genres = scrapeAlbumGenres(stringifiedHtml);

  return albumSchema.omit({
    id: true
  }).parse({
    title,
    artist,
    artistId,
    coverSrc,
    tracks,
    genres
  });
};
