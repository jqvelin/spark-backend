import { z } from 'zod/v4';

import { albumSchema } from '../album';
import { trackSchema } from '../track';

export const artistSchema = z.object({
  id: z.string(),
  name: z.string(),
  tracks: z.array(trackSchema),
  imageSrc: z.nullish(z.string()),
  albums: z.array(albumSchema)
});
