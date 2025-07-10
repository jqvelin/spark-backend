import { z } from 'zod/v4';

import { trackSchema } from './track.schema';

export type Track = z.infer<typeof trackSchema>;

export type HomepageTrackGroups = {
  fresh: Track[],
  trendingWorldwide: Track[],
  bestOfToday: Track[],
  trendingInRussia: Track[]
};
