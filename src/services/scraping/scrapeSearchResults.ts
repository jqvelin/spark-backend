import { scrapeAlbums } from './album-scraping/scrapeAlbums';
import { scrapeArtists } from './artist-scraping/scrapeArtists';
import { scrapeTracks } from './track-scraping/scrapeTracks';

export const scrapeSearchResults = async (stringifiedHtml: string) => {
  const tracks = scrapeTracks(stringifiedHtml);
  const [artists, albums] = await Promise.all([
    scrapeArtists(stringifiedHtml),
    scrapeAlbums(stringifiedHtml)
  ]);

  return {
    tracks,
    albums,
    artists
  };
};
