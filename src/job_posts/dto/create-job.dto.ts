import { z } from 'zod';

export const CreateJobDto = z.object({
  title: z.string(),
  description: z.string(),
  value: z.number(),
});

export type CreateJobDtoSchema = z.infer<typeof CreateJobDto>;
