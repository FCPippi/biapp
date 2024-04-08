import { z } from 'zod'

export const CreateJobDto = z.object({
  idAluno: z.string(),
  descricao: z.string(),
  valor: z.number(),
})

export type CreateJobDtoSchema = z.infer<typeof CreateJobDto>
