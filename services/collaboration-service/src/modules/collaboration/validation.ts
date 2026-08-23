import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

const uuid = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Invalid UUID');
const text = (max: number) => z.string().trim().min(1).max(max);
const participant = z.strictObject({ userId: uuid, organizationRef: text(255) });

export const createOpportunitySchema = z.strictObject({
  id: uuid,
  title: text(255),
  description: z.string().trim().max(5000).optional(),
});
export const createProposalSchema = z.strictObject({
  id: uuid,
  opportunityId: uuid,
  content: text(10_000),
  vnParticipant: participant,
  ruParticipant: participant,
});
export const reviseProposalSchema = z.strictObject({ content: text(10_000), expectedRevision: z.int().positive() });
export const screenProposalSchema = z.strictObject({ eligible: z.boolean(), reason: text(5000) });
export const decisionProposalSchema = z.strictObject({
  approved: z.boolean(),
  reason: text(5000),
  requestRevision: z.boolean().optional(),
}).refine((value) => !(value.approved && value.requestRevision), {
  message: 'approved and requestRevision cannot both be true',
});

export function parseBody<T>(schema: z.ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new BadRequestException({
      error: { code: 'INVALID_BODY', message: z.prettifyError(result.error) },
    });
  }
  return result.data;
}
