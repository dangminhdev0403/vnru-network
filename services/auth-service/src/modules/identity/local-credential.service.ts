import { ConflictException, Injectable } from '@nestjs/common';
import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';
import { DatabaseClient } from '../../database/database.module';

const scrypt = promisify(scryptCallback);
const ISSUER = 'authjs:credentials';

export async function createLocalPasswordDigest(password: string) {
  const salt = randomBytes(16).toString('hex');
  const passwordHash = ((await scrypt(password, salt, 64)) as Buffer).toString(
    'hex',
  );
  return { salt, passwordHash };
}

@Injectable()
export class LocalCredentialService {
  constructor(private readonly prisma: DatabaseClient) {}

  private async digest(password: string, salt: string): Promise<Buffer> {
    return (await scrypt(password, salt, 64)) as Buffer;
  }

  async register(input: { fullName: string; email: string; password: string }) {
    const email = input.email.trim().toLowerCase();
    if (await this.prisma.user.findUnique({ where: { email } })) {
      throw new ConflictException('Account already exists');
    }
    const { salt, passwordHash } = await createLocalPasswordDigest(
      input.password,
    );
    const names = input.fullName.trim().split(/\s+/);
    try {
      const account = await this.prisma.$transaction(async (tx) => {
        const readerRole = await tx.role.findUnique({
          where: { name: 'READER' },
          select: { id: true },
        });
        if (!readerRole) throw new Error('READER role is not configured');
        const user = await tx.user.create({
          data: {
            email,
            firstName: names.slice(0, -1).join(' ') || names[0],
            lastName: names.length > 1 ? names.at(-1) : '',
          },
        });
        await tx.localCredential.create({
          data: { userId: user.id, salt, passwordHash },
        });
        await tx.externalIdentity.create({
          data: { issuer: ISSUER, subject: email, userId: user.id },
        });
        await tx.roleAssignment.create({
          data: {
            userId: user.id,
            roleId: readerRole.id,
            contextType: 'PLATFORM',
            contextId: 'GLOBAL',
            status: 'ACTIVE',
          },
        });
        return { id: user.id, email };
      });
      return account;
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error &&
        'code' in error &&
        error.code === 'P2002'
      )
        throw new ConflictException('Account already exists');
      throw error;
    }
  }

  async verify(emailInput: string, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: emailInput.trim().toLowerCase() },
      include: { credential: true },
    });
    if (!user?.credential || user.status !== 'ACTIVE') return false;
    const supplied = await this.digest(password, user.credential.salt);
    const expected = Buffer.from(user.credential.passwordHash, 'hex');
    return (
      supplied.length === expected.length && timingSafeEqual(supplied, expected)
    );
  }
}
