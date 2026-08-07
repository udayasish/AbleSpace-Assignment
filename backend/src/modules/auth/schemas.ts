import { z } from 'zod';

/** Body is optional — the refresh token usually arrives via cookie. */
export const refreshSchema = z
  .object({ refreshToken: z.string().min(1).optional() })
  .optional();

export type RefreshDto = z.infer<typeof refreshSchema>;
