import ky from 'ky';

import { env } from '@/config';

export const streamingApi = ky.create({
  prefixUrl: env.BASE_STREAMING_API_URL,
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
});
