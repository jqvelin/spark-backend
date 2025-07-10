import NodeCache from 'node-cache';

import { DEFAULT_CACHE_TTL_SEC } from './constants';

export const cache = new NodeCache({
  stdTTL: DEFAULT_CACHE_TTL_SEC
});
