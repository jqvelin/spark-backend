import { z } from 'zod/v4';

import { trackSchema } from '@/models/track/@x/album';

export const albumSchema = z.object({
  id: z.string(),
  coverSrc: z.nullish(z.string()),
  title: z.string(),
  artist: z.string(),
  artistId: z.string(),
  tracks: trackSchema.array(),
  genres: z.string().array()
});
