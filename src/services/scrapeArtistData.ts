import { load } from 'cheerio';

import { getArtistPageHtml } from '@/external-api';
import type { Album } from '@/models/album';
import { artistSchema, type Artist } from '@/models/artist';
import type { Track } from '@/models/track';

import { scrapeAlbumData } from './scrapeAlbumData';
import { scrapeTrackData } from './scrapeTrackData';

export const scrapeArtistData = async (artistId: Artist['id'], stringifiedHtml: string) => {
  const $ = load(stringifiedHtml);

  const name = $('.page__title').text().trim().slice(0, -12);
  const imageSrc = $('img.artist-image').attr('src');

  const tracks: Track[] = [];
  const trackElements = $('.playlist .track.song-item');

  trackElements.each((_, element) => {
    const trackElement = $(element).html();

    if (trackElement) {
      try {
        const track = scrapeTrackData(trackElement);
        tracks.push(track);
      } catch {
        const trackElementStringifiedPart = trackElement.trim().slice(0, 100);
        console.log(`Could not scrape a track element: ${trackElementStringifiedPart}...`);
      }
    }
  });

  const albums: Album[] = [];
  const albumElements = $('.d-sm-block .album-card');

  albumElements.each((_, element) => {
    const albumElement = $(element).html();

    if (albumElement) {
      try {
        const album = scrapeAlbumData(albumElement);
        const albumId = $('.album-card__image', albumElement).attr('href')?.slice(8);

        if (albumId) {
          albums.push({
            ...album,
            id: albumId
          });
        }
      } catch {
        const albumElementStringifiedPart = albumElement.trim().slice(0, 100);
        console.log(`Could not scrape an album element: ${albumElementStringifiedPart}...`);
      }
    }
  });

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
      const $$ = load(artistPageHtml);

      const trackElements = $$('.playlist .track.song-item');
      trackElements.each((_, element) => {
        const trackElement = $$(element).html();

        if (trackElement) {
          try {
            const track = scrapeTrackData(trackElement);
            tracks.push(track);
          } catch {
            const trackElementStringifiedPart = trackElement.trim().slice(0, 100);
            console.log(`Could not scrape a track element: ${trackElementStringifiedPart}...`);
          }
        }
      });
    });
  }

  return artistSchema.parse({
    id: artistId,
    name,
    imageSrc,
    tracks,
    albums
  });
};
