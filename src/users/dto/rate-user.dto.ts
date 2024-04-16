import { z } from 'zod';

export const RateAccountDto = z.object({
  value: z.coerce.number().int().lte(5).gte(0),
  comment: z.string().optional(),
});

export type RateAccountDtoSchema = z.infer<typeof RateAccountDto>;
