import { readFileSync } from 'node:fs';
import { join } from 'node:path';

test('domain modules do not import another module repository', () => {
  for (const [module, forbidden] of [
    ['reviews', /modules\/(collaboration|projects)\/.*repository/],
    ['projects', /modules\/(collaboration|reviews)\/.*repository/],
    ['collaboration', /modules\/(reviews|projects)\/.*repository/],
  ] as const) {
    for (const file of ['controller', 'service', 'repository']) {
      const path = join(__dirname, 'modules', module, `${module === 'collaboration' ? 'grant' : module.slice(0, -1)}.${file}.ts`);
      expect(readFileSync(path, 'utf8')).not.toMatch(forbidden);
    }
  }
});
