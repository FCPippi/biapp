import { z } from 'zod';

export const UpdateJobDto = z.object({
  descricao: z.string().optional(),
  valor: z.number().optional(),
  isClosed: z.boolean().optional(),
});

export type UpdateJobDtoSchema = z.infer<typeof UpdateJobDto>;
