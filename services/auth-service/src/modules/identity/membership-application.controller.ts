import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { z } from 'zod';
import { MembershipApplicationService } from './membership-application.service';

const membershipApplicationSchema = z
  .object({
    fullName: z.string().trim().min(2).max(150),
    email: z
      .string()
      .trim()
      .max(254)
      .pipe(z.email())
      .transform((value) => value.toLowerCase()),
    organization: z.string().trim().min(2).max(200),
    professionalRole: z.string().trim().min(2).max(120),
    interest: z.string().trim().min(10).max(2000),
  })
  .strict();

@Controller('api/v1/membership-applications')
export class MembershipApplicationController {
  // ponytail: per-process throttle; replace with shared storage when backend runs multiple instances.
  private readonly attempts = new Map<string, number[]>();

  constructor(private readonly service: MembershipApplicationService) {}

  @Post()
  async create(@Body() body: unknown, @Req() request?: Request) {
    const ip = request?.ip ?? 'unknown';
    const cutoff = Date.now() - 10 * 60_000;
    const attempts = (this.attempts.get(ip) ?? []).filter(
      (time) => time > cutoff,
    );
    if (attempts.length >= 5)
      throw new HttpException('Too many applications', 429);
    attempts.push(Date.now());
    this.attempts.set(ip, attempts);

    const parsed = membershipApplicationSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues[0]?.message ?? 'Invalid membership application',
      );
    }
    return this.service.create(parsed.data);
  }
}
