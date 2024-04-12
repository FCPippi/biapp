import { z } from 'zod';

export const CreateJobPostDto = z.object({
  title: z.string(),
  description: z.string(),
  value: z.number(),
});

export type CreateJobPostDtoSchema = z.infer<typeof CreateJobPostDto>;
