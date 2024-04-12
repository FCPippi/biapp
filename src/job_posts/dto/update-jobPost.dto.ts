import { z } from 'zod';

export const UpdateJobPostDto = z.object({
  descricao: z.string().optional(),
  valor: z.number().optional(),
  isClosed: z.boolean().optional(),
});

export type UpdateJobPostDtoSchema = z.infer<typeof UpdateJobPostDto>;
