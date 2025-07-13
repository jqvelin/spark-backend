import { z } from 'zod/v4';

import { albumCardSchema } from '@/models/album/@x/artist';
import { trackSchema } from '@/models/track/@x/artist';

export const artistSchema = z.object({
  id: z.string(),
  name: z.string(),
  tracks: z.array(trackSchema),
  imageSrc: z.nullish(z.string()),
  albumCards: z.array(albumCardSchema)
});

export const artistSearchResultSchema = artistSchema.pick({
  id: true,
  name: true
});
