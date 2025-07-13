import { load } from 'cheerio';

import { getHomepageHtml } from '@/external-api';
import type { HomepageTrackCategories } from '@/models/track';

import { scrapeAlbumCards } from './album-scraping/scrapeAlbumCards';
import { scrapeTracks } from './track-scraping/scrapeTracks';

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

  const freshTracks = scrapeTracks(homepage, fresh);
  trackCategories.fresh = freshTracks;

  const bestOfTodayTracks = scrapeTracks(homepage, bestOfToday);
  trackCategories.bestOfToday = bestOfTodayTracks;

  const trendingWorldwideTracks = scrapeTracks(homepage, trendingWorldwide);
  trackCategories.trendingWorldwide = trendingWorldwideTracks;

  const trendingInRussiaTracks = scrapeTracks(homepage, trendingInRussia);
  trackCategories.trendingInRussia = trendingInRussiaTracks;

  const albumCards = scrapeAlbumCards(homepage);

  return {
    trackCategories,
    albumCards
  };
};
