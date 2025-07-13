import { load } from 'cheerio';

import { albumCardSchema, type AlbumCard } from '@/models/album';

export const scrapeAlbumCards = (stringifiedHtml: string) => {
  const albumCards: Partial<AlbumCard>[] = [];

  const $ = load(stringifiedHtml);

  const wrapperSelector = '.d-sm-block';
  const doesWrapperExist = $(wrapperSelector).length !== 0;
  const albumCardElementsSelector = doesWrapperExist ? `${wrapperSelector} .album-card` : '.album-card';

  const albumCardElements = $(albumCardElementsSelector);

  albumCardElements.each((_, albumCardElement) => {
    const id = $('a.album-card__image', albumCardElement).attr('href')?.slice(8);
    const coverSrc = $('img.album-card__image', albumCardElement).attr('src')?.replace('350x100', '100x100');
    const title = $('.album-card__title', albumCardElement).text().trim();
    const artist = $('.album-card__author a', albumCardElement).text().trim();
    const artistId = $('.album-card__author a', albumCardElement).attr('href')?.slice(8).trim();

    const albumCard = {
      id,
      artist,
      artistId,
      coverSrc,
      title
    };

    albumCards.push(albumCard);
  });

  return albumCardSchema.array().parse(albumCards);
};
