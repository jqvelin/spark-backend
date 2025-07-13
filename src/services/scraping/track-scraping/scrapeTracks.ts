import { load, type BasicAcceptedElems } from 'cheerio';

import { trackSchema, type Track } from '@/models/track';

import type { AnyNode } from 'domhandler';

export const scrapeTracks = (stringifiedHtml: string, context?: BasicAcceptedElems<AnyNode>) => {
  const tracks: Partial<Track>[] = [];

  const $ = load(stringifiedHtml);

  const trackElements = $('.playlist .track.song-item', context);

  trackElements.each((_, trackElement) => {
    const id = $('.track__user-panel', trackElement).attr('data-js-id');
    const coverSrc = $('.track__image', trackElement).attr('src');
    const artist = $('.track__user-panel', trackElement).attr('data-js-artist-name');
    const title = $('.track__user-panel', trackElement).attr('data-js-song-title');

    // Converting the "mm:ss" duration format into seconds
    const rawDuration = $('.track__info-item', trackElement).first().text().trim();
    const [minutes, seconds] = rawDuration.split(':').map(Number);
    if (typeof minutes === 'undefined' || typeof seconds === 'undefined') {
      throw new Error('Can\'t parse track duration');
    }
    const duration = minutes * 60 + seconds;

    const track = {
      id,
      artist,
      coverSrc,
      duration,
      title
    };

    tracks.push(track);
  });

  return trackSchema.array().parse(tracks);
};
