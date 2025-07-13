import { z } from 'zod/v4';

import { albumCardSchema, albumSchema, albumSearchResultSchema } from './album.schema';

export type Album = z.infer<typeof albumSchema>;

export type AlbumCard = z.infer<typeof albumCardSchema>;

export type AlbumSearchResult = z.infer<typeof albumSearchResultSchema>;
