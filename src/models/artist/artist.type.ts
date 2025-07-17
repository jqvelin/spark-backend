import { z } from 'zod/v4';

import { artistSchema } from './artist.schema';

export type Artist = z.infer<typeof artistSchema>;
