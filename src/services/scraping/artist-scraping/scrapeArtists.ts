import { load } from 'cheerio';

import { getArtistPageHtml } from '@/external-api';
import { artistSchema, type Artist } from '@/models/artist';

import { scrapeArtistPage } from './scrapeArtistPage';

export const scrapeArtists = async (stringifiedHtml: string) => {
  const $ = load(stringifiedHtml);

  const artistElements = $('.artist-item a');
  const artistIds: Artist['id'][] = [];
  const artistPagePromises: Promise<string>[] = [];

  artistElements.each((_, element) => {
    const artistElement = $(element);

    const artistId = artistElement.attr('href')?.slice(8);
    if (!artistId) return;
    artistIds.push(artistId);

    artistPagePromises.push(getArtistPageHtml(artistId));
  });

  const artistPages = await Promise.all(artistPagePromises);
  const artistPromises: Promise<Artist>[] = [];
  artistPages.forEach(async (artistPage, artistPageIndex) => {
    const artistId = artistIds[artistPageIndex];
    if (!artistId) return;

    artistPromises.push(scrapeArtistPage(artistId, artistPage));
  });

  const artists = await Promise.all(artistPromises);

  return artistSchema.array().parse(artists);
};
