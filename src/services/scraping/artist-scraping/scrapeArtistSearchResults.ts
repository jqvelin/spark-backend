import { load } from 'cheerio';

import { artistSearchResultSchema, type ArtistSearchResult } from '@/models/artist';

export const scrapeArtistSearchResults = (stringifiedHtml: string) => {
  const artistSearchResults: ArtistSearchResult[] = [];

  const $ = load(stringifiedHtml);

  const artistElements = $('.artist-item a');
  artistElements.each((_, element) => {
    const artistElement = $(element);

    const id = artistElement.attr('href')?.slice(8);
    if (!id) return;

    const name = artistElement.text().trim();

    const artist = {
      id,
      name
    };

    artistSearchResults.push(artist);
  });

  return artistSearchResultSchema.array().parse(artistSearchResults);
};
