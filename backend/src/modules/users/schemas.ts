import { z } from 'zod';

export const themeModes = ['light', 'dark'] as const;
export const accentColors = [
  'amber',
  'blue',
  'pink',
  'rose',
  'emerald',
  'black',
] as const;

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  username: z.string().min(1).max(60).optional(),
  title: z.string().max(120).optional(),
  email: z.email().max(255).optional(),
  themeMode: z.enum(themeModes).optional(),
  accentColor: z.enum(accentColors).optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
