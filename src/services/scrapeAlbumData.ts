import { load } from 'cheerio';

import { albumSchema, type Album } from '@/models/album';
import type { Track } from '@/models/track';

import { scrapeTrackData } from './scrapeTrackData';

export const scrapeAlbumData = (stringifiedHtml: string) => {
  const $ = load(stringifiedHtml);
  const albumCardId = $('a.album-card__image').attr('href')?.slice(8);

  // Checking if it's an album card that should lead to the album page, so there is no need to fetch it's content
  if (albumCardId) {
    const coverSrc = $('img.album-card__image').attr('src')?.replace('350x100', '100x100');
    const title = $('.album-card__title').text().trim();
    const artist = $('.album-card__author a').text().trim();
    const artistId = $('.album-card__author a').attr('href')?.slice(8).trim();

    return albumSchema.parse({
      id: albumCardId,
      coverSrc,
      title,
      tracks: [],
      genres: [],
      artist,
      artistId
    });
  }

  const title = $('.page__title.page__title_album').text().trim();
  const artist = $('.same-artist__item a').text().trim();
  const artistId = $('.same-artist__item a')?.attr('href')?.slice(8).trim();
  const coverSrc = $('img.page__img').attr('src')?.replace('350x100', '400x400');

  /*
  * Parsing album tracks
  */
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

  /*
  * Parsing album genres
  */
  const genreElements = $('.badge-item.badge-item_artist');
  const genres: Album['genres'] = [];
  genreElements.each((_, element) => {
    genres.push($(element).text());
  });

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
