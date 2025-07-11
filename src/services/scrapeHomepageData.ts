import { load } from 'cheerio';

import { getHomepageHtml } from '@/external-api';
import type { Album } from '@/models/album';
import type { HomepageTrackCategories } from '@/models/track';

import { scrapeAlbumData } from './scrapeAlbumData';
import { scrapeTrackData } from './scrapeTrackData';

export const scrapeHomepageData = async () => {
  const homepage = await getHomepageHtml();
  const $ = load(homepage);

  /*
   * Scraping all the tracks from the homepage and grouping them up by category
  */
  const trackCategories: HomepageTrackCategories = {
    fresh: [],
    bestOfToday: [],
    trendingWorldwide: [],
    trendingInRussia: []
  };

  const [fresh, bestOfToday, trendingWorldwide, trendingInRussia] = $('.playlist');

  // Scraping tracks from the "Fresh" category
  $('.track', fresh).each((_, element) => {
    const trackElement = $(element).html();

    if (trackElement) {
      try {
        const track = scrapeTrackData(trackElement);
        trackCategories.fresh.push(track);
      } catch {
        const trackElementStringifiedPart = trackElement.trim().slice(0, 100);
        console.log(`Could not scrape a track element: ${trackElementStringifiedPart}...`);
      }
    }
  });

  // Scraping tracks from the "Best of Today" category
  $('.track', bestOfToday).each((_, element) => {
    const trackElement = $(element).html();

    if (trackElement) {
      try {
        const track = scrapeTrackData(trackElement);
        trackCategories.bestOfToday.push(track);
      } catch {
        const trackElementStringifiedPart = trackElement.trim().slice(0, 100);
        console.log(`Could not scrape a track element: ${trackElementStringifiedPart}...`);
      }
    }
  });

  // Scraping tracks from the "Trending Worldwide" category
  $('.track', trendingWorldwide).each((_, element) => {
    const trackElement = $(element).html();

    if (trackElement) {
      try {
        const track = scrapeTrackData(trackElement);
        trackCategories.trendingWorldwide.push(track);
      } catch {
        const trackElementStringifiedPart = trackElement.trim().slice(0, 100);
        console.log(`Could not scrape a track element: ${trackElementStringifiedPart}...`);
      }
    }
  });

  // Scraping tracks from the "Trending in Russia" category
  $('.track', trendingInRussia).each((_, element) => {
    const trackElement = $(element).html();

    if (trackElement) {
      try {
        const track = scrapeTrackData(trackElement);
        trackCategories.trendingInRussia.push(track);
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
    trackCategories,
    albums
  };
};
