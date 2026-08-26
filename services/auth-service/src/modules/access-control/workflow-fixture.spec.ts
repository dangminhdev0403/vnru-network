import * as fs from 'node:fs';
import * as path from 'node:path';

interface FixtureDocument {
  fixtures: Array<{
    role: { name: string };
    permissions: Array<{ key: string }>;
  }>;
}

describe('Portal access fixtures', () => {
  it('contains only the current three roles and four capabilities', () => {
    const document = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../../../prisma/iam-fixtures.json'),
        'utf8',
      ),
    ) as FixtureDocument;
    const roles = [
      ...new Set(document.fixtures.map((fixture) => fixture.role.name)),
    ].sort();
    const permissions = [
      ...new Set(
        document.fixtures.flatMap((fixture) =>
          fixture.permissions.map((permission) => permission.key),
        ),
      ),
    ].sort();

    expect(document.fixtures).toHaveLength(7);
    expect(roles).toEqual(['PORTAL_MEMBER', 'READER', 'SUPER_ADMIN']);
    expect(permissions).toEqual([
      'iam.audit.view',
      'iam.roles.manage',
      'iam.users.manage',
      'portal.member.access',
    ]);
  });
});
