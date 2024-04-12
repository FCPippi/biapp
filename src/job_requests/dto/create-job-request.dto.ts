import { z } from 'zod';

export const CreateJobRequestDto = z.object({
  title: z.string(),
  description: z.string(),
  graduation: z.enum(['EXATAS', 'HUMANAS', 'BIOLOGICAS']),
});

export type CreateJobRequestDtoSchema = z.infer<typeof CreateJobRequestDto>;
