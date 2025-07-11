import { load } from 'cheerio';

import type { Album } from '@/models/album';
import { artistSchema } from '@/models/artist';
import type { Track } from '@/models/track';

import { scrapeAlbumData } from './scrapeAlbumData';
import { scrapeTrackData } from './scrapeTrackData';

export const scrapeArtistData = (stringifiedHtml: string) => {
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

  // Id is not present in DOM, but comes from the parental method
  return artistSchema.omit({
    id: true
  }).parse({
    name,
    imageSrc,
    tracks,
    albums
  });
};
