import { z } from 'zod/v4';

import { artistSchema, artistSearchResultSchema } from './artist.schema';

export type Artist = z.infer<typeof artistSchema>;

export type ArtistSearchResult = z.infer<typeof artistSearchResultSchema>;
