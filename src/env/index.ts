import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  SESSION_SECRET: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variabels');

  throw new Error('Invalid environment variables.');
}

export const env = _env.data;
