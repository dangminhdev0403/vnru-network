import { readFileSync } from 'node:fs';
import { join } from 'node:path';

test('knowledge modules do not import another module repository', () => {
  const publication = readFileSync(join(__dirname, 'modules/publications/publication.service.ts'), 'utf8');
  const directory = readFileSync(join(__dirname, 'modules/directory/expert.service.ts'), 'utf8');
  expect(publication).not.toMatch(/modules\/directory\/.*repository/);
  expect(directory).not.toMatch(/modules\/publications\/.*repository/);
});
