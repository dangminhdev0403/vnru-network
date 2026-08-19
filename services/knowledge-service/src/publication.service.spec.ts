import { PublicationService } from './publication.service';

describe('PublicationService', () => {
  it('uses limit+1 and emits an opaque next cursor', async () => {
    const rows = [
      { id:'11111111-1111-4111-8111-111111111111', createdAt:new Date('2026-08-20T00:00:00Z'), title:'A', type:'ARTICLE', language:'en', year:2026, country:'VN', organizationRef:null, visibility:'PUBLIC', authors:[], topics:[] },
      { id:'22222222-2222-4222-8222-222222222222', createdAt:new Date('2026-08-19T00:00:00Z'), title:'B', type:'ARTICLE', language:'en', year:2026, country:'RU', organizationRef:null, visibility:'PUBLIC', authors:[], topics:[] },
    ];
    const repository = { findPublic: jest.fn().mockResolvedValue(rows) };
    const result = await new PublicationService(repository as never).list({ limit: 1 });
    expect(repository.findPublic).toHaveBeenCalledWith({ limit: 1 }, 2);
    expect(result.items).toHaveLength(1); expect(result.nextCursor).toEqual(expect.any(String));
    expect(result.items[0]).not.toHaveProperty('createdAt');
  });
});
