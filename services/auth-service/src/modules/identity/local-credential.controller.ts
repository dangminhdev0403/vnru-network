import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { LocalCredentialService } from './local-credential.service';

const password = z.string().min(8).max(128);

@Controller('api/v1/auth')
export class LocalCredentialController {
  constructor(private readonly credentials: LocalCredentialService) {}

  @Post('register')
  async register(@Body() body: unknown) {
    const parsed = z
      .object({
        fullName: z.string().trim().min(2).max(150),
        email: z.email().transform((value) => value.toLowerCase()),
        password,
      })
      .strict()
      .safeParse(body);
    if (!parsed.success) throw new BadRequestException('Invalid registration');
    return this.credentials.register(parsed.data);
  }

  @Post('credentials/verify')
  async verify(@Body() body: unknown) {
    const parsed = z
      .object({ account: z.email(), password })
      .strict()
      .safeParse(body);
    if (!parsed.success) return { valid: false };
    return {
      valid: await this.credentials.verify(
        parsed.data.account,
        parsed.data.password,
      ),
    };
  }
}
