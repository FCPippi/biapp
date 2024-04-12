import { z } from 'zod';

export const CreateAccountDto = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  birthdate: z.string(),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
  graduation: z.enum(['EXATAS', 'HUMANAS', 'BIOLOGICAS']),
  gender: z.enum(['HOMEM', 'MULHER', 'OUTRO']),
});

export type CreateAccountDtoSchema = z.infer<typeof CreateAccountDto>;
