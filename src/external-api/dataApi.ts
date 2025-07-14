import ky from 'ky';

import { env } from '@/config';

export const dataApi = ky.create({
  prefixUrl: env.BASE_DATA_API_URL,
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
});
