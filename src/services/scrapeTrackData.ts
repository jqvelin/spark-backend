import { load } from 'cheerio';

import { trackSchema } from '@/models/track';

export const scrapeTrackData = (stringifiedHtml: string) => {
  const $ = load(stringifiedHtml);

  const id = $('.track__user-panel').attr('data-js-id');
  const coverSrc = $('.track__image').attr('src');
  const artist = $('.track__user-panel').attr('data-js-artist-name');
  const title = $('.track__user-panel').attr('data-js-song-title');

  const rawDuration = $('.track__info-item').first().text().trim();
  const [minutes, seconds] = rawDuration.split(':').map(Number);
  if (typeof minutes === 'undefined' || typeof seconds === 'undefined') {
    throw new Error('Can\'t parse track duration');
  }
  const duration = minutes * 60 + seconds;

  return trackSchema.parse({
    id,
    artist,
    coverSrc,
    duration,
    title
  });
};
