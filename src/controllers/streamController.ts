import { pipeline } from 'node:stream/promises';

import { getTrackStream } from '@/external-api';

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
    const { stream, responseHeaders } = await getTrackStream(trackId, {
      range
    });

    if (!stream) {
      res.status(500).send(`Cannot stream track ${trackId}`);
      return;
    }

    res.writeHead(206, {
      'accept-ranges': 'bytes',
      'content-range': responseHeaders.get('content-range')!,
      'content-length': responseHeaders.get('content-length')!,
      'content-type': responseHeaders.get('content-type')!,
      'cache-control': responseHeaders.get('cache-control')!,
      'access-control-expose-headers': 'Content-Length, Content-Range'
    });

    await pipeline(stream, res);
  } catch {
    // ignore ERR_STREAM_PREMATURE_CLOSE
  }
};
