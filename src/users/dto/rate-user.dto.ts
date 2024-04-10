import { z } from 'zod';

export const RateAccountDto = z.object({
  recipientId: z.string(),
  value: z.coerce.number().int().lte(5).gte(0),
  comment: z.string().optional(),
});

export type RateAccountDtoSchema = z.infer<typeof RateAccountDto>;
