import ky from 'ky';

export const api = ky.create({
  prefixUrl: process.env.BASE_API_URL,
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
});
