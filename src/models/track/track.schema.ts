import { z } from 'zod/v4';

export const trackSchema = z.object({
  id: z.string(),
  coverSrc: z.nullish(z.string()),
  title: z.string(),
  artist: z.string(),
  duration: z.number()
});
