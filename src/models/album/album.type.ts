import { z } from 'zod/v4';

import { albumSchema, albumSearchResultSchema } from './album.schema';

export type Album = z.infer<typeof albumSchema>;

export type AlbumSearchResult = z.infer<typeof albumSearchResultSchema>;
