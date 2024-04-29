import { z } from 'zod';

export const ReportDto = z.object({
  reason: z.string(),
});

export type ReportDtoSchema = z.infer<typeof ReportDto>;
