import { load } from 'cheerio';

import { getHomepageHtml } from '@/external-api';
import type { Album } from '@/models/album';
import type { Track } from '@/models/track';

import { scrapeAlbumData } from './scrapeAlbumData';
import { scrapeTrackData } from './scrapeTrackData';

export const scrapeHomepageData = async () => {
  const homepage = await getHomepageHtml();
  const $ = load(homepage);

  /*
   * Scraping all the tracks from the homepage
  */
  const tracks: Track[] = [];

  $('.track').each((_, element) => {
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
   * Scraping all the albums from the homepage
  */
  const albums: Omit<Album, 'id'>[] = [];

  $('.album-card').each((_, element) => {
    const albumElement = $(element).html();

    if (albumElement) {
      try {
        const album = scrapeAlbumData(albumElement);
        albums.push(album);
      } catch {
        const albumElementStringifiedPart = albumElement.trim().slice(0, 100);
        console.log(`Could not scrape an album element: ${albumElementStringifiedPart}...`);
      }
    }
  });

  return {
    tracks,
    albums
  };
};
