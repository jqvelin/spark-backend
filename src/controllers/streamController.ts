import { pipeline } from 'node:stream/promises';

import { streamingApi } from '@/external-api';

import type { Request, Response } from 'express';

export const streamController = async (req: Request, res: Response) => {
  const { trackId } = req.params;
  if (!trackId) {
    res.status(400).send('Track ID is not set');
    return;
  }

  const range = req.headers.range;
  if (!range) {
    res.status(400).send('Range is not set');
    return;
  }

  try {
    const trackResponse = await streamingApi.get(`${trackId}.mp3`, {
      headers: {
        range
      }
    });

    const trackStream = trackResponse.body;

    if (!trackStream) {
      res.status(500).send(`Cannot stream track ${trackId}`);
      return;
    }

    res.writeHead(206, {
      'accept-ranges': 'bytes',
      'content-range': trackResponse.headers.get('content-range')!,
      'content-length': trackResponse.headers.get('content-length')!,
      'content-type': trackResponse.headers.get('content-type')!,
      'cache-control': trackResponse.headers.get('cache-control')!,
      'access-control-expose-headers': 'Content-Length, Content-Range'
    });

    await pipeline(trackStream, res);
  } catch {
    // ignore ERR_STREAM_PREMATURE_CLOSE
  }
};
