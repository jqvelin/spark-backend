import { z } from 'zod/v4';

import { trackPermissionSchema, trackSchema } from './track.schema';

export type Track = z.infer<typeof trackSchema>;

export type HomepageTrackCategories = {
  fresh: Track[],
  trendingWorldwide: Track[],
  bestOfToday: Track[],
  trendingInRussia: Track[]
};

export type TrackPermission = z.infer<typeof trackPermissionSchema>;
