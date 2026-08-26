import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = (path: string) => readFileSync(join(__dirname, path), 'utf8');

describe('backend module boundaries', () => {
  it('owns one Prisma client in the database module', () => {
    const modules = [
      'modules/identity/identity.module.ts',
      'modules/session/session.module.ts',
      'modules/access-control/access-control.module.ts',
    ];
    expect(modules.map(source).join('\n')).not.toMatch(/new PrismaClient/);
    expect(
      source('database/database.module.ts').match(/extends PrismaClient/g),
    ).toHaveLength(1);
    expect(source('database/database.module.ts')).toMatch(
      /await this\.\$disconnect\(\)/,
    );
    expect(source('main.ts')).toMatch(/enableShutdownHooks\(\)/);
  });

  it('does not wire an empty security module', () => {
    expect(source('app.module.ts')).not.toMatch(/SecurityModule/);
  });

  it('keeps IAM controller out of authentication composition', () => {
    expect(
      source('modules/authentication/authentication.module.ts'),
    ).not.toMatch(/IamAdminController/);
  });
});
