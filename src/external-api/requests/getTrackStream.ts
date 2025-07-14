import type { Track } from '@/models/track';

import { STREAMING_API_ENDPOINTS } from '../endpoints';
import { streamingApi } from '../streamingApi';

import type { Options } from 'ky';

export const getTrackStream = async (trackId: Track['id'], headers?: Options['headers']) => {
  const trackResponse = await streamingApi.get(STREAMING_API_ENDPOINTS.stream(trackId), {
    headers
  });

  return {
    stream: trackResponse.body,
    responseHeaders: trackResponse.headers
  };
};
