import { load } from 'cheerio';

import { getArtistPageHtml } from '@/external-api';
import { artistSchema, type Artist } from '@/models/artist';

import { scrapeAlbumCards } from '../album-scraping/scrapeAlbumCards';
import { scrapeTracks } from '../track-scraping/scrapeTracks';

export const scrapeArtistPage = async (artistId: Artist['id'], stringifiedHtml: string) => {
  const $ = load(stringifiedHtml);

  const name = $('.page__title').text().trim().slice(0, -12);
  const imageSrc = $('img.artist-image').attr('src');

  const tracks = scrapeTracks(stringifiedHtml);
  const albumCards = scrapeAlbumCards(stringifiedHtml);

  /* In case the artist has many tracks, there are multiple pages for them,
   * we must scrape them all to get all the tracks.
  */
  const navigationButtons = $('div[role=\'navigation\'] .btn');
  const artistPagesCount = parseInt(
    $(navigationButtons.get(navigationButtons.length - 2)).text()
  ) || 1;

  const artistPageFetchPromises: ReturnType<typeof getArtistPageHtml>[] = [];

  if (artistPagesCount > 1)  {
    for (let artistPage = 2; artistPage <= artistPagesCount; artistPage++) {
      artistPageFetchPromises.push(getArtistPageHtml(artistId, artistPage));
    }

    const artistPagesHtml = await Promise.all(artistPageFetchPromises);
    artistPagesHtml.forEach(artistPageHtml => {
      const moreTracks = scrapeTracks(artistPageHtml);
      tracks.push(...moreTracks);
    });
  }

  return artistSchema.parse({
    id: artistId,
    name,
    imageSrc,
    tracks,
    albumCards
  });
};
