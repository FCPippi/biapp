import { z } from 'zod';

export const UpdateJobDto = z.object({
  descricao: z.string().optional(),
  curso: z.enum(['EXATAS', 'HUMANAS', 'BIOLOGICAS']).optional(),
});

export type UpdateJobDtoSchema = z.infer<typeof UpdateJobDto>;
