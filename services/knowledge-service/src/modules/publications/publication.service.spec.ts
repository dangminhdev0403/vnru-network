import { PublicationService } from './publication.service';

describe('PublicationService', () => {
  it('uses limit+1 and emits an opaque next cursor', async () => {
    const rows = [
      { id:'11111111-1111-4111-8111-111111111111', createdAt:new Date('2026-08-20T00:00:00Z'), title:'A', type:'ARTICLE', language:'en', year:2026, country:'VN', organizationRef:null, visibility:'PUBLIC', authors:[], topics:[] },
      { id:'22222222-2222-4222-8222-222222222222', createdAt:new Date('2026-08-19T00:00:00Z'), title:'B', type:'ARTICLE', language:'en', year:2026, country:'RU', organizationRef:null, visibility:'PUBLIC', authors:[], topics:[] },
    ];
    const repository = { findPublic: jest.fn().mockResolvedValue(rows), findOnePublic: jest.fn() };
    const result = await new PublicationService(repository as never).list({ limit: 1 });
    expect(repository.findPublic).toHaveBeenCalledWith({ limit: 1 }, 2);
    expect(result.items).toHaveLength(1); expect(result.nextCursor).toEqual(expect.any(String));
    expect(result.items[0]).not.toHaveProperty('createdAt');
  });
  it('findOne returns projected detail with abstract for PUBLIC row', async () => {
    const row = { id:'11111111-1111-4111-8111-111111111111', title:'A', abstract:'abs', type:'ARTICLE', language:'en', year:2026, country:'VN', organizationRef:null, visibility:'PUBLIC', version:1, createdAt:new Date(), updatedAt:new Date(), authors:[], topics:[{ publicationId:'x', topicId:'t1', topic:{ id:'t1', slug:'ai', labels:{en:'AI'} } }] };
    const repository = { findPublic: jest.fn(), findOnePublic: jest.fn().mockResolvedValue(row) };
    const result = await new PublicationService(repository as never).findOne('11111111-1111-4111-8111-111111111111');
    expect(result).not.toBeNull();
    expect(result!.abstract).toBe('abs');
    expect(result!.topics[0]).toEqual({ id:'t1', slug:'ai', labels:{en:'AI'} });
    expect(result).not.toHaveProperty('version');
    expect(result).not.toHaveProperty('createdAt');
  });
  it('findOne returns null when repo returns null', async () => {
    const repository = { findPublic: jest.fn(), findOnePublic: jest.fn().mockResolvedValue(null) };
    const result = await new PublicationService(repository as never).findOne('11111111-1111-4111-8111-111111111111');
    expect(result).toBeNull();
  });
});
