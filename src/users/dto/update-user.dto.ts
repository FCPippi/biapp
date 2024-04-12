import { z } from 'zod';

export const UpdateAccountDto = z.object({
  name: z.string().optional(),
  birthdate: z.string().optional(),
  graduation: z.enum(['EXATAS', 'HUMANAS', 'BIOLOGICAS']).optional(),
  gender: z.enum(['HOMEM', 'MULHER', 'OUTRO']).optional(),
});

export type UpdateAccountDtoSchema = z.infer<typeof UpdateAccountDto>;
