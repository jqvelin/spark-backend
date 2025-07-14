import 'dotenv/config';
import { z } from 'zod/v4';

const envSchema = z.object({
  PORT: z.coerce.number(),
  BASE_DATA_API_URL: z.url(),
  BASE_STREAMING_API_URL: z.url(),

  NODE_ENV: z.enum(['development', 'production', 'test'])
});

export const env = envSchema.parse(process.env);
