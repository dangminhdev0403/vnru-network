import { ExpertService } from './expert.service';

const makeRow = (overrides: any = {}) => ({
  id: '11111111-1111-4111-8111-111111111111',
  createdAt: new Date('2026-01-01T00:00:00Z'),
  displayName: 'A',
  bio: null,
  country: 'VN',
  language: 'vi',
  visibility: 'PUBLIC',
  userRef: 'secret',
  version: 1,
  organization: { id: '22222222-2222-4222-8222-222222222222', name: 'Org', country: 'VN' },
  expertises: [{ expertise: { id: '33333333-3333-4333-8333-333333333333', slug: 'ai', labels: { en: 'AI' } } }],
  ...overrides,
});

describe('ExpertService', () => {
  it('list emits only approved public projection', async () => {
    const rows = [makeRow()];
    const result = await new ExpertService({ findPublic: jest.fn().mockResolvedValue(rows) } as never).list({ limit: 20 });
    expect(result.items[0]).not.toHaveProperty('userRef');
    expect(result.items[0].expertises[0].slug).toBe('ai');
    expect(result.nextCursor).toBeNull();
  });

  it('findById returns projection for public expert', async () => {
    const row = makeRow();
    const svc = new ExpertService({ findPublicById: jest.fn().mockResolvedValue(row) } as never);
    const result = await svc.findById('11111111-1111-4111-8111-111111111111');
    expect(result).not.toBeNull();
    expect(result).not.toHaveProperty('userRef');
    expect(result!.id).toBe(row.id);
    expect(result!.organization.name).toBe('Org');
  });

  it('findById returns null when not found', async () => {
    const svc = new ExpertService({ findPublicById: jest.fn().mockResolvedValue(null) } as never);
    expect(await svc.findById('11111111-1111-4111-8111-111111111111')).toBeNull();
  });

  it('findMatches returns null when expert not found', async () => {
    const svc = new ExpertService({ findPublicById: jest.fn().mockResolvedValue(null) } as never);
    expect(await svc.findMatches('11111111-1111-4111-8111-111111111111', 20)).toBeNull();
  });

  it('findMatches returns matched experts with reasons', async () => {
    const expert = makeRow({ id: 'aaaa1111-1111-4111-8111-111111111111' });
    const candidate = makeRow({ id: 'bbbb2222-2222-4222-8222-222222222222', displayName: 'B', country: 'RU' });
    const noOverlap = makeRow({
      id: 'cccc3333-3333-4333-8333-333333333333',
      displayName: 'C',
      expertises: [{ expertise: { id: '44444444-4444-4444-8444-444444444444', slug: 'bio', labels: { en: 'Bio' } } }],
    });

    const repo = {
      findPublicById: jest.fn().mockResolvedValue(expert),
      findPublicCandidates: jest.fn().mockResolvedValue([expert, candidate, noOverlap]),
    };
    const result = await new ExpertService(repo as never).findMatches('aaaa1111-1111-4111-8111-111111111111', 20);

    expect(result).not.toBeNull();
    expect(result!.items).toHaveLength(1);
    expect(result!.items[0].expert.id).toBe('bbbb2222-2222-4222-8222-222222222222');
    expect(result!.items[0].expert).not.toHaveProperty('userRef');
    expect(result!.items[0].reasons).toHaveLength(1);
    expect(result!.items[0].reasons[0].slug).toBe('ai');
    expect(result!.items[0].reasons[0].labels).toEqual({ en: 'AI' });
    // No percentage or score
    expect((result!.items[0] as any).score).toBeUndefined();
  });
});
