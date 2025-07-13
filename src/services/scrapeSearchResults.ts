import { load } from 'cheerio';

import { albumSearchResultSchema, type AlbumSearchResult } from '@/models/album';
import { artistSearchResultSchema, type ArtistSearchResult } from '@/models/artist';
import type { Track } from '@/models/track';

import { scrapeTrackData } from './scrapeTrackData';

export const scrapeSearchResults = (stringifiedHtml: string) => {
  const $ = load(stringifiedHtml);

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

  const albums: AlbumSearchResult[] = [];

  const albumElementsContainer = $('.col-xs-12')[$('.col-xs-12').length - 1];
  if (albumElementsContainer) {
    const albumElements = $('.collection-item a', albumElementsContainer);
    albumElements.each((_, element) => {
      const albumElement = $(element);

      if (!albumElement.attr('href')?.includes('album')) return;

      const id = albumElement.attr('href')?.slice(8);
      if (!id) return;

      const title = albumElement.text().trim();

      const album = albumSearchResultSchema.parse({
        id,
        title
      });
      albums.push(album);
    });
  }

  const artists: ArtistSearchResult[] = [];

  const artistElements = $('.artist-item a');
  artistElements.each((_, element) => {
    const artistElement = $(element);

    const id = artistElement.attr('href')?.slice(8);
    if (!id) return;

    const name = artistElement.text().trim();

    const artist = artistSearchResultSchema.parse({
      id,
      name
    });
    artists.push(artist);
  });

  return {
    tracks,
    albums,
    artists
  };
};
