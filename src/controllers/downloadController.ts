import { pipeline } from 'stream/promises';

import { getTrackStream } from '@/external-api';

import type { Request, Response } from 'express';

export const downloadController = async (req: Request, res: Response) => {
  const { trackId } = req.params;
  if (!trackId) {
    res.status(400).send('Track ID is not set');
    return;
  }

  const { stream } = await getTrackStream(trackId);

  if (!stream) {
    res.status(500).send(`Cannot serve track ${trackId} for downloading`);
    return;
  }

  const { artist, title } = req.query;
  const filename = encodeURIComponent(`${artist ?? 'Unknown Artist'} - ${title ?? 'Unknown Track'}.mp3`);

  try {
    res.writeHead(200, {
      'content-disposition': `attachment; filename=${filename}`,
      'content-type': 'audio/mpeg'
    });

    await pipeline(stream, res);
  } catch {
    // ignore ERR_STREAM_PREMATURE_CLOSE
  }
};
