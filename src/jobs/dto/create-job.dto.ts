import { z } from 'zod';

export const CreateJobDto = z.object({
  idAluno: z.string(),
  descricao: z.string(),
  curso: z.enum(['EXATAS', 'HUMANAS', 'BIOLOGICAS']),
  valor: z.number(),
});

export type CreateJobDtoSchema = z.infer<typeof CreateJobDto>;
