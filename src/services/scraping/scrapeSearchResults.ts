import { scrapeAlbumSearchResults } from './album-scraping/scrapeAlbumSearchResults';
import { scrapeArtistSearchResults } from './artist-scraping/scrapeArtistSearchResults';
import { scrapeTracks } from './track-scraping/scrapeTracks';

export const scrapeSearchResults = (stringifiedHtml: string) => {
  const trackSearchResults = scrapeTracks(stringifiedHtml);
  const albumSearchResults = scrapeAlbumSearchResults(stringifiedHtml);
  const artistSearchResults = scrapeArtistSearchResults(stringifiedHtml);

  return {
    trackSearchResults,
    albumSearchResults,
    artistSearchResults
  };
};
