import { z } from 'zod/v4';

import { albumSchema } from './album.schema';

export type Album = z.infer<typeof albumSchema>;
